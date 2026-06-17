import express from "express";
import cors from "cors";
import Database from "better-sqlite3";

const app = express();
const db = new Database("students.sqlite");

app.use(cors());
app.use(express.json({ limit: "10mb" }));

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

const defaultUser = db.prepare("SELECT * FROM users WHERE username = ?").get("teacher");

if (!defaultUser) {
  db.prepare("INSERT INTO users (id, username, password) VALUES (?, ?, ?)").run(
    crypto.randomUUID(),
    "teacher",
    "123456"
  );
}

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = db
    .prepare("SELECT * FROM users WHERE username = ? AND password = ?")
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

app.get("/api/classes", (req, res) => {
  const rows = db.prepare("SELECT data FROM classes").all();
  res.json(rows.map((row) => JSON.parse(row.data)));
});

app.post("/api/classes", (req, res) => {
  const classes = req.body;

  const deleteAll = db.prepare("DELETE FROM classes");
  const insertClass = db.prepare(`
    INSERT INTO classes (id, name, description, data)
    VALUES (?, ?, ?, ?)
  `);

  const save = db.transaction(() => {
    deleteAll.run();

    for (const classItem of classes) {
      insertClass.run(
        classItem.id,
        classItem.name,
        classItem.description || "",
        JSON.stringify(classItem)
      );
    }
  });

  save();

  res.json({ success: true });
});

app.listen(3001, () => {
  console.log("Backend running at http://localhost:3001");
});