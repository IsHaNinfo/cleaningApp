import express from "express"

const router = express.Router();

import {addInvoice,updatedInvoice ,getAllInvoices,getInvoiceById,deleteInvoiceById,updateStatus} from "../controllers/clientInvoiceController.js"
import roleAuthentication from "../middleware/roleAuthentication.js";


router.post("/addInvoice", roleAuthentication(['superAdmin', 'admin']),addInvoice);
router.put("/updatedInvoice/:id", roleAuthentication(['superAdmin', 'admin']),updatedInvoice);
router.delete("/deleteInvoiceById/:id", roleAuthentication(['superAdmin', 'admin']),deleteInvoiceById);
router.get("/getInvoiceById/:id", roleAuthentication(['superAdmin', 'admin']),getInvoiceById);
router.get("/getAllInvoices", roleAuthentication(['superAdmin', 'admin']),getAllInvoices);
router.patch("/updateStatus/:id", roleAuthentication(['superAdmin', 'admin']),updateStatus);

export default router;