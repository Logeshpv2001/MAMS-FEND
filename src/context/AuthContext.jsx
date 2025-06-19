import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      console.log(res);
      const { user: userData, token } = res.data;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);

      setUser(userData);
      navigate("/dashboard");
    } catch (err) {
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    role: user?.role || null,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
