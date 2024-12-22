import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DriverDetails = () => {
  const [driverData, setDriverData] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(null); // Track the driver being edited

  // Fetch driver data
  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const token = localStorage.getItem("hospitaltoken");

        if (!token) {
          throw new Error("No token found, please login again");
        }

        const response = await axios.get(
          "http://localhost:5000/hospitaldashboard/hospitaldriverData",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.data?.drivers) {
          setDriverData(response.data.drivers);
        } else {
          throw new Error("Invalid driver data received");
        }
      } catch (error) {
        console.error("Error fetching driver data:", error);
        setError(error.message);

        if (error.response?.status === 401) {
          navigate("/login"); // Redirect to login if unauthorized
        }
      }
    };

    fetchDriverData();
  }, [navigate]);

  const handleInputChange = (e, driverId) => {
    const { name, value } = e.target;
    setDriverData((prevData) =>
      prevData.map((driver) =>
        driver._id === driverId ? { ...driver, [name]: value } : driver
      )
    );
  };

  const handleUpdate = async (driverId) => {
    try {
      const token = localStorage.getItem("hospitaltoken");
      if (!token) {
        throw new Error("No token found, please login again");
      }

      const updatedDriver = driverData.find(
        (driver) => driver._id === driverId
      );

      const response = await axios.put(
        `http://localhost:5000/UpdateDriver/${driverId}`,
        updatedDriver,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Driver data updated successfully");
        setIsEditing(null); // Exit editing mode
      }
    } catch (error) {
      console.error("Error updating driver data:", error);
      alert("Failed to update driver data. Please try again.");
    }
  };

  if (!driverData.length && !error) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <table className="table table-striped table-bordered mt-5">
        <thead style={{ backgroundColor: "#007bff", color: "white" }}>
          <tr>
            <th>Driver Name</th>
            <th>License Number</th>
            <th>Ambulance Number</th>
            <th>Admin Number</th>
            <th>Email</th>
            <th>Date of Birth</th>
            <th>Gender</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {driverData.map((driver) => (
            <tr key={driver._id} style={{ backgroundColor: "#ffffff" }}>
              <td>
                {isEditing === driver._id ? (
                  <input
                    type="text"
                    className="form-control"
                    name="fullname"
                    value={driver.fullname}
                    onChange={(e) => handleInputChange(e, driver._id)}
                  />
                ) : (
                  driver.fullname
                )}
              </td>
              <td>{driver.licenseNumber}</td>
              <td>{driver.ambulanceNumber}</td>
              <td>
                {isEditing === driver._id ? (
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={driver.phone}
                    onChange={(e) => handleInputChange(e, driver._id)}
                  />
                ) : (
                  driver.phone
                )}
              </td>
              <td>{driver.email}</td>
              <td>
                {isEditing === driver._id ? (
                  <input
                    type="date"
                    className="form-control"
                    name="Dob"
                    value={driver.Dob}
                    onChange={(e) => handleInputChange(e, driver._id)}
                  />
                ) : (
                  driver.Dob
                )}
              </td>
              <td>
                {isEditing === driver._id ? (
                  <select
                    className="form-control"
                    name="gender"
                    value={driver.gender}
                    onChange={(e) => handleInputChange(e, driver._id)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  driver.gender
                )}
              </td>
              <td>{driver.status}</td>
              <td>
                {isEditing === driver._id ? (
                  <>
                    <button
                      className="btn btn-success"
                      onClick={() => handleUpdate(driver._id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setIsEditing(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsEditing(driver._id)}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriverDetails;
