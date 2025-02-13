import React, { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import axios from "axios";

const Dashboard = () => {
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
      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        stats && (
          <>
            <div className="container-fluid py-4">
              <div className="row mb-4">
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="card shadow-sm text-center">
                    <div className="card-body">
                      <h4>Total Revenue</h4>
                      <h2 className="text-primary">
                        Rs {stats.totalRevenue.toFixed(2) || "0.00"}
                      </h2>
                      <i
                        class="bi bi-coin"
                        style={{ fontSize: "40px", color: "red" }}
                      ></i>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="card shadow-sm text-center">
                    <div className="card-body">
                      <h4>Total Drivers</h4>
                      <h2 className="text-success">
                        {stats.totaldrivers || 0}
                      </h2>
                      <i
                        class="bi bi-person-vcard"
                        style={{ fontSize: "40px", color: "red" }}
                      ></i>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="card shadow-sm text-center">
                    <div className="card-body">
                      <h4>Total Hospitals</h4>
                      <h2 className="text-warning">
                        {stats.totalhospitals || 0}
                      </h2>
                      <i
                        className="bi bi-hospital"
                        style={{ fontSize: "40px", color: "red" }}
                      ></i>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="card shadow-sm text-center">
                    <div className="card-body">
                      <h4>Total Booking</h4>
                      <h2 className="text-danger">
                        {stats.totalBookings || 0}
                      </h2>
                      <i
                        class="bi bi-bus-front-fill"
                        style={{ fontSize: "40px", color: "red" }}
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="row mb-4">
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="card shadow-sm text-center">
                    <div className="card-body">
                      <h4>Advance Ambulance Booking</h4>
                      <h2 className="text-primary">
                        {stats.advanceBookings || 0}
                      </h2>
                      <p className="text-muted">Over All</p>
                      <i
                        class="bi bi-bus-front-fill"
                        style={{ fontSize: "40px", color: "red" }}
                      ></i>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="card shadow-sm text-center">
                    <div className="card-body">
                      <h4>Basic Ambulance Booking</h4>
                      <h2 className="text-success">
                        {stats.basicBookings || 0}
                      </h2>
                      <p className="text-muted">This Week</p>
                      <i
                        class="bi bi-bus-front-fill"
                        style={{ fontSize: "40px", color: "red" }}
                      ></i>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="card shadow-sm text-center">
                    <div className="card-body">
                      <h4>Transport Ambulance Booking</h4>
                      <h2 className="text-warning">
                        {stats.transportBookings || 0}
                      </h2>
                      <p className="text-muted">Registered Users</p>
                      <i
                        class="bi bi-bus-front-fill"
                        style={{ fontSize: "40px", color: "red" }}
                      ></i>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="card shadow-sm text-center">
                    <div className="card-body">
                      <h4>Total Booking</h4>
                      <h2 className="text-danger">
                        {stats.totalBookings || 0}
                      </h2>
                      <p className="text-muted">This Week</p>
                      <i
                        class="bi bi-bus-front-fill"
                        style={{ fontSize: "40px", color: "red" }}
                      ></i>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </>
        )
      )}
    </Container>
  );
};

export default Dashboard;
