import express from "express"

const router = express.Router();
import {registerAdmin,loginAdmin ,updateAdminPassword} from "../controllers/adminController.js"
import adminAuthentication from "../middleware/adminAuthentication.js";
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.put("/updateAdminPassword/:id", updateAdminPassword);

export default router;