import express from "express"

const router = express.Router();

import {addClient,updateClientById ,deleteClientById,getClientById,getAllClient,getAllActiveClient,getAllClientPagination,updateStatus} from "../controllers/clientController.js"
import roleAuthentication from "../middleware/roleAuthentication.js";


router.post("/addClient", roleAuthentication(['superAdmin', 'admin']),addClient);
router.put("/updateClientById/:id", roleAuthentication(['superAdmin', 'admin']),updateClientById);
router.delete("/deleteClientById/:id", roleAuthentication(['superAdmin', 'admin']),deleteClientById);
router.get("/getClientById/:id", roleAuthentication(['superAdmin', 'admin']),getClientById);
router.get("/getAllClientPagination", roleAuthentication(['superAdmin', 'admin']),getAllClientPagination);
router.get("/getAllActiveClient", roleAuthentication(['superAdmin', 'admin']),getAllActiveClient);
router.get("/getAllClient", roleAuthentication(['superAdmin', 'admin']),getAllClient);
router.patch("/updateStatus/:id", roleAuthentication(['superAdmin', 'admin']),updateStatus);

export default router;
