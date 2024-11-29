import express from "express";
import {
  adminLogin,
  adminLogout,
  adminRegister,
  AdminData,
} from "../controllers/adminController.js";
import { checkAuth } from "../middleware/checkAuth.js";
const router = express.Router();

router.post("/adminRegister", adminRegister);
router.post("/adminLogin", adminLogin);
router.post("/adminLogout", adminLogout);

router.get("/AdminData", checkAuth, AdminData);
// router.put("/UpdateAdmin", checkAuth, UpdateAdmin);

export default router;
