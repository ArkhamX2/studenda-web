import React from "react";
import { Link, Outlet } from "react-router-dom";
import RequireAdmin from "../../components/security/require/RequireAdmin";
import { Box, List, ListItem, ListItemText, Drawer, Toolbar } from "@mui/material";

const drawerWidth = 240;

const AdminLayout = () => {
  return (
    <RequireAdmin>
      <Box sx={{ display: "flex" }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
          }}
        >
          <Toolbar />
          <List>
            <ListItem button component={Link} to="/admin/user">
              <ListItemText primary="Пользователи" />
            </ListItem>
            <ListItem button component={Link} to="/admin/course">
              <ListItemText primary="Курсы" />
            </ListItem>
            <ListItem button component={Link} to="/admin/department">
              <ListItemText primary="Факультеты" />
            </ListItem>
            <ListItem button component={Link} to="/admin/group">
              <ListItemText primary="Группы" />
            </ListItem>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </RequireAdmin>
  );
};

export default AdminLayout;
