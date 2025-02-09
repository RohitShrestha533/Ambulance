// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { TextField, Button, Box, Typography } from "@mui/material";

// import { useAuth } from "../context/AuthContext";
// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigation = useNavigate();

//   const { setAuthState } = useAuth();
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     const adminData = { email, password };

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/admin/adminLogin",
//         adminData
//       );
//       const { status, message, token } = response.data;

//       if (status === 200) {
//         localStorage.setItem("admintoken", token);
//         alert("Login successful");
//         setAuthState({ token });
//         navigation("/Dashboard", { replace: true });
//       } else {
//         setError(message);
//       }
//     } catch (error) {
//       setError(
//         error.response?.data?.message ||
//           "Something went wrong, please try again."
//       );
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         minHeight: "100vh",
//         backgroundColor: "#f5f5f5",
//         padding: 3,
//       }}
//     >
//       <Box
//         component="form"
//         onSubmit={handleLogin}
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           gap: 2,
//           maxWidth: 400,
//           width: "100%",
//           backgroundColor: "white",
//           padding: 4,
//           borderRadius: 2,
//           boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <Typography variant="h5" align="center" sx={{ marginBottom: 2 }}>
//           Admin Login
//         </Typography>
//         {error && (
//           <Typography color="error" variant="body2" align="center">
//             {error}
//           </Typography>
//         )}
//         <TextField
//           label="Email"
//           variant="outlined"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <TextField
//           label="Password"
//           variant="outlined"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <Button type="submit" variant="contained" color="primary">
//           Login
//         </Button>{" "}
//         <Typography variant="body2" align="center">
//           <Link
//             to="/ForgetPassword"
//             style={{ textDecoration: "none", color: "#1976d2" }}
//           >
//             Forget Password?
//           </Link>
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default LoginPage;
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Typography } from "@mui/material";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { setAuthState } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/admin/adminLogin",
        formData
      );
      const { status, message, token } = response.data;

      if (status === 200) {
        localStorage.setItem("admintoken", token);
        setAuthState({ token });
        navigate("/Dashboard");
      } else {
        setError(message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message ||
          "Something went wrong, please try again."
      );
    }
  };

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#e7e3ed",
      }}
    >
      <div
        className="card shadow-lg p-4 mb-5 bg-white rounded"
        style={{ width: "400px" }}
      >
        <h2 className="text-center mb-4">Admin Login</h2>
        <form onSubmit={handleLogin}>
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>

          <Typography variant="body2" align="center" className="mt-3">
            <Link
              to="/ForgetPassword"
              style={{ textDecoration: "none", color: "#1976d2" }}
            >
              Forget Password?
            </Link>
          </Typography>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
