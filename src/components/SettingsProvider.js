import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchSettings } from "../api/security";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      var settings = null;
      const localSettings = sessionStorage.getItem("settings");
      if (localSettings) {
        settings = JSON.parse(localSettings);

        setSettings(settings);
      }

      if (!settings) {
        const result = await fetchSettings();
        if (result.success) {
          settings = result.data;

          sessionStorage.setItem("settings", JSON.stringify(settings));
          setSettings(settings);
        } else {
          throw new Error("Failed to fetch settings");
        }
      }

      setLoading(false);
    };

    loadSettings();
  }, []);

  if (loading) {
    return <div>Loading settings...</div>;
  }

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
