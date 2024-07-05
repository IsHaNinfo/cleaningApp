import express from "express"

const router = express.Router();
import {addStaffMember,loginStaff,updateStaffById ,deleteStaffById,getStaffById,getAllStaff,getAllActiveStaff,getAllStaffsPagination,updateStatus} from "../controllers/staffController.js"
import roleAuthentication from "../middleware/roleAuthentication.js";


router.post("/addStaff", roleAuthentication(['superAdmin', 'admin']),addStaffMember);
router.put("/updateStaffById/:id", roleAuthentication(['superAdmin', 'admin']),updateStaffById);
router.delete("/deleteStaffById/:id", roleAuthentication(['superAdmin', 'admin']),deleteStaffById);
router.get("/getStaffById/:id", roleAuthentication(['superAdmin', 'admin']),getStaffById);
router.get("/getAllStaffsPagination", roleAuthentication(['superAdmin', 'admin']),getAllStaffsPagination);
router.get("/getAllActiveStaff", roleAuthentication(['superAdmin', 'admin']),getAllActiveStaff);
router.get("/getAllStaff", roleAuthentication(['superAdmin', 'admin']),getAllStaff);
router.patch("/updateStatus/:id", roleAuthentication(['superAdmin', 'admin']),updateStatus);

router.post("/loginStaff",loginStaff);

export default router;