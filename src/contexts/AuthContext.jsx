import { createContext, useContext, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // hydrate synchronously on first render (no flicker)
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // derive user info from JWT for roles, email, etc.
  const user = useMemo(() => {
    if (!token) return null;
    try {
      const p = jwtDecode(token);

      // Handle role (could be string OR array from NOVI API)
      let roles = [];
      if (Array.isArray(p.role)) {
        roles = p.role; // Already an array
      } else if (typeof p.role === "string") {
        roles = [p.role]; // Wrap string in array
      }

      return {
        id: p.userId ?? p.sub ?? null,
        email: p.email ?? null,
        role: roles[0] ?? null, // Primary role (backward compatibility)
        roles: roles, // Full array for .includes() checks
        projectId: p.projectId ?? null,
      };
    } catch {
      return null;
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const isAuth = Boolean(token);

  const value = useMemo(
    () => ({ token, user, isAuth, login, logout }),
    [token, user, isAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};
