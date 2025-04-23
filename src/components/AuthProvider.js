import React, { createContext, useState, useContext, useEffect } from "react";
import { login as apiLogin, validateToken, getUserRole } from "../api/security"; // Import validateToken

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({ account: null, token: null });
  const [loading, setLoading] = useState(true); // Add loading state

  const getToken = () => {
    const storedData = localStorage.getItem("authToken");
    if (!storedData) return null;

    try {
      const { token, expirationTime } = JSON.parse(storedData); // Handle JSON format
      if (Date.now() > expirationTime) {
        clearToken();
        return null;
      }
      return token;
    } catch {
      // If not valid JSON, clear the token and return null
      clearToken();
      return null;
    }
  };

  const setToken = (token, lifetimeSeconds) => {
    const expirationTime = Date.now() + lifetimeSeconds * 1000; // Convert seconds to milliseconds
    localStorage.setItem("authToken", JSON.stringify({ token, expirationTime }));
  };

  const clearToken = () => {
    localStorage.removeItem("authToken");
  };

  useEffect(() => {
    const validate = async () => {
      const token = getToken();
      if (token) {
        const response = await validateToken(token);
        if (response.ok) {
          const data = await response.json();
          setAuthData({ account: data.Account, token: data.Token });
        } else {
          clearToken();
          setAuthData({ account: null, token: null });
        }
      }
      setLoading(false); // Set loading to false after validation
    };
    validate();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);
      if (response.ok) {
        const data = await response.json();
        setToken(data.Token, data.Account.Role.TokenLifetimeSeconds); // Use setToken
        setAuthData({ account: data.Account, token: data.Token });
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, message: error.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    clearToken(); // Use clearToken
    setAuthData({ account: null, token: null });
  };

  const getAccount = () => authData.account;
  const getRole = () => authData.account?.Role; // Access role from account
  const isAuthenticated = () => !!authData.token;

  return (
    <AuthContext.Provider value={{ authData, loading, login, logout, isAuthenticated, getAccount, getRole, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
