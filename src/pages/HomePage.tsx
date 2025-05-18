import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/security/AuthProvider";
import { useLoading } from "../components/LoadingProvider";

const HomePage: React.FC = () => {
  const { isAuthenticated, isAdmin, isTeacher, isStudent, getAccount } = useAuth();
  const { loading } = useLoading();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  // Проверка mustChangePassword
  const account = getAccount();
  if (account?.mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

  if (isAdmin()) {
    return <Navigate to="/admin" />;
  } else if (isTeacher()) {
    return <Navigate to="/teacher" />;
  } else if (isStudent()) {
    return <Navigate to="/student" />;
  }

  return (
    <div>
      <p>ERROR</p>
    </div>
  );
};

export default HomePage;
