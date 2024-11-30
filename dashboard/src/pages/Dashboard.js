import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Notification from "./Notification";
import Settings from "./Settings";
const DashboardHome = () => <h1>Dashboard Home</h1>;

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admintoken");
    console.log("token", token);
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <Box sx={{ display: "flex", height: "100vh",overflow: "auto" }}>
      <Sidebar  />
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: "200px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />
        <Box sx={{ marginTop: "64px", padding: "20px" }}>
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="notification" element={<Notification />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </Box>
      </Box>
      </Box>
  );
};

export default Dashboard;
