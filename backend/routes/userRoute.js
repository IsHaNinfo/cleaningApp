import express from "express"
const router = express.Router();
import roleAuthentication from "../middleware/roleAuthentication.js";

import {addUser,addsuperAdmin,updateStaff,updateUserPassword,deleteUser,getAllUsers,getUser,loginUser} from "../controllers/userController.js"

router.post("/addUser", roleAuthentication(['superAdmin', 'admin']),addUser);
router.post("/addsuperAdmin",addsuperAdmin);
router.post("/loginUser",loginUser);
router.get('/getUser/:id', getUser);
router.get('/getAllUsers', getAllUsers);
router.delete('/deleteUser/:id', deleteUser);
router.put("/updateUserPassword/:id",updateUserPassword)
router.put("/updateStaff/:id",updateStaff)

export default router;