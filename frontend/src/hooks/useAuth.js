import { useState, useCallback } from "react";

const STORAGE_KEY = "shivmlaiUser";

/**
 * useAuth — localStorage-based authentication hook.
 * No backend required. Ready for API swap when Node.js server is added.
 */
export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  /** Called after Google OAuth success — store decoded profile */
  const login = useCallback((userData) => {
    const profile = {
      name:      userData.name      || "Learner",
      email:     userData.email     || "",
      picture:   userData.picture   || "",
      loginType: userData.loginType || "google",
      loginAt:   new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setUser(profile);
  }, []);

  /** Clear session */
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return { user, login, logout, isLoggedIn: !!user };
}
