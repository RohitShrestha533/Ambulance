import React, { useState } from "react";
import { Form, Button, InputGroup, FormControl } from "react-bootstrap";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import axios from "axios";

const DriverForm = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [driverName, setDriverName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [ambulanceNumber, setAmbulanceNumber] = useState("");
  const [ambulanceType, setAmbulanceType] = useState("Basic");
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

    const token = localStorage.getItem("hospitaltoken");
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
    <div
      style={{
        maxWidth: "600px",
        margin: "20px 10px",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2>Add Driver Details</h2>
      <Form onSubmit={DriverRegisterHandel}>
        <Form.Group className="mb-3">
          <Form.Label>Driver Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter driver's name"
            value={driverName}
            onChange={handleChange(setDriverName)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={handleChange(setPhone)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ambulance Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter ambulance number"
            value={ambulanceNumber}
            onChange={handleChange(setAmbulanceNumber)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={handleChange(setEmail)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>License Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter license number"
            value={licenseNumber}
            onChange={handleChange(setLicenseNumber)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <FormControl
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={handleChange(setPassword)}
              required
            />
            <InputGroup.Text>
              <IconButton onClick={handlePasswordVisibility}>
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ambulance Type</Form.Label>
          <Form.Select
            value={ambulanceType}
            onChange={handleChange(setAmbulanceType)}
            required
          >
            <option value="Basic">Basic Ambulance</option>
            <option value="Advance">Advance Ambulance</option>
            <option value="Transport">Transport Ambulance</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit" onClick={DriverRegisterHandel}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default DriverForm;
