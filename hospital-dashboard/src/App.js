import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Navs from "./components/Navs";
import ProtectedRoute from "./components/ProtectedRoute";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const token = localStorage.getItem("hospitaltoken");

  return (
    <Router>
      <Routes>
        <Route
          path="/navs/*"
          element={
            <ProtectedRoute isAuthenticated={!!token}>
              <Navs />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
