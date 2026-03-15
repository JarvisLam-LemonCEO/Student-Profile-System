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

const defaultClasses = [
  {
    id: crypto.randomUUID(),
    name: "Class A",
    description: "Morning class",
    students: [
      {
        id: crypto.randomUUID(),
        name: "Alice Johnson",
        studentId: "S1001",
        skills: {
          communication: 80,
          teamwork: 75,
          problemSolving: 88,
          leadership: 72,
          creativity: 79,
          discipline: 91,
        },
        grades: [
          {
            id: crypto.randomUUID(),
            subject: "Math",
            date: "2026-03-01",
            type: "Quiz",
            grade: 92,
          },
          {
            id: crypto.randomUUID(),
            subject: "Science",
            date: "2026-03-05",
            type: "Test",
            grade: 85,
          },
        ],
        notes: [
          {
            id: crypto.randomUUID(),
            content: "Active in class discussion.",
            date: "2026-03-06",
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        name: "Brian Lee",
        studentId: "S1002",
        skills: {
          communication: 68,
          teamwork: 82,
          problemSolving: 77,
          leadership: 65,
          creativity: 70,
          discipline: 84,
        },
        grades: [],
        notes: [],
      },
    ],
  },
];

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
