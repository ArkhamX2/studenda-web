import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { login as apiLogin, validateToken } from "../../api/security/common";
import { useTokenManager } from "../../hooks/useTokenManager";
import { useSettings } from "../SettingsProvider";
import { useLoading } from "../LoadingProvider";
import { Account, Role, Settings } from "../../types/security";

interface AuthData {
  account: Account | null;
  token: string | null;
}

interface AuthContextProps {
  authData: AuthData;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: () => boolean;
  getAccount: () => Account | null;
  getRole: () => Role | null;
  getToken: () => string | null;
  isAdmin: () => boolean;
  isTeacher: () => boolean;
  isStudent: () => boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData>({ account: null, token: null });
  const [initialized, setInitialized] = useState(false);
  const { getToken, setToken, clearToken } = useTokenManager();
  const settings = useSettings() as Settings;
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const validate = async () => {
      startLoading();

      const token = getToken();
      if (token) {
        const response = await validateToken(token);
        const data = response.data;
        if (response.success && data) {
          setAuthData({ account: data.account, token: data.token });
        } else {
          clearToken();
          setAuthData({ account: null, token: null });
        }
      }

      stopLoading();
      setInitialized(true);
    };

    validate();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiLogin(email, password);
    const data = response.data;
    if (response.success && data?.account.role) {
      setToken(data.token, data.account.role.tokenLifetimeSeconds);
      setAuthData({ account: data.account, token: data.token });

      return { success: true };
    } else {
      return { success: false, message: "Login failed" };
    }
  };

  const logout = () => {
    clearToken();
    setAuthData({ account: null, token: null });
  };

  const getAccount = () => authData.account;
  const getRole = () => authData.account?.role || null;
  const isAuthenticated = () => !!authData.token;

  const isAdmin = () => {
    const role = getRole();
    return role?.permission === settings.adminPermission;
  };

  const isTeacher = () => {
    const role = getRole();
    return role?.permission === settings.teacherPermission;
  };

  const isStudent = () => {
    const role = getRole();
    return role?.permission === settings.studentPermission;
  };

  if (!initialized) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{ authData, login, logout, isAuthenticated, getAccount, getRole, getToken, isAdmin, isTeacher, isStudent }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
