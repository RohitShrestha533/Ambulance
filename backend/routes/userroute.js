import express from "express";
import {
  userLogin,
  userLogout,
  userRegister,
  UserData,
  UpdateUser,
  driversnearby,
} from "../controllers/controller.js";
import { bookambulance } from "../controllers/bookingcontroller.js";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
const router = express.Router();

router.post("/drivers-nearby", authenticateJWT, driversnearby);
router.post("/book-ambulance", authenticateJWT, bookambulance);

router.post("/userRegister", userRegister);
router.post("/userLogin", userLogin);
router.post("/userLogout", userLogout);

router.get("/UserData", authenticateJWT, UserData);
router.put("/UpdateUser", authenticateJWT, UpdateUser);

export default router;
