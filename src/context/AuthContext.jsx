import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getCurrentUser,
  getUsers,
  logoutCurrentUser,
  saveCurrentUser,
  seedLocalStorage,
} from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    seedLocalStorage();
    setCurrentUser(getCurrentUser());
  }, []);

  function login(username, password) {
    const users = getUsers();
    const found = users.find(
      (user) => user.username === username && user.password === password
    );

    if (!found) {
      return { success: false, message: "Invalid username or password" };
    }

    saveCurrentUser(found);
    setCurrentUser(found);
    return { success: true };
  }

  function logout() {
    logoutCurrentUser();
    setCurrentUser(null);
  }

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: !!currentUser,
      login,
      logout,
    }),
    [currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
