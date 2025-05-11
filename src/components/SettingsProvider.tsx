import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchSettings } from "../api/security/common";
import { useLoading } from "./LoadingProvider";
import { Settings } from "../types/security";

interface SettingsProviderProps {
  children: ReactNode;
}

const SettingsContext = createContext<Settings | null>(null);

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [initialized, setInitialized] = useState(false);
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const loadSettings = async () => {
      startLoading();
      let settings: Settings | null = null;
      const localSettings = sessionStorage.getItem("settings");
      if (localSettings) {
        settings = JSON.parse(localSettings);
        setSettings(settings);
      }

      if (!settings) {
        try {
          const result = await fetchSettings();
          if (result.success) {
            settings = result.data;
            sessionStorage.setItem("settings", JSON.stringify(settings));
            setSettings(settings);
          } else {
            throw new Error("Failed to fetch settings");
          }
        } catch (error) {
          console.error("Failed to fetch settings", error);
        }
      }

      stopLoading();
      setInitialized(true);
    };

    loadSettings();
  }, []);

  if (!initialized) {
    return null;
  }

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): Settings => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
