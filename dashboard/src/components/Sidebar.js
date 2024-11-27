import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Home, Notifications, Settings } from "@mui/icons-material";

const Sidebar = () => {
  const location = useLocation();
  const notificationCount = 3;
  const menuItems = [
    { text: "Dashboard", icon: <Home />, path: "/dashboard" },
    {
      text: "Notification",
      icon: (
        <Badge badgeContent={notificationCount} color="error">
          <Notifications />
        </Badge>
      ),
      path: "/dashboard/notification",
    },
    { text: "Settings", icon: <Settings />, path: "/dashboard/settings" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 50,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
    >
      <List sx={{ paddingTop: "90px" }}>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
