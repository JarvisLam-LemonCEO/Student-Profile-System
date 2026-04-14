import { db } from "./db";

const DEFAULT_USER = {
  id: crypto.randomUUID(),
  username: "teacher",
  password: "123456",
};

export async function seedDatabase() {
  const userCount = await db.users.count();

  if (userCount === 0) {
    await db.users.add(DEFAULT_USER);
  }
}

export async function getUsers() {
  return await db.users.toArray();
}

export async function getClasses() {
  return await db.classes.toArray();
}

export async function saveAllClasses(classes) {
  await db.transaction("rw", db.classes, async () => {
    await db.classes.clear();

    if (classes.length > 0) {
      await db.classes.bulkPut(classes);
    }
  });
}

export async function getCurrentUser() {
  const current = await db.meta.get("currentUser");
  return current?.value || null;
}

export async function saveCurrentUser(user) {
  await db.meta.put({
    key: "currentUser",
    value: user,
  });
}

export async function logoutCurrentUser() {
  await db.meta.delete("currentUser");
}