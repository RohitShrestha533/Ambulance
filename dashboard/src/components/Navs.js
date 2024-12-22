import React, { useState, useEffect } from "react";
import RevenuePieChart from "../components/RevenuePieChart";
import Setting from "../pages/Settings";
import Notification from "../pages/Notification";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

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
        return <RevenuePieChart />;
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
    <div>
      <nav
        className="navbar navbar-expand-lg navbar-dark "
        style={{ height: "90px", backgroundColor: "red" }}
      >
        <div className="container-fluid p-5">
          <Link className="navbar-brand fs-2" to="/Navs">
            Admin Dashboard
          </Link>
          <div className="d-flex">
            <button className="btn btn-primary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="d-flex">
        <div
          className="bg-light"
          style={{
            width: "200px",
            minHeight: "100vh",
            paddingTop: "20px",
            borderRight: "1px solid #ddd",
          }}
        >
          <ul className="nav flex-column">
            <li
              className="nav-item ps-4"
              onClick={() => setActiveContent("Dashboard")}
            >
              <button className="nav-link text-dark btn btn-link">
                <i className="bi bi-house-door-fill pe-2"></i> Dashboard
              </button>
            </li>
            <hr />
            <li
              className="nav-item ps-4"
              onClick={() => setActiveContent("Notification")}
            >
              <button className="nav-link text-dark btn btn-link">
                <i className="bi bi-bell-fill pe-1"></i> Notification
                {notificationCount > 0 && (
                  <span className="badge bg-danger">{notificationCount}</span>
                )}
              </button>
            </li>
            <hr />
            <li
              className="nav-item ps-4"
              onClick={() => setActiveContent("Setting")}
            >
              <button className="nav-link text-dark btn btn-link">
                <i className="bi bi-gear-fill pe-2"></i> Setting
              </button>
            </li>
            <hr />
          </ul>
        </div>

        {/* Main Content */}
        <div className="p-4" style={{ flex: 1 }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Navs;
