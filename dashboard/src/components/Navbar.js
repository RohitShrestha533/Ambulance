import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("admintoken");

      if (token) {
        await axios.post(
          "http://localhost:5000/admin/adminLogout",

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        localStorage.removeItem("admintoken");

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

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: 1201, backgroundColor: "red", height: 80 }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Admin Dashboard
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
