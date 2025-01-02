import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DriverDetails = () => {
  const [driverData, setDriverData] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(null);
  const [editDriverData, setEditDriverData] = useState(null);

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
          navigate("/login");
        }
      }
    };

    fetchDriverData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditDriverData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditClick = (driverId) => {
    const driverToEdit = driverData.find((driver) => driver._id === driverId);
    setEditDriverData({ ...driverToEdit });
    setIsEditing(driverId);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("hospitaltoken");
      if (!token) {
        throw new Error("No token found, please login again");
      }

      if (!editDriverData || !editDriverData._id) {
        throw new Error("Invalid driver data");
      }

      const response = await axios.put(
        `http://localhost:5000/hospitaldashboard/hospitalUpdateDriver/${editDriverData._id}`,
        editDriverData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Driver data updated successfully");

        const updatedData = await axios.get(
          "http://localhost:5000/hospitaldashboard/hospitaldriverData",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setDriverData(updatedData.data.drivers);
        setIsEditing(null);
        setEditDriverData(null);
      }
    } catch (error) {
      console.error("Error updating driver data:", error);
      alert("Failed to update driver data. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditDriverData(null);
  };

  if (driverData.length === 0) {
    return <div> Driver hasnot been added...</div>;
  }

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
            <th>Driver Number</th>
            <th>Email</th>
            <th>Ambulance Type</th>
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
                    value={editDriverData?.fullname || driver.fullname}
                    onChange={(e) => handleInputChange(e, driver._id)}
                  />
                ) : (
                  driver.fullname
                )}
              </td>
              <td>
                {isEditing === driver._id ? (
                  <input
                    type="text"
                    className="form-control"
                    name="licenseNumber"
                    value={
                      editDriverData?.licenseNumber || driver.licenseNumber
                    }
                    onChange={(e) => handleInputChange(e, driver._id)}
                  />
                ) : (
                  driver.licenseNumber
                )}
              </td>
              <td>{driver.ambulanceNumber}</td>
              <td>
                {isEditing === driver._id ? (
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={editDriverData?.phone || driver.phone}
                    onChange={(e) => handleInputChange(e, driver._id)}
                  />
                ) : (
                  driver.phone
                )}
              </td>
              <td>{driver.email}</td>
              <td>
                {isEditing === driver._id ? (
                  <select
                    className="form-control"
                    name="ambulanceType"
                    value={
                      editDriverData?.ambulanceType || driver.ambulanceType
                    }
                    onChange={(e) => handleInputChange(e, driver._id)}
                  >
                    <option value="Basic">Basic</option>
                    <option value="Advance">Advance</option>
                    <option value="Transport">Transport</option>
                  </select>
                ) : (
                  driver.ambulanceType
                )}
              </td>
              <td>
                {isEditing === driver._id ? (
                  <select
                    className="form-control"
                    name="gender"
                    value={editDriverData?.gender || driver.gender}
                    onChange={(e) => handleInputChange(e, driver._id)}
                  >
                    <option value="">Gender</option>
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
                    <button className="btn btn-success" onClick={handleUpdate}>
                      Save
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditClick(driver._id)}
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
