import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/hospitalLogin", {
        email,
        password,
      });
      const { message, token, name } = response.data;
      console.log("token", token);
      if (response.status === 200) {
        localStorage.setItem("hospitaltoken", token);
        alert("Login successful");
        setTimeout(() => {
          navigate("/navs");
        }, 1000);
      } else {
        setError(message);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong, please try again."
      );
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
        backgroundColor: "#f5f5f5",
        padding: 3,
      }}
    >
      <Box
        component="form"
        onSubmit={handleLogin}
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
      >
        <Typography variant="h5" align="center" sx={{ marginBottom: 2 }}>
          Hospital Login
        </Typography>
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
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
        <Typography variant="body2" align="center" className="mt-3">
          <Link
            to="/ForgetPassword"
            style={{ textDecoration: "none", color: "#1976d2" }}
          >
            Forget Password?
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
