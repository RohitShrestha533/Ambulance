import express from "express";
import {
  userLogin,
  userLogout,
  userRegister,
  UserData,
  UpdateUser,
} from "../controllers/controller.js";
import {
  adminLogin,
  adminLogout,
  adminRegister,
  AdminData,
  UpdateAdmin,
} from "../controllers/adminController.js";
import { checkAuth } from "../controllers/adminController.js";
import { driverRegister } from "../controllers/driverController.js";
import {
  hospitalRegister,
  hospitalLogin,
  hospitalLogout,
  hospitalcheckAuth,
  hospitalData,
} from "../controllers/hospitalController.js";
import { getUnverifiedHospitals } from "../controllers/hospitalController.js";
const router = express.Router();

router.get("/api/checkAuth", checkAuth);
router.get("/api/hospitalcheckAuth", hospitalcheckAuth);
router.get("/hospitalData", hospitalData);

router.post("/userRegister", userRegister);
router.post("/userLogin", userLogin);
router.get("/UserData", UserData);
router.put("/UpdateUser", UpdateUser);
router.post("/userLogout", userLogout);

router.post("/driverRegister", driverRegister);

router.post("/adminRegister", adminRegister);
router.post("/adminLogin", adminLogin);
router.get("/AdminData", AdminData);
router.put("/UpdateAdmin", UpdateAdmin);
router.post("/adminLogout", adminLogout);

router.get("/api/getUnverifiedHospitals", getUnverifiedHospitals);
router.post("/hospitalLogin", hospitalLogin);
router.post("/hospitalLogout", hospitalLogout);
router.post("/hospitalRegister", hospitalRegister);

export default router;
