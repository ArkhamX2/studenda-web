import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../components/security/AuthProvider";

interface RequireTeacherProps {
  children: ReactNode;
}

const RequireTeacher: React.FC<RequireTeacherProps> = ({ children }) => {
  const { isAuthenticated, isTeacher } = useAuth();

  if (!isAuthenticated() || !isTeacher()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RequireTeacher;
