import express from "express"

const router = express.Router();

import {addClient,updateClientById ,deleteClientById,getClientById,getAllClient,getAllActiveClient,getAllClientPagination,updateStatus} from "../controllers/clientController.js"
import adminAuthentication from "../middleware/adminAuthentication.js";


router.post("/addClient", adminAuthentication,addClient);
router.put("/updateClientById/:id", adminAuthentication,updateClientById);
router.delete("/deleteClientById/:id", adminAuthentication,deleteClientById);
router.get("/getClientById/:id", adminAuthentication,getClientById);
router.get("/getAllClientPagination", adminAuthentication,getAllClientPagination);
router.get("/getAllActiveClient", adminAuthentication,getAllActiveClient);
router.get("/getAllClient", adminAuthentication,getAllClient);
router.patch("/updateStatus/:id", adminAuthentication,updateStatus);

export default router;
