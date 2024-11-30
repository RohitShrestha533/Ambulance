import express from "express";
import {
  driverRegister,
  driverLogin,
  driverJWT,
  driverLogout,
  DriverData,
  UpdateDriver,
} from "../controllers/driverController.js";
import {
  hospitalRegister,
  hospitalLogin,
  hospitalLogout,
  hospitalJWT,
  hospitalData,
  approveHospital,
} from "../controllers/hospitalController.js";
import { getUnverifiedHospitals } from "../controllers/hospitalController.js";
const router = express.Router();

router.get("/hospitalData", hospitalJWT, hospitalData);

router.post("/driverRegister", hospitalJWT, driverRegister);
router.post("/driverLogin", driverLogin);
router.post("/driverLogout", driverLogout);
router.get("/DriverData", driverJWT, DriverData);
router.put("/UpdateDriver", driverJWT, UpdateDriver);

router.post("/api/hospitals/approve/:hospitalId", approveHospital);
router.get("/api/getUnverifiedHospitals", getUnverifiedHospitals);
router.post("/hospitalLogin", hospitalLogin);
router.post("/hospitalLogout", hospitalLogout);
router.post("/hospitalRegister", hospitalRegister);

export default router;
