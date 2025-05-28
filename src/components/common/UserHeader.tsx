import React, { useState, useRef, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, List, ListItem, ListItemButton, ListItemText, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../components/security/AuthProvider";
import { Link } from "react-router-dom";

interface UserHeaderProps {
  title: string;
  accountPath: string;
  menuLinks: Array<{ label: string; to: string }>;
}

const UserHeader: React.FC<UserHeaderProps> = ({ title, accountPath, menuLinks }) => {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLButtonElement | null>(null);

  const handleMenu = () => {
    if (!menuOpen) {
      setMenuOpen(true);
      setTimeout(() => setMenuVisible(true), 10); // для плавного старта анимации
    } else {
      setMenuVisible(false);
      setTimeout(() => setMenuOpen(false), 300); // время transition
    }
  };
  const handleClose = () => {
    setMenuVisible(false);
    setTimeout(() => setMenuOpen(false), 300);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        iconRef.current &&
        !iconRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <>
      <AppBar position="fixed" color="default" elevation={1} sx={{ zIndex: 1201 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}
            >
              {title}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
              ref={iconRef}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
        {menuOpen && (
          <Box
            ref={menuRef}
            sx={{
              position: 'absolute',
              top: '64px',
              left: 0,
              width: '100%',
              bgcolor: 'background.paper',
              boxShadow: 3,
              zIndex: 1200,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              overflow: 'hidden',
              maxHeight: menuVisible ? 500 : 0,
              opacity: menuVisible ? 1 : 0,
              transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s',
            }}
          >
            <List>
              {menuLinks.map((item) => (
                <ListItem key={item.to} disablePadding>
                  <ListItemButton component={Link} to={item.to} onClick={handleClose}>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
              <Divider />
              <ListItem disablePadding>
                <ListItemButton component={Link} to={accountPath} onClick={handleClose}>
                  <ListItemText primary="Аккаунт" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => { handleClose(); logout(); }}>
                  <ListItemText primary="Выйти" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        )}
      </AppBar>
      <Box sx={{ height: { xs: 56, sm: 64 } }} />
    </>
  );
};

export function useUserHeaderConfig(roleOverride?: "student" | "teacher" | "admin") {
  const { getAccount } = useAuth();
  const account = getAccount();
  const role = roleOverride || account?.role?.permission;

  if (role === "teacher") {
    return {
      accountPath: "/teacher/account",
      menuLinks: [
        { label: "Сегодня", to: "/teacher" },
        { label: "Расписание", to: "/teacher/schedule" },
      ],
    };
  }
  if (role === "student") {
    return {
      accountPath: "/student/account",
      menuLinks: [
        { label: "Сегодня", to: "/student" },
        { label: "Расписание", to: "/student/schedule" },
      ],
    };
  }
  return {
    accountPath: "/account",
    menuLinks: [],
  };
}

export default UserHeader;
