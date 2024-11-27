import React from "react";
import { Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DriverForm from "../components/DriverForm";

// Placeholder components for other sections
const DashboardHome = () => <h1>Dashboard Home</h1>;
const DriverDetail = () => <h1>Driver Detail Management</h1>;
const Settings = () => <h1>Settings</h1>;

const Dashboard = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: "240px", // Space for the sidebar
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Navbar */}
        <Navbar />

        {/* Dynamic Content Based on Route */}
        <Box sx={{ marginTop: "64px", padding: "20px" }}>
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/DriverDetail" element={<DriverDetail />} />
            <Route path="/DriverForm" element={<DriverForm />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
