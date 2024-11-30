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
import axios from "axios";
const Notification = () => {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/getUnverifiedHospitals");
        // console.log("Fetched hospitals:", response.data);
        setHospitals(response.data.hospitals); 
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    fetchHospitals();
  }, []);

 const handleApprove = async (hospitalId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/hospitals/approve/${hospitalId}`);
      // console.log("Approved hospital:", response.data);

      setHospitals((prevHospitals) =>
        prevHospitals.filter((hospital) => hospital._id !== hospitalId)
      );
    } catch (error) {
      console.error("Error approving hospital:", error);
    }
  };
  return (
    <TableContainer component={Paper} sx={{ margin: "30px ",
        overflowX: "auto", width:"100%" }}>
      <Typography
        variant="h6"
        sx={{ padding: "6px", backgroundColor: "#f5f5f5" }}
      >
        Hospitals Pending Approval
      </Typography>
      <Table sx={{ minWidth: "1200px" }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell>Hospital Name</TableCell>
            <TableCell sx={{ width: 50 }}>Registration Number</TableCell>
            <TableCell sx={{ width: 50 }}>Admin Name</TableCell>
            <TableCell sx={{ width: 50 }}>Admin Number</TableCell>
            <TableCell sx={{ width: 50 }}>Address</TableCell>
            <TableCell sx={{ width: 50 }}>Email</TableCell>
            <TableCell sx={{ width: 50 }}>Ambulance</TableCell>
            <TableCell sx={{ width: 50 }}>HospitalType</TableCell>
            <TableCell sx={{ width: 50 }}>OperatingHours</TableCell>
            <TableCell sx={{ width: 50 }}>coordinates</TableCell>
            <TableCell sx={{ width: 50 }}>emergencyContact</TableCell>
            <TableCell sx={{ width: 50 }}>Action</TableCell>
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
