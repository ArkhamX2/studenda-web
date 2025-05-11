import { useCallback } from "react";

export const useTokenManager = () => {
  const getToken = useCallback((): string | null => {
    const storedData = localStorage.getItem("security");
    if (!storedData) return null;

    try {
      const { token, expirationTime }: { token: string; expirationTime: number } = JSON.parse(storedData);
      if (Date.now() > expirationTime) {
        clearToken();
        return null;
      }
      return token;
    } catch {
      clearToken();
      return null;
    }
  }, []);

  const setToken = useCallback((token: string, lifetimeSeconds: number): void => {
    const expirationTime = Date.now() + lifetimeSeconds * 1000;
    localStorage.setItem("security", JSON.stringify({ token, expirationTime }));
  }, []);

  const clearToken = useCallback((): void => {
    localStorage.removeItem("security");
  }, []);

  return { getToken, setToken, clearToken };
};
