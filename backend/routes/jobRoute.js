import express from "express"

const router = express.Router();
import {addJob,updatedJob ,deleteJobById,getJobById,getAllJobs,getAllJobPagination,updateStatus} from "../controllers/jobController.js"
import adminAuthentication from "../middleware/adminAuthentication.js";


router.post("/addJob",adminAuthentication, addJob);
router.put("/updatedJob/:id",adminAuthentication,updatedJob);
router.delete("/deleteJobById/:id",deleteJobById);
router.get("/getJobById/:id",getJobById);
router.get("/getAllJobPagination",getAllJobPagination);
router.get("/getAllJobs",getAllJobs);
router.patch("/updateStatus/:id",updateStatus);

export default router;