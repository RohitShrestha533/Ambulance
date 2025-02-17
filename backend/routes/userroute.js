import express from "express";
import {
  userLogin,
  userLogout,
  userRegister,
  UserData,
  UpdateUser,
  driversnearby,
  driverlocation,
  UpdateUserPassword,
} from "../controllers/controller.js";
import {
  bookambulance,
  userbookingHistory,
  cancelBooking,
  sosbook,
} from "../controllers/bookingcontroller.js";
import { apiambudrivers, driveambu } from "../controllers/driverController.js";
import { getNearbyHospitals } from "../controllers/hospitalController.js";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
const router = express.Router();

router.get("/driver/api/ambu", authenticateJWT, driveambu);
router.get(
  "/driver/api/ambudrivers/:driverId",
  authenticateJWT,
  apiambudrivers
);

router.post("/drivers-nearby", authenticateJWT, driversnearby);
router.get("/driverlocation", driverlocation);
router.post("/book-ambulance", authenticateJWT, bookambulance);
router.get("/userbookingHistory", authenticateJWT, userbookingHistory);
router.post("/cancelBooking", authenticateJWT, cancelBooking);
router.post("/sosbook", authenticateJWT, sosbook);

router.post("/userRegister", userRegister);
router.post("/userLogin", userLogin);
router.post("/userLogout", userLogout);

router.get("/getNearbyHospitals", getNearbyHospitals);
router.get("/UserData", authenticateJWT, UserData);
router.put("/UpdateUser", authenticateJWT, UpdateUser);
router.post("/UpdateUserPassword", authenticateJWT, UpdateUserPassword);

export default router;
