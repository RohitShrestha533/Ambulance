import express from "express";
import {
  driverRegister,
  driverLogin,
  driverJWT,
  driverLogout,
  DriverData,
  UpdateDriver,
  driverbookingHistory,
  drivercancelBooking,
  confirmBooking,
} from "../controllers/driverController.js";
import {
  hospitalRegister,
  hospitalLogin,
  hospitalLogout,
  hospitalJWT,
  hospitalData,
  approveHospital,
  hospitaldriverData,
  UpdateHospitalData,
  hospitalUpdateDriver,
} from "../controllers/hospitalController.js";
import { getAllBookings } from "../controllers/bookingcontroller.js";
import { getUnverifiedHospitals } from "../controllers/hospitalController.js";
const router = express.Router();

router.get("/hospitalData", hospitalJWT, hospitalData);
router.get(
  "/hospitaldashboard/hospitaldriverData",
  hospitalJWT,
  hospitaldriverData
);

router.post("/driverRegister", hospitalJWT, driverRegister);
router.post("/driverLogin", driverLogin);
router.post("/driverLogout", driverLogout);
router.get("/DriverData", driverJWT, DriverData);
router.put("/UpdateDriver", driverJWT, UpdateDriver);

router.get("/driverbookingHistory", driverJWT, driverbookingHistory);
router.post("/drivercancelBooking", driverJWT, drivercancelBooking);
router.post("/confirmBooking", driverJWT, confirmBooking);
router.get("/api/getAllBookings", driverJWT, getAllBookings);

router.post("/api/hospitals/approve/:hospitalId", approveHospital);
router.get("/api/getUnverifiedHospitals", getUnverifiedHospitals);
router.post("/hospitalLogin", hospitalLogin);
router.post("/hospitalLogout", hospitalLogout);
router.post("/hospitalRegister", hospitalRegister);
router.put(
  "/hospitaldashboard/UpdateHospitalData",
  hospitalJWT,
  UpdateHospitalData
);
router.put(
  "/hospitaldashboard/hospitalUpdateDriver/:driverId",
  hospitalJWT,
  hospitalUpdateDriver
);

export default router;
