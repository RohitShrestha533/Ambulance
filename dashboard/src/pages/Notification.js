import React, { useEffect, useState } from "react";
import axios from "axios";

const Notification = ({ setNotificationCount }) => {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/getUnverifiedHospitals"
        );
        setHospitals(response.data.hospitals);
        setNotificationCount(response.data.count);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    fetchHospitals();
  }, [setNotificationCount]);

  const handleApprove = async (hospitalId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/hospitals/approve/${hospitalId}`
      );

      setHospitals((prevHospitals) =>
        prevHospitals.filter((hospital) => hospital._id !== hospitalId)
      );

      setNotificationCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error approving hospital:", error);
    }
  };

  return (
    <div>
      <table className="table table-striped table-bordered mt-5">
        <thead style={{ backgroundColor: "#007bff", color: "white" }}>
          <tr>
            <th scope="col">Registration Number</th>
            <th scope="col">Admin Name</th>
            <th scope="col">Admin Number</th>
            <th scope="col">Email</th>
            <th scope="col">Ambulance</th>
            <th scope="col">Coordinates</th>
            <th scope="col">Emergency Contact</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {hospitals.length === 0 ? (
            <tr>
              <td colSpan="11" className="text-center">
                No hospital added
              </td>
            </tr>
          ) : (
            hospitals.map((hospital) => (
              <tr key={hospital._id} style={{ backgroundColor: "#ffffff" }}>
                <td>{hospital.registrationNumber}</td>
                <td>{hospital.adminName}</td>
                <td>{hospital.adminContact}</td>
                <td>{hospital.email}</td>
                <td>{hospital.ambulanceCount}</td>
                <td>
                  {hospital.location.coordinates[0]},
                  {hospital.location.coordinates[1]}
                </td>
                <td>{hospital.emergencyContact}</td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => handleApprove(hospital._id)}
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Notification;
