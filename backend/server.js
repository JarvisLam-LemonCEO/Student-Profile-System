import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backupPath = path.resolve(__dirname, "../student_profile_backup.json");

const app = express();
const db = new Database(path.resolve(__dirname, "students.sqlite"));

app.use(cors());
app.use(express.json({ limit: "50mb" }));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS classes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    data TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS meta (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

function normalizeStudent(student = {}) {
  return {
    ...student,
    id: student.id || crypto.randomUUID(),
    gender: student.gender || "",
    birthday: student.birthday || "",
    weight: student.weight || "",
    height: student.height || "",
    bloodType: student.bloodType || "",
    image: student.image || "",
    teacherAssignments: Array.isArray(student.teacherAssignments)
      ? student.teacherAssignments
      : [],
    skills: student.skills || {
      communication: 0,
      teamwork: 0,
      problemSolving: 0,
      leadership: 0,
      creativity: 0,
      discipline: 0,
    },
    grades: Array.isArray(student.grades) ? student.grades : [],
    notes: Array.isArray(student.notes) ? student.notes : [],
  };
}

function normalizeClass(classItem = {}) {
  return {
    ...classItem,
    id: classItem.id || crypto.randomUUID(),
    name: classItem.name || "Untitled Class",
    description: classItem.description || "",
    students: Array.isArray(classItem.students)
      ? classItem.students.map(normalizeStudent)
      : [],
  };
}

function readDatabaseBackup() {
  const users = db.prepare("SELECT id, username, password FROM users").all();

  const classes = db
    .prepare("SELECT data FROM classes ORDER BY name COLLATE NOCASE")
    .all()
    .map((row) => JSON.parse(row.data));

  const currentUser = db
    .prepare("SELECT value FROM meta WHERE key = ?")
    .get("currentUser");

  return {
    users,
    classes,
    currentUser: currentUser ? JSON.parse(currentUser.value) : null,
  };
}

function writeDatabaseBackup(data) {
  const users = Array.isArray(data.users) ? data.users : [];
  const classes = Array.isArray(data.classes)
    ? data.classes.map(normalizeClass)
    : [];
  const currentUser = data.currentUser || users[0] || null;

  const save = db.transaction(() => {
    db.prepare("DELETE FROM users").run();
    db.prepare("DELETE FROM classes").run();
    db.prepare("DELETE FROM meta WHERE key = ?").run("currentUser");

    const insertUser = db.prepare(
      "INSERT OR REPLACE INTO users (id, username, password) VALUES (?, ?, ?)"
    );

    const insertClass = db.prepare(
      "INSERT OR REPLACE INTO classes (id, name, description, data) VALUES (?, ?, ?, ?)"
    );

    for (const user of users) {
      insertUser.run(user.id || crypto.randomUUID(), user.username, user.password);
    }

    for (const classItem of classes) {
      insertClass.run(
        classItem.id,
        classItem.name,
        classItem.description || "",
        JSON.stringify(classItem)
      );
    }

    if (currentUser) {
      db.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)").run(
        "currentUser",
        JSON.stringify(currentUser)
      );
    }
  });

  save();
}

function seedDefaultUser() {
  const defaultUser = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get("teacher");

  if (!defaultUser) {
    db.prepare("INSERT INTO users (id, username, password) VALUES (?, ?, ?)").run(
      crypto.randomUUID(),
      "teacher",
      "123456"
    );
  }
}

function migrateJsonBackupToSql() {
  const alreadyMigrated = db
    .prepare("SELECT value FROM meta WHERE key = ?")
    .get("jsonBackupMigrated");

  const classCount = db.prepare("SELECT COUNT(*) AS count FROM classes").get().count;

  if (alreadyMigrated || classCount > 0 || !fs.existsSync(backupPath)) {
    return;
  }

  try {
    const backup = JSON.parse(fs.readFileSync(backupPath, "utf8"));
    writeDatabaseBackup(backup);

    db.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)").run(
      "jsonBackupMigrated",
      JSON.stringify({
        migratedAt: new Date().toISOString(),
        source: backupPath,
      })
    );

    console.log("Migrated student_profile_backup.json into SQLite.");
  } catch (error) {
    console.error("Could not migrate student_profile_backup.json:", error);
  }
}

seedDefaultUser();
migrateJsonBackupToSql();

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = db
    .prepare("SELECT id, username, password FROM users WHERE username = ? AND password = ?")
    .get(username, password);

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid login" });
  }

  db.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)").run(
    "currentUser",
    JSON.stringify(user)
  );

  res.json({ success: true, user });
});

app.post("/api/logout", (req, res) => {
  db.prepare("DELETE FROM meta WHERE key = ?").run("currentUser");
  res.json({ success: true });
});

app.get("/api/current-user", (req, res) => {
  const row = db.prepare("SELECT value FROM meta WHERE key = ?").get("currentUser");
  res.json(row ? JSON.parse(row.value) : null);
});

app.get("/api/users", (req, res) => {
  res.json(db.prepare("SELECT id, username, password FROM users").all());
});

app.get("/api/classes", (req, res) => {
  res.json(readDatabaseBackup().classes);
});

app.post("/api/classes", (req, res) => {
  const currentBackup = readDatabaseBackup();
  writeDatabaseBackup({ ...currentBackup, classes: req.body });
  res.json({ success: true });
});

app.get("/api/backup", (req, res) => {
  res.json(readDatabaseBackup());
});

app.post("/api/backup/import", (req, res) => {
  writeDatabaseBackup(req.body);
  res.json({ success: true });
});

app.listen(3001, () => {
  console.log("Backend running at http://localhost:3001");
});