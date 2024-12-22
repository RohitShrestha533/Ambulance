import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("admintoken");

        if (!token) {
          throw new Error("No token found, please login again");
        }

        const response = await axios.get(
          "http://localhost:5000/admin/AdminData",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.data?.admin) {
          const admin = response.data.admin;
          admin.Dob = new Date(admin.Dob).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          setAdminData(admin);
        } else {
          throw new Error("Invalid Admin data");
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setError(error.message);
        setAdminData(null);

        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate("/login");
        }
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        throw new Error("No token found, please login again");
      }
      const response = await axios.put(
        "http://localhost:5000/admin/UpdateAdmin",
        adminData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Admin data updated successfully");
        setIsEditing(false); // Exit editing mode
      }
    } catch (error) {
      console.error("Error updating admin data:", error);
      alert("Failed to update admin data. Please try again.");
    }
  };

  if (!adminData && !error) {
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
            <th scope="col">Admin Name</th>
            <th scope="col">Admin Number</th>
            <th scope="col">Email</th>
            <th scope="col">Date of Birth</th>
            <th scope="col">Gender</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ backgroundColor: "#ffffff" }}>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  name="fullname"
                  value={adminData.fullname}
                  onChange={handleInputChange}
                />
              ) : (
                adminData.fullname
              )}
            </td>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={adminData.phone}
                  onChange={handleInputChange}
                />
              ) : (
                adminData.phone
              )}
            </td>
            <td>{adminData.email}</td>
            <td>
              {isEditing ? (
                <input
                  type="date"
                  className="form-control"
                  name="Dob"
                  value={adminData.Dob}
                  onChange={handleInputChange}
                />
              ) : (
                adminData.Dob
              )}
            </td>
            <td>
              {isEditing ? (
                <select
                  className="form-control"
                  name="gender"
                  value={adminData.gender}
                  onChange={handleInputChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                adminData.gender
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
