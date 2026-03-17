const USERS_KEY = "student_profile_users";
const CLASSES_KEY = "student_profile_classes";
const CURRENT_USER_KEY = "student_profile_current_user";

const defaultUsers = [
  {
    id: crypto.randomUUID(),
    username: "teacher",
    password: "123456",
  },
];

const defaultClasses = [];

export function seedLocalStorage() {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }

  if (!localStorage.getItem(CLASSES_KEY)) {
    localStorage.setItem(CLASSES_KEY, JSON.stringify(defaultClasses));
  }
}

export function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getClasses() {
  return JSON.parse(localStorage.getItem(CLASSES_KEY)) || [];
}

export function saveClasses(classes) {
  localStorage.setItem(CLASSES_KEY, JSON.stringify(classes));
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
}

export function saveCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function logoutCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}
