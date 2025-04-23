import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";

const HomePage = () => {
  const { isAuthenticated, getAccount, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>; // Show loading animation
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  const account = getAccount();
  const permission = account?.Role?.Permission;

  if (permission === "ru.arkham.permission.admin") {
    return <Navigate to="/admin" />;
  } else if (permission === "ru.arkham.permission.teacher") {
    return <Navigate to="/teacher" />;
  } else if (permission === "ru.arkham.permission.student") {
    return <Navigate to="/student" />;
  }

  return <Navigate to="/unauthorized" />;
};

export default HomePage;
