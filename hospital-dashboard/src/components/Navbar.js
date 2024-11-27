import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [hospitalName, setHospitalName] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the logout endpoint
      await axios.post(
        "http://localhost:5000/hospitalLogout",
        {},
        { withCredentials: true }
      );

      // Redirect to the login page
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  useEffect(() => {
    // Fetch hospital name from session data
    axios
      .get("http://localhost:5000/hospitalData", { withCredentials: true })
      .then((response) => {
        setHospitalName(response.data.hospitalName);
      })
      .catch((error) => {
        console.error("Failed to fetch hospital name:", error);
        // Optionally handle the case where the session is no longer valid
        setHospitalName("Hospital Dashboard");
      });
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
