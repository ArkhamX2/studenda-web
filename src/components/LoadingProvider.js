import React, { createContext, useContext, useState } from "react";
import { CircularProgress, Box } from "@mui/material";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  const isLoading = () => loading;

  return (
    <LoadingContext.Provider value={{ loading, startLoading, stopLoading }}>
      {children}
      {loading && (
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
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Darker overlay
            zIndex: 2000, // Higher z-index to ensure it overlays everything
            opacity: loading ? 1 : 0,
            transition: "opacity 0.3s ease-in-out", // Smooth transition for opacity
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
