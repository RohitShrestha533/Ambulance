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
} from "../controllers/bookingcontroller.js";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
const router = express.Router();

router.post("/drivers-nearby", authenticateJWT, driversnearby);
router.get("/driverlocation", driverlocation);
router.post("/book-ambulance", authenticateJWT, bookambulance);
router.get("/userbookingHistory", authenticateJWT, userbookingHistory);
router.post("/cancelBooking", authenticateJWT, cancelBooking);

router.post("/userRegister", userRegister);
router.post("/userLogin", userLogin);
router.post("/userLogout", userLogout);

router.get("/UserData", authenticateJWT, UserData);
router.put("/UpdateUser", authenticateJWT, UpdateUser);
router.post("/UpdateUserPassword", authenticateJWT, UpdateUserPassword);

export default router;
