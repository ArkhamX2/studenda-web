import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useAuth } from "../security/AuthProvider";
import LogoutIcon from "@mui/icons-material/Logout";

const AdminHeader: React.FC = () => {
  const { logout, getAccount } = useAuth();
  const account = getAccount();

  return (
    <AppBar position="static" color="default" elevation={1} sx={{ mb: 2 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Админ-панель
        </Typography>
        {account && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" color="textSecondary">
              {account.surname} {account.name}
            </Typography>
            <Button
              color="inherit"
              onClick={logout}
              variant="outlined"
              startIcon={<LogoutIcon />}
            >
              Выйти
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;
