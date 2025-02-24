import express from "express";
import { UpdateUserPassword } from "../controllers/controller.js";
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
  completeBooking,
  updateDriverLocation,
  pickup,
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
  hospitalbookings,
  HospitalCart,
  Hospitalpassword,
  hospitaldriverDelete,
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
router.get("/pickup", driverJWT, pickup);
router.put("/UpdateDriver", driverJWT, UpdateDriver);
router.post("/driver/UpdateUserPassword", driverJWT, UpdateUserPassword);

router.get("/driverbookingHistory", driverJWT, driverbookingHistory);
router.post("/drivercancelBooking", driverJWT, drivercancelBooking);
router.post("/confirmBooking", driverJWT, confirmBooking);
router.post("/completeBooking", driverJWT, completeBooking);
router.get("/api/getAllBookings", driverJWT, getAllBookings);
router.post("/updateDriverLocation", driverJWT, updateDriverLocation);

router.post("/api/hospitals/approve/:hospitalId", approveHospital);
router.get("/api/getUnverifiedHospitals", getUnverifiedHospitals);
router.post("/hospitalLogin", hospitalLogin);
router.post("/hospitalLogout", hospitalLogout);
router.post("/hospitalRegister", hospitalRegister);

router.post("/hospital/change-password", Hospitalpassword);
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
router.get(
  "/hospitaldashboard/hospitalbookings",
  hospitalJWT,
  hospitalbookings
);
router.get("/hospitaldashboard/HospitalCart", hospitalJWT, HospitalCart);
router.delete(
  "/hospitaldashboard/hospitaldriverDelete",
  hospitalJWT,
  hospitaldriverDelete
);

export default router;
