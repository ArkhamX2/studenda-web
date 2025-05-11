import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../components/security/AuthProvider";

interface RequireAdminProps {
  children: ReactNode;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated() || !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RequireAdmin;
