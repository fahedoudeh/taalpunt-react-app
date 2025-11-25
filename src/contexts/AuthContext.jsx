// src/contexts/AuthContext.jsx
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getUserById } from "../services/userService";


const AuthContext = createContext(null);

const capitalizeFirstLetter = (str) => {
  if (!str) return "Gebruiker";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [userProfile, setUserProfile] = useState(() => {
    const stored = localStorage.getItem("userProfile");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  // Derive basic user info from JWT
  const userFromToken = useMemo(() => {
    if (!token) return null;
    try {
      const p = jwtDecode(token);

      let roles = [];
      if (Array.isArray(p.role)) {
        roles = p.role;
      } else if (typeof p.role === "string") {
        roles = [p.role];
      }

      return {
        id: p.userId ?? p.sub ?? null,
        email: p.email ?? null,
        role: roles[0] ?? null,
        roles: roles,
        projectId: p.projectId ?? null,
      };
    } catch {
      return null;
    }
  }, [token]);

  // Merge JWT data with fetched profile data
  const user = useMemo(() => {
    if (!userFromToken) return null;

    return {
      ...userFromToken,
      username: capitalizeFirstLetter(
        userProfile?.username ||
          userFromToken.email?.split("@")[0] ||
          "Gebruiker"
      ),
      // Add any other profile fields here
      avatar: userProfile?.avatar || null,
      bio: userProfile?.bio || null,
    };
  }, [userFromToken, userProfile]);

  // Fetch user profile when token changes
  useEffect(() => {
    if (!token || !userFromToken?.id) {
      setUserProfile(null);
      localStorage.removeItem("userProfile");
      return;
    }

    // Don't fetch if we already have profile data
    if (userProfile) return;

    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const { data } = await getUserById(userFromToken.id);
        setUserProfile(data);
        localStorage.setItem("userProfile", JSON.stringify(data));
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        // Don't clear token on profile fetch failure
        // User can still use app with JWT data
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token, userFromToken?.id, userProfile]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUserProfile(null); // Clear old profile, will refetch
    localStorage.removeItem("userProfile");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    setToken(null);
    setUserProfile(null);
  };

  const isAuth = Boolean(token);

  const value = useMemo(
    () => ({ token, user, isAuth, login, logout, loading }),
    [token, user, isAuth, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};
