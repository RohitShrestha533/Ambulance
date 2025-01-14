import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Spinner } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { Grid, Typography, CircularProgress } from "@mui/material";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

// Register necessary components in Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Hospitaldashboard = () => {
  const [summary, setSummary] = useState("");
  const [drivercount, setDrivercount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [driverRevenues, setDriverRevenues] = useState([]);
  const { name } = location.state || {};
  useEffect(() => {
    const fetchDriverRevenues = async () => {
      try {
        const token = localStorage.getItem("hospitaltoken");
        if (!token) {
          alert("Unauthorized access. Please log in.");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/hospitaldashboard/HospitalCart",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Set the driver revenues to state
        setDriverRevenues(response.data.driverRevenues);
      } catch (error) {
        setError("Failed to fetch driver revenues. Please try again.");
        console.error("Error fetching driver revenues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverRevenues();
  }, []);

  // Prepare data for Pie and Bar charts
  const pieData = {
    labels: driverRevenues.map((data) => data.driverName),
    datasets: [
      {
        label: "Revenue by Driver",
        data: driverRevenues.map((data) => data.totalRevenue),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#FF5733",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const barData = {
    labels: driverRevenues.map((data) => data.driverName), // Drivers' names on the x-axis
    datasets: [
      {
        label: "Revenue by Driver",
        data: driverRevenues.map((data) => data.totalRevenue), // Revenue on the y-axis
        backgroundColor: [
          "#FF6384", // Color for Driver 1
          "#36A2EB", // Color for Driver 2
          "#FFCE56", // Color for Driver 3
          "#4BC0C0", // Color for Driver 4
          "#FF5733", // Color for Driver 5
        ].slice(0, driverRevenues.length), // Ensure colors match the number of drivers
        borderWidth: 0,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "black", // Light gray legend text
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `$${tooltipItem.raw.toFixed(2)}`; // Format tooltip with dollar sign
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Drivers", // Title for the x-axis
          color: "black", // Light gray for axis title
        },
        ticks: {
          color: "black", // Light gray tick text
        },
        grid: {
          display: false, // Hide gridlines for x-axis
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount ($)", // Title for the y-axis
          color: "black", // Light gray for axis title
        },
        ticks: {
          color: "black", // Light gray tick text
          callback: function (value) {
            return `$${value}`; // Format tick values with dollar sign
          },
        },
        grid: {
          color: "rgba(204, 204, 204, 0.2)", // Subtle light gray gridlines for y-axis
        },
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20,
      },
    },
  };

  // Fetch summary data
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
          "http://localhost:5000/hospitaldashboard/hospitalbookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSummary(response.data.stats);
        setDrivercount(response.data.driverCount);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch booking summary. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [navigate]);

  return (
    <Container className="d-flex flex-wrap align-items-center mt-5 gap-4">
      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        summary && (
          <>
            {/* Total Revenue */}
            <h1>{name}</h1>
            <div className="stat-card">
              <div>
                <h5>Total Revenue</h5>
                <p>Rs {summary.totalRevenue || "0.00"}</p>
              </div>
              <div>
                <i
                  className="bi bi-coin"
                  style={{ fontSize: "40px", color: "red" }}
                ></i>
              </div>
            </div>

            {/* Total Drivers */}
            <div className="stat-card">
              <div>
                <h5>Total Drivers</h5>
                <p>{drivercount || 0}</p>
              </div>
              <div>
                <i
                  className="bi bi-person-vcard"
                  style={{ fontSize: "40px", color: "red" }}
                ></i>
              </div>
            </div>

            {/* Total Bookings */}
            <div className="stat-card">
              <div>
                <h5>Total Booking</h5>
                <p>{summary.totalBookings || 0}</p>
              </div>
              <div>
                <i
                  className="bi bi-bus-front-fill"
                  style={{ fontSize: "40px", color: "red" }}
                ></i>
              </div>
            </div>

            {/* Other Booking Types */}
            <div className="stat-card">
              <div>
                <h5>Advance Ambulance Booking</h5>
                <p>{summary.advanceCount || 0}</p>
              </div>
              <div>
                <i
                  className="bi bi-bus-front-fill"
                  style={{ fontSize: "40px", color: "red" }}
                ></i>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <h5>Basic Ambulance Booking</h5>
                <p>{summary.basicCount || 0}</p>
              </div>
              <div>
                <i
                  className="bi bi-bus-front-fill"
                  style={{ fontSize: "40px", color: "red" }}
                ></i>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <h5>Transport Ambulance Booking</h5>
                <p>{summary.transportCount || 0}</p>
              </div>
              <div>
                <i
                  className="bi bi-bus-front-fill"
                  style={{ fontSize: "40px", color: "red" }}
                ></i>
              </div>
            </div>

            <Container>
              <Grid container spacing={4} justifyContent="center">
                {/* Loading state */}
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography color="error">{error}</Typography>
                ) : (
                  <>
                    {/* Pie Chart */}
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="h6" gutterBottom>
                        Revenue by Driver (Pie)
                      </Typography>
                      <Pie data={pieData} width={400} height={400} />
                    </Grid>

                    {/* Bar Chart */}
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="h6" gutterBottom>
                        Revenue by Driver (Bar)
                      </Typography>
                      <Bar
                        data={barData}
                        options={barOptions}
                        width={400}
                        height={400}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Container>
          </>
        )
      )}
    </Container>
  );
};

export default Hospitaldashboard;
