// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LoginPage from "./components/LoginPage";
// import Navs from "./components/Navs";
// import ForgetPassword from "./components/ForgetPassword";
// import Register from "./components/Register";
// import ProtectedRoute from "./components/ProtectedRoute";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "./App.css";
// const App = () => {
//   const token = localStorage.getItem("admintoken");

//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/Register" element={<Register />} />
//         <Route path="/ForgetPassword" element={<ForgetPassword />} />

//         <Route
//           path="/navs/*"
//           element={
//             <ProtectedRoute isAuthenticated={!!token}>
//               <Navs />
//             </ProtectedRoute>
//           }
//         />

//         <Route path="*" element={<LoginPage />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./components/Register";
import Footer from "./components/Footer";
// import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./components/LoginPage";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Notification from "./pages/Notification";
import Settings from "./pages/Settings";
import ForgotPassword from "./components/ForgetPassword";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Make from "./components/Make";
import "./App.css";
import axios from "axios";
const App = () => {
  const { authState } = useAuth(); // Use the auth state from context
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

  return (
    <Router>
      <div className="app-container">
        {authState.token && <Navbar />} {/* Show Navbar if authenticated */}
        <div className="content">
          <Routes>
            <Route path="/login" element={!authState.token && <LoginPage />} />
            <Route
              path="/Register"
              element={!authState.token && <Register />}
            />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Make" element={<Make />} />
            <Route path="/ForgetPassword" element={<ForgotPassword />} />
            <Route path="/Setting" element={<Settings />} />
            <Route
              path="/Notification"
              element={
                <Notification setNotificationCount={setNotificationCount} />
              }
            />
            <Route path="/Register" element={<Register />} />
            <Route
              path="/"
              element={
                authState.token ? (
                  <Navigate to="/Dashboard" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </div>
        {authState.token && <Footer />} {/* Show Footer if authenticated */}
      </div>
    </Router>
  );
};

const AppWithProvider = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithProvider;
