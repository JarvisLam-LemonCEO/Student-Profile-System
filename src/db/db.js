import Dexie from "dexie";

export const db = new Dexie("StudentProfileDB");

db.version(1).stores({
  users: "id, username",
  classes: "id, name",
  meta: "key",
});