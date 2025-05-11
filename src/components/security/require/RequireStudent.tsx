import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../components/security/AuthProvider";

interface RequireStudentProps {
  children: ReactNode;
}

const RequireStudent: React.FC<RequireStudentProps> = ({ children }) => {
  const { isAuthenticated, isStudent } = useAuth();

  if (!isAuthenticated() || !isStudent()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RequireStudent;
