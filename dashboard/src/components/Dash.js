import React, { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import axios from "axios";

const Dash = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("admintoken");

        if (token) {
          const response = await axios.post(
            "http://localhost:5000/admin/bookingdetails",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setStats(response.data);
          console.log(response.data);
        } else {
          setError("Admin token is missing. Please login again.");
        }
      } catch (err) {
        setError("Error fetching data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container className="d-flex flex-wrap   align-items-center mt-5 gap-4">
      {/* <Container className="d-flex flex-wrap  justify-content-center align-items-center mt-5 gap-3"> */}
      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        stats && (
          <>
            {/* Total Revenue */}
            <div className="stat-card">
              <div>
                <h5>Total Revenue</h5>
                <p>Rs {stats.totalRevenue.toFixed(2) || "0.00"}</p>
              </div>
              <div>
                <i
                  class="bi bi-coin"
                  style={{ fontSize: "40px", color: "red" }}
                ></i>
              </div>
            </div>

            {/* Total Drivers */}
            <div className="stat-card">
              <div>
                <h5>Total Drivers</h5>
                <p>{stats.totaldrivers || 0}</p>
              </div>
              <div>
                <i
                  class="bi bi-person-vcard"
                  style={{ fontSize: "40px", color: "red" }}
                ></i>
              </div>
            </div>

            {/* Total Hospitals */}
            <div className="stat-card">
              <div>
                <h5>Total Hospitals</h5>
                <p>{stats.totalhospitals || 0}</p>
              </div>
              <div>
                <i
                  className="bi bi-hospital"
                  style={{ fontSize: "40px", color: "red" }}
                ></i>
              </div>
            </div>

            {/* Total Bookings */}
            <div className="stat-card">
              <div>
                <h5>Total Booking</h5>
                <p>{stats.totalBookings || 0}</p>
              </div>
              <div>
                <i
                  class="bi bi-bus-front-fill"
                  style={{ fontSize: "40px", color: "red" }}
                ></i>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <h5>Advance Ambulance Booking</h5>
                <p>{stats.advanceBookings || 0}</p>
              </div>
              <div>
                <i
                  class="bi bi-bus-front-fill"
                  style={{ fontSize: "40px", color: "red" }}
                ></i>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <h5>Basic Ambulance Booking</h5>
                <p>{stats.basicBookings || 0}</p>
              </div>
              <div>
                <i
                  class="bi bi-bus-front-fill"
                  style={{ fontSize: "40px", color: "red" }}
                ></i>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <h5>Transport Ambulance Booking</h5>
                <p>{stats.transportBookings || 0}</p>
              </div>
              <div>
                <i
                  class="bi bi-bus-front-fill"
                  style={{ fontSize: "40px", color: "red" }}
                ></i>
              </div>
            </div>
          </>
        )
      )}
    </Container>
  );
};

export default Dash;
