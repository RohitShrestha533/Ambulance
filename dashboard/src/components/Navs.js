import React, { useState, useEffect } from "react";
// import RevenuePieChart from "../components/RevenuePieChart";
import Setting from "../pages/Settings";
import Dash from "./Dash";
import Notification from "../pages/Notification";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navs = () => {
  const navigate = useNavigate();
  const [activeContent, setActiveContent] = useState("RevenuePieChart");
  const [notificationCount, setNotificationCount] = useState(0);
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/getUnverifiedHospitals"
        );
        setNotificationCount(response.data.count);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    fetchHospitals();
  }, [setNotificationCount]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("admintoken");

      if (token) {
        await axios.post(
          "http://localhost:5000/admin/adminLogout",
          {},
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

  const renderContent = () => {
    switch (activeContent) {
      case "Dashboard":
        // return <RevenuePieChart />;
        return <Dash />;
      case "Notification":
        return <Notification setNotificationCount={setNotificationCount} />;
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
                Super Admin
              </button>
              {/* <i className="bi bi-list pe-3"></i> */}
            </div>
            <hr />
            <li
              className="nav-item"
              onClick={() => setActiveContent("Dashboard")}
            >
              <button className="nav-link  btn btn-link">
                <i className="bi bi-house-door-fill pe-2"></i> Dashboard
              </button>
            </li>

            <li
              className="nav-item"
              onClick={() => setActiveContent("Notification")}
            >
              <button className="nav-link  btn btn-link">
                <i className="bi bi-bell-fill pe-1"></i> Notification
                {notificationCount > 0 && (
                  <span className="badge bg-danger">{notificationCount}</span>
                )}
              </button>
            </li>

            <li
              className="nav-item"
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

        {/* Main Content */}
        <div className="p-4" style={{ flex: 1, overflowY: "auto" }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Navs;
