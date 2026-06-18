const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed (${response.status})`);
  }

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return null;
}

/**
 * No longer needed because SQLite backend
 * creates default user automatically.
 */
export async function seedDatabase() {
  return true;
}

/**
 * Get all users from SQLite
 */
export async function getUsers() {
  return api("/users");
}

/**
 * Get all classes from SQLite
 */
export async function getClasses() {
  return api("/classes");
}

/**
 * Save all classes to SQLite
 */
export async function saveAllClasses(classes) {
  return api("/classes", {
    method: "POST",
    body: JSON.stringify(classes),
  });
}

/**
 * Get current logged-in user
 */
export async function getCurrentUser() {
  return api("/current-user");
}

/**
 * Save current user session
 */
export async function saveCurrentUser(user) {
  return api("/login", {
    method: "POST",
    body: JSON.stringify({
      username: user.username,
      password: user.password,
    }),
  });
}

/**
 * Logout current user
 */
export async function logoutCurrentUser() {
  return api("/logout", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

/**
 * Export entire SQLite database
 */
export async function exportSqlBackup() {
  return api("/backup");
}

/**
 * Import backup into SQLite database
 */
export async function importSqlBackup(data) {
  return api("/backup/import", {
    method: "POST",
    body: JSON.stringify(data),
  });
}