import React, { useState } from "react";
import Setting from "../pages/Settings";
import DriverForm from "./DriverForm";
import DriverDetails from "./DriverDetails";
import Hospitaldashboard from "./Hospitaldashboard";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navs = () => {
  const navigation = useNavigate();
  const [activeContent, setActiveContent] = useState("Setting");
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("hospitaltoken");

      if (token) {
        await axios.post(
          "http://localhost:5000/hospitalLogout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        localStorage.removeItem("hospitaltoken");
        navigation("/login", { replace: true });
        alert("Logged out successfully");
      } else {
        alert("No token found, user might already be logged out.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to log out. Please try again.";
      alert(errorMessage);
    }
  };

  const renderContent = () => {
    switch (activeContent) {
      case "Dashboard":
        return <Hospitaldashboard />;

      case "DriverForm":
        return <DriverForm />;
      case "DriverDetails":
        return <DriverDetails />;
      case "Setting":
        return <Setting />;
      default:
        return (
          <div>
            <h2>Welcome</h2>
            <p>Select an option from the sidebar.</p>
          </div>
        );
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f9f9f9",
      }}
    >
      {/* Main Content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div
          className="d-flex flex-column "
          style={{
            width: "16%",
            height: "100%",
            backgroundColor: "white",
            paddingTop: "20px",
            justifyContent: "space-between",
          }}
        >
          {/* Navigation Links */}
          <ul className="nav flex-column">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: "50px",
                fontSize: "larger", // Correct way to use font size
                fontWeight: "bold",
              }}
            >
              <button
                style={{
                  fontSize: "larger",
                  fontWeight: 500,
                  textDecoration: "none",
                  border: "none",
                  background: "none",
                }}
                onClick={() => setActiveContent("Dashboard")}
              >
                Hospital Admin
              </button>
              {/* <i className="bi bi-list pe-3"></i> */}
            </div>
            <hr />
            <li
              className="nav-item "
              onClick={() => setActiveContent("Dashboard")}
            >
              <button className="nav-link  btn btn-link">
                <i className="bi bi-speedometer pe-2"></i> Dashboard
              </button>
            </li>

            <li
              className="nav-item "
              onClick={() => setActiveContent("DriverForm")}
            >
              <button className="nav-link  btn btn-link">
                <i className="bi bi-person-fill pe-2"></i> Driver Form
              </button>
            </li>

            <li
              className="nav-item "
              onClick={() => setActiveContent("DriverDetails")}
            >
              <button className="nav-link  btn btn-link">
                <i className="bi bi-people-fill pe-2"></i> Driver Details
              </button>
            </li>

            <li
              className="nav-item "
              onClick={() => setActiveContent("Setting")}
            >
              <button className="nav-link  btn btn-link">
                <i className="bi bi-gear-fill pe-2"></i> Setting
              </button>
            </li>
          </ul>

          <div className="p-3">
            <button className="btn btn-danger w-100" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right pe-2"></i>
              Logout
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4" style={{ flex: 1, overflowY: "auto" }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Navs;
