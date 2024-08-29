import express from "express"

const router = express.Router();

import {addStaffInvoice,updatedInvoice ,getAllInvoices,getInvoiceById,deleteInvoiceById,updateStatus} from "../controllers/staffInvoiceController.js"
import roleAuthentication from "../middleware/roleAuthentication.js";


router.post("/addStaffInvoice", roleAuthentication(['superAdmin', 'admin']),addStaffInvoice);
router.put("/updatedStaffInvoice/:id", roleAuthentication(['superAdmin', 'admin']),updatedInvoice);
router.delete("/deleteStaffInvoiceById/:id", roleAuthentication(['superAdmin', 'admin']),deleteInvoiceById);
router.get("/getStaffInvoiceById/:id", roleAuthentication(['superAdmin', 'admin']),getInvoiceById);
router.get("/getAllStaffInvoices", roleAuthentication(['superAdmin', 'admin']),getAllInvoices);
router.patch("/updateStatus/:id", roleAuthentication(['superAdmin', 'admin']),updateStatus);

export default router;