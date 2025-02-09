import express from "express";
import {
  adminLogin,
  adminLogout,
  adminRegister,
  AdminData,
  UpdateAdmin,
  revenuechart,
  bookingdetails,
  Adminpassword,
} from "../controllers/adminController.js";
import { checkAuth } from "../middleware/checkAuth.js";
const router = express.Router();

router.post("/adminRegister", adminRegister);
router.post("/adminLogin", adminLogin);
router.post("/change-password", Adminpassword);
router.post("/adminLogout", adminLogout);

router.get("/AdminData", checkAuth, AdminData);
router.put("/UpdateAdmin", checkAuth, UpdateAdmin);

router.post("/admin/revenuechart", checkAuth, revenuechart);
router.post("/bookingdetails", checkAuth, bookingdetails);
export default router;
