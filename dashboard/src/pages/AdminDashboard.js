// src/layouts/AdminDashboard.js
import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Box } from "@mui/material";

const AdminDashboard = ({ children, onLogout }) => {
  return (
    <Box display="flex">
      <Sidebar />
      <Box sx={{ flexGrow: 1, marginLeft: 240 }}>
        <Navbar onLogout={onLogout} />
        <Box sx={{ marginTop: 8, padding: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
