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
import axios from "axios"; // Axios for API requests
import { useNavigate } from "react-router-dom"; // React Router for navigation

const Settings = () => {
  const [hospitalData, setHospitalData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const token = localStorage.getItem("hospitaltoken");
        console.log("Fetching hospital data...", token);

        if (!token) {
          throw new Error("No token found, please login again");
        }

        const response = await axios.get("http://localhost:5000/hospitalData", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        console.log("Response from server:", response.data);

        if (response.data?.hospital) {
          setHospitalData(response.data.hospital);
        } else {
          throw new Error("Invalid Hospital data");
        }
      } catch (error) {
        console.error("Error fetching Hospital data:", error);
        setError(error.message);
        setHospitalData(null);

        if (error.response?.status === 401) {
          navigate("/login"); // Redirect to login if unauthorized
        }
      }
    };

    fetchHospitalData();
  }, [navigate]);

  if (!hospitalData && !error) {
    return (
      <Typography variant="h6" sx={{ padding: 2 }}>
        Loading...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" sx={{ padding: 2, color: "red" }}>
        Error: {error}
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ margin: "30px -10px" }}>
      <Typography
        variant="h6"
        sx={{ padding: "6px", backgroundColor: "#f5f5f5" }}
      >
        Hospital Profile
      </Typography>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell>Hospital Name</TableCell>
            <TableCell>Registration Number</TableCell>
            <TableCell>Admin Name</TableCell>
            <TableCell>Admin Number</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Ambulance</TableCell>
            <TableCell>Hospital Type</TableCell>
            <TableCell>Operating Hours</TableCell>
            <TableCell>Coordinates</TableCell>
            <TableCell>Emergency Contact</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{ backgroundColor: "#f9f9f9" }}>
            <TableCell>{hospitalData.hospitalName}</TableCell>
            <TableCell>{hospitalData.registrationNumber}</TableCell>
            <TableCell>{hospitalData.adminName}</TableCell>
            <TableCell>{hospitalData.adminContact}</TableCell>
            <TableCell>{hospitalData.address}</TableCell>
            <TableCell>{hospitalData.email}</TableCell>
            <TableCell>{hospitalData.ambulanceCount}</TableCell>
            <TableCell>{hospitalData.hospitalType}</TableCell>
            <TableCell>{hospitalData.operatingHours}</TableCell>
            <TableCell>
                  {hospitalData.location.coordinates[0]}, {hospitalData.location.coordinates[1]}</TableCell>
            <TableCell>{hospitalData.emergencyContact}</TableCell>
            <TableCell>
              <Button
                variant="contained"
                color="primary"
                onClick={() => console.log("Approve clicked")} // Add your logic here
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
