import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getCurrentUser,
  getUsers,
  logoutCurrentUser,
  saveCurrentUser,
  seedDatabase,
} from "../db/databaseService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        await seedDatabase();
        const savedUser = await getCurrentUser();

        if (isMounted) {
          setCurrentUser(savedUser);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  async function login(username, password) {
    try {
      const users = await getUsers();

      const found = users.find(
        (user) => user.username === username && user.password === password
      );

      if (!found) {
        return { success: false, message: "Invalid username or password" };
      }

      await saveCurrentUser(found);
      setCurrentUser(found);

      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, message: "Login failed" };
    }
  }

  async function logout() {
    try {
      await logoutCurrentUser();
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: !!currentUser,
      isReady,
      login,
      logout,
    }),
    [currentUser, isReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}