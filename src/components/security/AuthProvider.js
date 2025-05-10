import React, { createContext, useState, useContext, useEffect } from "react";
import { login as apiLogin, validateToken } from "../../api/security/common";
import { useTokenManager } from "../../hooks/useTokenManager";
import { useSettings } from "../SettingsProvider";
import { useLoading } from "../LoadingProvider";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({ account: null, token: null });
  const { getToken, setToken, clearToken } = useTokenManager();
  const settings = useSettings();
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const validate = async () => {
      startLoading();

      const token = getToken();
      if (token) {
        const response = await validateToken(token);
        if (response.success) {
          const data = response.data;
          setAuthData({ account: data.account, token: data.token });
        } else {
          clearToken();
          setAuthData({ account: null, token: null });
        }
      }

      stopLoading();
    };
    validate();
  }, [getToken, clearToken]);

  const login = async (email, password) => {
    const response = await apiLogin(email, password);
    if (response.success) {
      const data = response.data;

      setToken(data.token, data.account.role.tokenLifetimeSeconds);
      setAuthData({ account: data.account, token: data.token });
      return { success: true };
    } else {
      return { success: false, message: 'Login failed' };
    }
  };

  const logout = () => {
    clearToken();
    setAuthData({ account: null, token: null });
  };

  const getAccount = () => authData.account;
  const getRole = () => authData.account?.role;
  const isAuthenticated = () => !!authData.token;

  const isAdmin = () => {
    const role = getRole();
    return role && role.permission === settings.adminPermission;
  };

  const isTeacher = () => {
    const role = getRole();
    return role && role.permission === settings.teacherPermission;
  };

  const isStudent = () => {
    const role = getRole();
    return role && role.permission === settings.studentPermission;
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout, isAuthenticated, getAccount, getRole, getToken, isAdmin, isTeacher, isStudent }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
