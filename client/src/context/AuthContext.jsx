import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../api";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("lifelinexk_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Fetch fresh user data on mount
  useEffect(() => {
    if (localStorage.getItem("lifelinexk_token")) {
      fetchMe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data);
      localStorage.setItem("lifelinexk_user", JSON.stringify(res.data));
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("lifelinexk_token", res.data.token);
      localStorage.setItem("lifelinexk_user", JSON.stringify(res.data));
      setUser(res.data);
      toast.success(`Welcome back, ${res.data.name}!`);
      return { success: true, data: res.data };
    } catch (err) {
      toast.error(err.message || "Login failed");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/register", userData);
      localStorage.setItem("lifelinexk_token", res.data.token);
      localStorage.setItem("lifelinexk_user", JSON.stringify(res.data));
      setUser(res.data);
      toast.success("Account created successfully!");
      return { success: true, data: res.data };
    } catch (err) {
      toast.error(err.message || "Registration failed");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("lifelinexk_token");
    localStorage.removeItem("lifelinexk_user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  const updateUser = (data) => {
    setUser((prev) => ({ ...prev, ...data }));
    localStorage.setItem("lifelinexk_user", JSON.stringify({ ...user, ...data }));
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    register,
    logout,
    updateUser,
    fetchMe,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

