import React, { useEffect, useState } from "react";
import axios from "axios"; // Axios for API requests
import { useNavigate } from "react-router-dom"; // React Router for navigation

const Settings = () => {
  const [hospitalData, setHospitalData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const token = localStorage.getItem("hospitaltoken");
        console.log("Fetching hospital data...", token);

        if (!token) {
          throw new Error("No token found, please login again");
        }

        const response = await axios.get("http://localhost:5000/hospitalData", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        console.log("Response from server:", response.data);

        if (response.data?.hospital) {
          setHospitalData(response.data.hospital);
        } else {
          throw new Error("Invalid Hospital data");
        }
      } catch (error) {
        console.error("Error fetching Hospital data:", error);
        setError(error.message);
        setHospitalData(null);

        if (error.response?.status === 401) {
          navigate("/login"); // Redirect to login if unauthorized
        }
      }
    };

    fetchHospitalData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHospitalData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  if (!hospitalData && !error) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("hospitaltoken");
      if (!token) {
        throw new Error("No token found, please login again");
      }
      const response = await axios.put(
        "http://localhost:5000/admin/UpdateHospital",
        hospitalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Hospital data updated successfully");
        setIsEditing(false); // Exit editing mode
      }
    } catch (error) {
      console.error("Error updating Hospital data:", error);
      alert("Failed to update Hospital data. Please try again.");
    }
  };

  return (
    <div>
      <table className="table table-striped table-bordered mt-5">
        <thead style={{ backgroundColor: "#007bff", color: "white" }}>
          <tr>
            <th scope="col">Hospital Name</th>
            <th scope="col">Registration Number</th>
            <th scope="col">Admin Name</th>
            <th scope="col">Admin Number</th>
            <th scope="col">Email</th>
            <th scope="col">Ambulance</th>
            <th scope="col">Emergency Contact</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ backgroundColor: "#ffffff" }}>
            <td>{hospitalData.hospitalName}</td>
            <td>{hospitalData.registrationNumber}</td>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  name="adminName"
                  value={hospitalData.adminName}
                  onChange={handleInputChange}
                />
              ) : (
                hospitalData.adminName
              )}
            </td>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  name="adminContact"
                  value={hospitalData.adminContact}
                  onChange={handleInputChange}
                />
              ) : (
                hospitalData.adminContact
              )}
            </td>
            <td>{hospitalData.email}</td>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  name="ambulanceCount"
                  value={hospitalData.ambulanceCount}
                  onChange={handleInputChange}
                />
              ) : (
                hospitalData.ambulanceCount
              )}
            </td>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  name="emergencyContact"
                  value={hospitalData.emergencyContact}
                  onChange={handleInputChange}
                />
              ) : (
                hospitalData.emergencyContact
              )}
            </td>

            <td>
              {isEditing ? (
                <button className="btn btn-success" onClick={handleUpdate}>
                  Save
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Settings;
