import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [hospitalName, setHospitalName] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await axios.post("http://localhost:5000/hospitalLogout", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        localStorage.removeItem("token");
        navigate("/login");
        alert("Logged out successfully");
      } else {
        alert("No token found, user might already be logged out.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found, please login again");
        }

        const response = await axios.get("http://localhost:5000/hospitalData", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (response.data?.hospital) {
          const hospital = response.data.hospital;
          setHospitalName(hospital.hospitalName);
        } else {
          throw new Error("Invalid hospital data");
        }
      } catch (error) {
        console.error("Failed to fetch hospital name:", error);
        setHospitalName("Hospital Dashboard");
      }
    };

    fetchHospitalData();
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: 1201, backgroundColor: "red", height: 80 }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {hospitalName || "Hospital Dashboard"}
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
