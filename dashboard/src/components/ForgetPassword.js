import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigate();
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/forgot-password",
        { email }
      );
      if (response.data) {
        setIsOtpSent(true);
        setMessage("OTP sent to your email");
        setError("");
      } else {
        setError("Try later");
        setMessage("");
      }
    } catch (error) {
      setError("Error sending OTP");
      setMessage("");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/verify-otp", {
        email,
        otp,
      });
      setMessage(response.data.message);
      setError("");

      setIsOtpVerified(true);
    } catch (error) {
      setError("Invalid OTP");
      setMessage("");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/admin/change-password",
        {
          email,
          newPassword,
        }
      );
      if (response.data) {
        navigation("/login");
      }
    } catch (error) {
      console.log(error);
      setMessage("");
      setError("Error changing password");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#e7e3ed",
        padding: 3,
      }}
    >
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 400,
          width: "100%",
          backgroundColor: "white",
          padding: 4,
          borderRadius: 2,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
        onSubmit={
          isOtpVerified
            ? handleChangePassword
            : isOtpSent
            ? handleVerifyOtp
            : handleSendOtp
        }
      >
        <Typography variant="h5" align="center" sx={{ marginBottom: 2 }}>
          Forget Password
        </Typography>
        {message && (
          <Typography color="success" variant="body2" align="center">
            {message}
          </Typography>
        )}
        {error && (
          <Typography color="error" variant="body2" align="center">
            {error}
          </Typography>
        )}

        <TextField
          label="Email"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isOtpSent}
        />

        {!isOtpSent && (
          <Button type="submit" variant="contained" color="primary">
            Send OTP
          </Button>
        )}

        {isOtpSent && !isOtpVerified && (
          <>
            <TextField
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            <Button type="submit" variant="contained" color="primary">
              Verify OTP
            </Button>
          </>
        )}
        {isOtpVerified && (
          <>
            <TextField
              label="New Password"
              variant="outlined"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" color="primary">
              Change Password
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ForgotPassword;
