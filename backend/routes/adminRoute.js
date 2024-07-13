import express from "express"
import roleAuthentication from "../middleware/roleAuthentication.js";

const router = express.Router();
import {registerAdmin,loginAdmin ,updateAdminPassword,getAllAdmins,updateStatus} from "../controllers/adminController.js"
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.put("/updateAdminPassword/:id", updateAdminPassword);
router.get("/getAllAdmins",getAllAdmins);
router.patch("/updateStatus/:id", roleAuthentication(['superAdmin']),updateStatus);

export default router;