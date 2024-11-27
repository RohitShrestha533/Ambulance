import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Typography,
} from "@mui/material";

const Notification = () => {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/getUnverifiedHospitals")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched hospitals:", data);
        setHospitals(data);
      })
      .catch((error) => console.error("Error fetching hospitals:", error));
  }, []);

  const handleApprove = (hospitalId) => {
    fetch(`http://localhost:5000/api/hospitals/approve/${hospitalId}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then(() => {
        setHospitals((prev) =>
          prev.filter((hospital) => hospital._id !== hospitalId)
        );
      })
      .catch((error) => console.error("Error approving hospital:", error));
  };

  return (
    <TableContainer component={Paper} sx={{ margin: "30px -10px" }}>
      <Typography
        variant="h6"
        sx={{ padding: "6px", backgroundColor: "#f5f5f5" }}
      >
        Hospitals Pending Approval
      </Typography>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell>Hospital Name</TableCell>
            <TableCell>Registration Number</TableCell>
            <TableCell>Admin Name</TableCell>
            <TableCell>Admin Number</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Ambulance</TableCell>
            <TableCell>HospitalType</TableCell>
            <TableCell>OperatingHours</TableCell>
            <TableCell>coordinates</TableCell>
            <TableCell>emergencyContact</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {hospitals.length > 0 ? (
            hospitals.map((hospital, index) => (
              <TableRow
                key={hospital._id}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white", // Alternating colors
                }}
              >
                <TableCell>{hospital.hospitalName}</TableCell>
                <TableCell>{hospital.registrationNumber}</TableCell>
                <TableCell>{hospital.adminName}</TableCell>
                <TableCell>{hospital.adminContact}</TableCell>
                <TableCell>{hospital.address}</TableCell>
                <TableCell>{hospital.email}</TableCell>
                <TableCell>{hospital.ambulanceCount}</TableCell>
                <TableCell>{hospital.hospitalType}</TableCell>
                <TableCell>{hospital.operatingHours}</TableCell>
                <TableCell>{hospital.coordinates}</TableCell>
                <TableCell>{hospital.emergencyContact}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleApprove(hospital._id)}
                  >
                    Approve
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No hospitals pending approval.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Notification;
