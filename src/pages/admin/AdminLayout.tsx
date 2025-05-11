import React from "react";
import { Link, Outlet } from "react-router-dom";
import RequireAdmin from "../../components/security/require/RequireAdmin";
import { Box, List, ListItem, ListItemText, Drawer, Toolbar } from "@mui/material";

const drawerWidth = 240;

const AdminLayout: React.FC = () => {
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
            <ListItem button="true" component={Link as React.ElementType} to="/admin/user">
              <ListItemText primary="Пользователи" />
            </ListItem>
            <ListItem button="true" component={Link as React.ElementType} to="/admin/course">
              <ListItemText primary="Курсы" />
            </ListItem>
            <ListItem button="true" component={Link as React.ElementType} to="/admin/department">
              <ListItemText primary="Факультеты" />
            </ListItem>
            <ListItem button="true" component={Link as React.ElementType} to="/admin/group">
              <ListItemText primary="Группы" />
            </ListItem>
            <ListItem button="true" component={Link as React.ElementType} to="/admin/discipline">
              <ListItemText primary="Учебные дисциплины" />
            </ListItem>
            <ListItem button="true" component={Link as React.ElementType} to="/admin/subject-position">
              <ListItemText primary="Позиции учебных предметов" />
            </ListItem>
            <ListItem button="true" component={Link as React.ElementType} to="/admin/week-type">
              <ListItemText primary="Типы учебных недель" />
            </ListItem>
            <ListItem button="true" component={Link as React.ElementType} to="/admin/subject-type">
              <ListItemText primary="Типы учебных предметов" />
            </ListItem>
            <ListItem button="true" component={Link as React.ElementType} to="/admin/day-position">
              <ListItemText primary="Позиции учебного дня" />
            </ListItem>
            <ListItem button="true" component={Link as React.ElementType} to="/admin/subject">
              <ListItemText primary="Занятия" />
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
