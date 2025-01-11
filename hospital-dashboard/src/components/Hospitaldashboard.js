import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Hospitaldashboard = () => {
  const [summary, setSummary] = useState({
    completedPrice: 0,
    totalBookings: 0,
    bookingsByAmbulanceType: [],
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { name } = location.state || {};

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("hospitaltoken");
        if (!token) {
          alert("Unauthorized access. Please log in.");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/hospital/hospitalbookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSummary(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch booking summary. Please try again.");
      }
    };

    fetchSummary();
  }, [navigate]);

  return (
    <div>
      <h1>{name}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>Total Completed Bookings Price: {summary.completedPrice}</p>
      <p>Total Bookings: {summary.totalBookings}</p>

      <h2>Bookings by Ambulance Type</h2>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Ambulance Type</th>
            <th>Total Bookings</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {summary.bookingsByAmbulanceType.length === 0 ? (
            <tr>
              <td colSpan="3">No completed bookings found.</td>
            </tr>
          ) : (
            summary.bookingsByAmbulanceType.map((item) => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.totalBookings}</td>
                <td>{item.totalPrice}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Hospitaldashboard;
