import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const DriverForm = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [driverName, setDriverName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [ambulanceNumber, setAmbulanceNumber] = useState("");
  const [ambulanceType, setAmbulanceType] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Generic change handler for all form fields
  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };

  // Handle the form submission
  const DriverRegisterHandel = (e) => {
    e.preventDefault();
    if (
      !driverName ||
      !phone ||
      !ambulanceNumber ||
      !licenseNumber ||
      !ambulanceType ||
      !password ||
      !email
    ) {
      alert("All fields are required.");
      return;
    }

    const driverData = {
      email: email,
      phone,
      driverName,
      password,
      ambulanceNumber,
      licenseNumber,
      ambulanceType,
    };

    const token = localStorage.getItem("token"); // Send the data to the backend
    axios
      .post("http://localhost:5000/driverRegister", driverData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status === "ok") {
          alert("Driver account created successfully");
          setEmail("");
          setPhone("");
          setDriverName("");
          setLicenseNumber("");
          setAmbulanceNumber("");
          setAmbulanceType("");
          setPassword("");
        }
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "Something went wrong";
        alert(errorMessage);
      });
  };

  return (
    <Box
      sx={{
        maxWidth: "600px",
        margin: "20px 10px",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2>Add Driver Details</h2>
      <form onSubmit={DriverRegisterHandel}>
        <TextField
          sx={{ mr: 2, width: 280 }}
          label="Driver Name"
          name="driverName"
          type="text"
          margin="normal"
          value={driverName}
          onChange={handleChange(setDriverName)}
          required
        />
        <TextField
          sx={{ mr: 2, width: 280 }}
          label="Phone Number"
          type="tel"
          name="phone"
          margin="normal"
          value={phone}
          onChange={handleChange(setPhone)}
          required
        />
        <TextField
          sx={{ mr: 2, width: 280 }}
          label="Ambulance Number"
          type="text"
          name="ambulanceNumber"
          margin="normal"
          value={ambulanceNumber}
          onChange={handleChange(setAmbulanceNumber)}
          required
        />
        <TextField
          sx={{ mr: 2, width: 280 }}
          label="Email"
          type="email"
          name="email"
          margin="normal"
          value={email}
          onChange={handleChange(setEmail)}
        />
        <TextField
          sx={{ mr: 2, width: 280 }}
          label="License Number"
          type="text"
          name="licenseNumber"
          margin="normal"
          value={licenseNumber}
          onChange={handleChange(setLicenseNumber)}
          required
        />
        <TextField
          sx={{ mr: 2, width: 280 }}
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handleChange(setPassword)}
          required
          margin="normal"
          InputProps={{
            endAdornment: (
              <IconButton onClick={handlePasswordVisibility}>
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            ),
          }}
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="ambulance-type-label">Ambulance Type</InputLabel>
          <Select
            labelId="ambulance-type-label"
            name="ambulanceType"
            value={ambulanceType}
            onChange={handleChange(setAmbulanceType)}
          >
            <MenuItem value="Basic">Basic Ambulance</MenuItem>
            <MenuItem value="Advance">Advance Ambulance</MenuItem>
            <MenuItem value="Transport">Transport Ambulance</MenuItem>
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default DriverForm;
