import React, { useState } from "react";
import Setting from "../pages/Settings";
import DriverForm from "./DriverForm";
import DriverDetails from "./DriverDetails";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const Navs = () => {
  const navigate = useNavigate();
  const [activeContent, setActiveContent] = useState("Setting");

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("hospitaltoken");

      if (token) {
        await axios.post("http://localhost:5000/hospitalLogout", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        localStorage.removeItem("hospitaltoken");
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
        return <div>Hospital dashboard</div>;
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
    <div>
      <nav
        className="navbar navbar-expand-lg navbar-dark "
        style={{ height: "90px", backgroundColor: "red" }}
      >
        <div className="container-fluid p-5">
          <Link className="navbar-brand fs-2" to="/Navs">
            Hospital Dashboard
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
              onClick={() => setActiveContent("DriverForm")}
            >
              <button className="nav-link text-dark btn btn-link">
                <i className="bi bi-person-fill pe-2"></i> Driver Form
              </button>
            </li>
            <hr />
            <li
              className="nav-item ps-4"
              onClick={() => setActiveContent("DriverDetails")}
            >
              <button className="nav-link text-dark btn btn-link">
                <i className="bi-people-fill pe-2"></i> Driver Details
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

        <div className="p-4" style={{ flex: 1 }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Navs;
