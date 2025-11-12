import { createContext, useContext, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // hydrate synchronously on first render (no flicker)
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // (optional) derive user info from JWT for roles, email, etc.
  const user = useMemo(() => {
    if (!token) return null;
    try {
      const p = jwtDecode(token);
      return {
        id: p.sub ?? p.id ?? null,
        email: p.email ?? null,
        username: p.username ?? p.name ?? null,
        roles: p.roles ?? p.authorities ?? p.scopes ?? [],
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
