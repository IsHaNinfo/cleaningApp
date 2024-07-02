import Admin from "../models/adminModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const createToken = (_id,role) => {
    return jwt.sign({ _id,role }, process.env.SECRET, { expiresIn: 259200 });
};
export const registerAdmin = async (req, res) => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PW;

        if (!adminEmail || !adminPassword) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Admin email or password is not set in environment variables" });

        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: adminEmail });
        if (existingAdmin) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Admin already exists" });

        }


        // Hash the password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Create a new admin
        const newAdmin = new Admin({
            email: adminEmail,
            password: hashedPassword,
        });

        await newAdmin.save();

        res.status(200).json({ response_code: 200, success: true,message :"Admin registered successfully" });

    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};


export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Email and password are required" });

        
        }

        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return  res.status(404).json({ response_code: 404, success: false,message :"'Invalid email" });

        }

        const isPasswordValid = bcrypt.compareSync(password, admin.password);
        if (!isPasswordValid) {
            return  res.status(404).json({ response_code: 404, success: false,message :"'Invalid password" });

        }

        const token = createToken(admin._id,admin.role);
        res.status(200).json({ response_code: 200, success: true, message: 'Admin  login successfully!' });


    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};
export const updateAdminPassword = async (req, res) => {
    const {  currentPassword, newPassword } = req.body;
    const { id } = req.params;

    try {
        if (  !currentPassword || !newPassword) {
            return  res.status(404).json({ response_code: 404, success: false,message :"current password, and new password are required" });

        }

        const admin = await Admin.findById(id);
        if (!admin) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Admin not found" });

        }

        const isPasswordValid = bcrypt.compareSync(currentPassword, admin.password);
        if (!isPasswordValid) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Invalid current password" });

        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedNewPassword;

        await admin.save();
        res.status(200).json({ response_code: 200, success: true, message: 'Password updated successfully!' });

    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};
