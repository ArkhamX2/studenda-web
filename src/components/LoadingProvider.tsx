import React, { createContext, useContext, useState, ReactNode } from "react";
import { CircularProgress, Box } from "@mui/material";

interface LoadingContextType {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

interface LoadingProviderProps {
  children: ReactNode;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [loadingCount, setLoadingCount] = useState(0);

  const startLoading = () => setLoadingCount((count) => count + 1);
  const stopLoading = () => setLoadingCount((count) => Math.max(count - 1, 0));

  const isLoading = loadingCount > 0;

  return (
    <LoadingContext.Provider value={{ loading: isLoading, startLoading, stopLoading }}>
      {children}
      {isLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 2000,
            opacity: isLoading ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
