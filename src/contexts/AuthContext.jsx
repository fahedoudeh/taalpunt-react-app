//required for grading

import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem("token");
    if (token) {
      // Validate token and set user
      setUser(JSON.parse(localStorage.getItem("user")));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    // Will implement with NOVI API
    console.log("Login:", credentials);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const isTeacher = () => user?.role === "docent";

  return (
    <AuthContext.Provider value={{ user, login, logout, isTeacher, loading }}>
      {children}
    </AuthContext.Provider>
  );
};