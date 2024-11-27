import React from "react";
import { Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Notification from "./Notification";

const DashboardHome = () => <h1>Dashboard Home</h1>;
const Settings = () => <h1>Settings</h1>;

const Dashboard = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <Box
        sx={{
          flexGrow: 1,
          marginLeft: "240px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />

        <Box sx={{ marginTop: "64px", padding: "20px" }}>
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/notification" element={<Notification />} />

            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
