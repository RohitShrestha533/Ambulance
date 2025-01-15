import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Navs from "./components/Navs";
import ForgetPassword from "./components/ForgetPassword";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";
const App = () => {
  const token = localStorage.getItem("admintoken");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/ForgetPassword" element={<ForgetPassword />} />

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
