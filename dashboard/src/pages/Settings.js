import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios"; // Make sure axios is imported
import { useNavigate } from "react-router-dom"; // Make sure useNavigate is imported

const Settings = () => {
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("admintoken");
        console.log("Fetching user data...", token);

        if (!token) {
          throw new Error("No token found, please login again");
        }

        const response = await axios.get(
          "http://localhost:5000/admin/AdminData",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        console.log("Response from server:", response.data);

        if (response.data?.admin) {
          const admin = response.data.admin;
          admin.Dob = new Date(admin.Dob).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          setAdminData(admin);
        } else {
          throw new Error("Invalid Admin data");
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setError(error.message);
        setAdminData(null);
        if (error.response?.status === 200) {
          navigate("/login"); // Corrected navigation
        }
      }
    };

    fetchAdminData();
  }, [navigate]);

  // Render loading or error state if needed
  if (!adminData) {
    return (
      <Typography variant="h6" sx={{ padding: 2 }}>
        {error ? `Error: ${error}` : "Loading..."}
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ margin: "30px -10px" }}>
      <Typography
        variant="h6"
        sx={{ padding: "6px", backgroundColor: "#f5f5f5" }}
      >
        Admin Profile
      </Typography>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell>Admin Name</TableCell>
            <TableCell>Admin Number</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Date of Birth</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{ backgroundColor: "#f9f9f9" }}>
            <TableCell>{adminData.fullname}</TableCell>
            <TableCell>{adminData.phone}</TableCell>
            <TableCell>{adminData.email}</TableCell>
            <TableCell>{adminData.Dob}</TableCell>
            <TableCell>{adminData.gender}</TableCell>
            <TableCell>
              <Button
                variant="contained"
                color="primary"
                // onClick={() => handleApprove(adminData._id)}
              >
                Approve
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Settings;
