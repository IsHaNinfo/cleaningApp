import express from "express"

const router = express.Router();
import {addStaffMember,loginStaff,updateStaffById ,deleteStaffById,getStaffById,getAllStaff,getAllActiveStaff,getAllStaffsPagination,updateStatus} from "../controllers/staffController.js"
import adminAuthentication from "../middleware/adminAuthentication.js";


router.post("/addStaff", adminAuthentication,addStaffMember);
router.put("/updateStaffById/:id", adminAuthentication,updateStaffById);
router.delete("/deleteStaffById/:id", adminAuthentication,deleteStaffById);
router.get("/getStaffById/:id", adminAuthentication,getStaffById);
router.get("/getAllStaffsPagination", adminAuthentication,getAllStaffsPagination);
router.get("/getAllActiveStaff", adminAuthentication,getAllActiveStaff);
router.get("/getAllStaff", adminAuthentication,getAllStaff);
router.patch("/updateStatus/:id", adminAuthentication,updateStatus);

router.post("/loginStaff",loginStaff);

export default router;