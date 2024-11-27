import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Home, People, Settings } from "@mui/icons-material";

const Sidebar = () => {
  const menuItems = [
    { text: "Dashboard", icon: <Home />, path: "/dashboard" },
    { text: "Driver Form", icon: <People />, path: "/dashboard/DriverForm" },
    {
      text: "Driver Details",
      icon: <People />,
      path: "/dashboard/DriverDetail",
    },
    { text: "Settings", icon: <Settings />, path: "/dashboard/settings" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
    >
      <List sx={{ paddingTop: "90px" }}>
        {menuItems.map((item, index) => (
          <ListItem button key={index} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
