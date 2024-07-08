import express from "express"

const router = express.Router();
import {addJob,updatedJob ,getInvoice,signInJob,signOffJob,deleteJobById,getJobById,getAllJobs,getAllJobPagination,updateStatus,getJobsByStaffId} from "../controllers/jobController.js"
import roleAuthentication from "../middleware/roleAuthentication.js";


router.post("/addJob",roleAuthentication(['superAdmin', 'admin']), addJob);
router.put("/updatedJob/:id",roleAuthentication(['superAdmin', 'admin']),updatedJob);
router.delete("/deleteJobById/:id",deleteJobById);
router.get("/getJobById/:id",getJobById);
router.get("/getAllJobPagination",getAllJobPagination);
router.get("/getAllJobs",getAllJobs);
router.patch("/updateStatus/:id",updateStatus);

router.put("/signInJob/:jobId", signInJob);
router.put("/signOffJob/:jobId", signOffJob);
router.get("/getInvoice/:jobId", getInvoice);
router.get("/getJobsbyStaff/:staffId", getJobsByStaffId);


export default router;