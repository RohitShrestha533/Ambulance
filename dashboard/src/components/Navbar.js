import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";

const Navbar = () => {
  const navigation = useNavigate();
  const [activeLink, setActiveLink] = useState("");

  const { authState, setAuthState } = useAuth();
  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
    navigation(`/${linkName}`);
  };
  const handleLogout = () => {
    localStorage.removeItem("admintoken");
    setAuthState({ token: null }); // Clear the token in context
    navigation("/login", { replace: true }); // Navigate to the login page
  };
  return (
    <nav className="navbar navbar-dark custom-navbar fixed-top">
      <div className="container-fluid">
        {/* Brand Name */}
        <a className="navbar-brand custom-navbar-brand" href="/">
          Admin Dashboard
        </a>

        {/* Toggle Button on Right */}
        <button
          className="navbar-toggler ms-auto"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Sidebar (Offcanvas) */}
        <div
          className="offcanvas offcanvas-start"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5
              className="offcanvas-title custom-navbar-title"
              id="offcanvasNavbarLabel"
            >
              Admin
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <hr />
          <div className="offcanvas-body d-flex justify-content-space-between">
            <ul className="navbar-nav">
              {["Dashboard", "Notification", "Setting"].map((linkName) => (
                <li className="nav-item" key={linkName}>
                  <button
                    className={`nav-link btn btn-link custom-nav-link ${
                      activeLink === linkName ? "active" : ""
                    }`}
                    onClick={() => handleLinkClick(linkName)}
                  >
                    <i
                      className={`bi bi-${
                        linkName === "Dashboard"
                          ? "speedometer"
                          : linkName === "Notification"
                          ? "cart-plus-fill"
                          : "gear-fill"
                      } pe-2`}
                    ></i>
                    {linkName}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-auto p-3">
              <button className="btn btn-danger w-100" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right pe-2"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
