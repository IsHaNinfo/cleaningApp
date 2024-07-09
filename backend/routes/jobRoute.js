import express from "express"

const router = express.Router();
import {addJob,updatedJob ,getInvoice,getJobsByStaffId,signInJob,signOffJob,getAllCompletedJobs,deleteJobById,getJobById,getAllJobs,getAllJobPagination,updateStatus} from "../controllers/jobController.js"
import roleAuthentication from "../middleware/roleAuthentication.js";


router.post("/addJob",roleAuthentication(['superAdmin', 'admin']), addJob);
router.put("/updatedJob/:id",roleAuthentication(['superAdmin', 'admin']),updatedJob);
router.delete("/deleteJobById/:id",deleteJobById);
router.get("/getJobById/:id",getJobById);
router.get("/getAllJobPagination",getAllJobPagination);
router.get("/getAllJobs",getAllJobs);
router.get("/getAllCompletedJobs",getAllCompletedJobs);

router.patch("/updateStatus/:id",updateStatus);

router.put("/signInJob/:jobId", signInJob);
router.put("/signOffJob/:jobId", signOffJob);
router.get("/getInvoice/:jobId", getInvoice);
router.get("/getJobsbyStaff/:staffId", getJobsByStaffId);


export default router;