import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Navs from "./components/Navs";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import "bootstrap-icons/font/bootstrap-icons.css";

const App = () => {
  const token = localStorage.getItem("admintoken");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Register" element={<Register />} />

        <Route
          path="/navs/*"
          element={
            <ProtectedRoute isAuthenticated={!!token}>
              <Navs />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
