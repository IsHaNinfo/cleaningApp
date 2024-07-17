import User from "../models/userModel.js"
import Admin from "../models/adminModel.js"
import SuperAdmin from "../models/superAdminModel.js"
import Staff from "../models/staffModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import validator from "validator"

import sendEmail from "../EmailSend/sendEmail.js"
const createToken = (_id,role) => {
    return jwt.sign({ _id,role }, process.env.SECRET, { expiresIn: 259200 });
};
export const addUser = async (req, res) => {
    const { email, password, userName, role, staffDetails,adminDetails } = req.body;

    try {
        if (!email || !password || !role || !userName) {
            return res.status(404).json({ response_code: 404, success: false, message: "All fields must be filled" });
        }
        if (!validator.isEmail(email)) {
            return res.status(404).json({ response_code: 404, success: false, message: "Email not valid" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            userName,
            password: hashedPassword,
            email,
            role
        });

        await user.save();

        if (role === "admin") {
            const admin = new Admin({ user: user._id,
                firstName:adminDetails.firstName,
                lastName:adminDetails.lastName,
                position:adminDetails.position });
            await admin.save();
            user.adminDetails = admin._id;
        } else if (role === "staff") {
            if (req.userRole !== "superAdmin" && req.userRole !== "admin") {
                return res.status(404).json({ error: "Access denied" });
            }
            const htmlMessage = `
            <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 5px; padding: 20px;">
              <img src="https://intellipaat.com/blog/wp-content/uploads/2016/06/Salesforce-Automation-System_BIG.jpg" alt="SAS" style="display: block; margin: 0 auto; max-width: 100%; height: 300px;">
              <div style="text-align: center; margin-top: 20px;">
                <h2 style="color: #333; font-size: 24px;">Welcome to Sales Automation System</h2>
                <p style="font-size: 16px;">Thank you for joining us, ${userName}!</p>
                <p style="font-size: 16px;">Here are your account details:</p>
                <ul style="list-style: none; padding: 0;">
                  <li style="font-size: 16px; margin-bottom: 10px;"><strong>Email:</strong> ${email}</li>
                  <li style="font-size: 16px; margin-bottom: 10px;"><strong>Password:</strong> ${password}</li>
                </ul>
              </div>
              <p style="text-align: center; font-size: 14px; color: #666; margin-top: 20px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
          `;

            // await sendEmail(email, htmlMessage);
            const staff = new Staff({
                user: user._id,
                firstName: staffDetails.firstName,
                lastName: staffDetails.lastName,
                address: staffDetails.address,
                phoneNumber: staffDetails.phoneNumber,
                position: staffDetails.position,
                dateOfBirth: staffDetails.dateOfBirth,
                dateOfHire: staffDetails.dateOfHire,
                empContactName: staffDetails.empContactName,
                empPhoneNumber: staffDetails.empPhoneNumber,
                bankAcNo: staffDetails.bankAcNo,
                bankName: staffDetails.bankName,
                bankAcBranch: staffDetails.bankAcBranch,
                notes: staffDetails.notes,
                workStatus: staffDetails.workStatus
            });
            await staff.save();
            user.staffDetails = staff._id;
        }  else {
            return res.status(404).json({ error: "This role not found" });
        }

        await user.save();

        res.status(200).json({ response_code: 200, success: true, message: 'User registered successfully!' });
    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};


export const addsuperAdmin = async (req, res) => {

    const { email, password, userName,role } = req.body;
    try {
        if (!userName || !email || !password || !role) {
            return  res.status(404).json({ response_code: 404, success: false,message :"All fields must be filled" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            userName,
            password :hashedPassword,
            email,
            role
        });

        if (role === "superAdmin") {
            const superadmin = new SuperAdmin({ user: user._id });
            await superadmin.save();

        } else {
            return res.status(404).json({ error: "This role not found" });
        }

        await user.save();
        res.status(200).json({ response_code: 200, success: true, message: 'SuperAdmin registered successfully!' });
    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(404).json({ error: "Email and password are required" });

        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ error: "Invalid email" });

        }
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(404).json({ error: "Invalid password" });

        }

        const token = createToken(user._id,user.role);
        res.status(200).json({ response_code: 200, success: true, message: 'user  login successfully!',token});


    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};


export const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id)
            .populate('adminDetails')
            .populate('staffDetails')
            .populate('superAdminDetails')

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userDetails = {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            ...(user.staffDetails && { staffDetails: user.staffDetails }),
            ...(user.adminDetails && { adminDetails: user.adminDetails }),
            ...(user.superAdminDetails && { superAdminDetails: user.superAdminDetails })
        };
        res.status(200).json({ response_code: 200, success: true, message: 'User fetched successfully!',userDetails});

    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};


export const updateUser = async (req, res) => {
    const { id } = req.params;
  const { userName, email} = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { userName, email},
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      response_code: 200,
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

export const getAllUsers = async (req, res) => {

    try {
        const user = await User.find().populate('adminDetails superAdminDetails staffDetails')
        console.log(user);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ response_code: 200, success: true, message: 'User fetched successfully!',user});
    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};


export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });

        }

        if (user.role === 'admin') {
            await Admin.deleteOne({ user: id });
        } else if (user.role === 'staff') {
            await Staff.deleteOne({ user: id });
        } 

        await User.deleteOne({ _id: id });
        res.status(200).json({ response_code: 200, success: true, message: 'User deleted successfully!'});

    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};

export const updateUserPassword = async (req, res) => {
    const {  currentPassword, newPassword } = req.body;
    const { id } = req.params;

    try {

        if (  !currentPassword || !newPassword) {
            return res.status(404).json({ error: "current password, and new password are required" });

        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(404).json({ error: "Invalid current password" });

        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;

        await user.save();
        res.status(200).json({ response_code: 200, success: true, message: 'Password updated successfully'});

    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};


export const updateStaff = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, address, phoneNumber, position, dateOfBirth, dateOfHire, empContactName, empPhoneNumber, bankAcNo, bankName, bankAcBranch, notes, workStatus, email, userName } = req.body;

    try {
        // Find the staff member by ID
        const staff = await Staff.findById(id).populate('user');
        if (!staff) {
            return res.status(404).json({ response_code: 404, success: false, message: "Staff not found" });
        }

        // Update staff details
        staff.firstName = firstName || staff.firstName;
        staff.lastName = lastName || staff.lastName;
        staff.address = address || staff.address;
        staff.phoneNumber = phoneNumber || staff.phoneNumber;
        staff.position = position || staff.position;
        staff.dateOfBirth = dateOfBirth || staff.dateOfBirth;
        staff.dateOfHire = dateOfHire || staff.dateOfHire;
        staff.empContactName = empContactName || staff.empContactName;
        staff.empPhoneNumber = empPhoneNumber || staff.empPhoneNumber;
        staff.bankAcNo = bankAcNo || staff.bankAcNo;
        staff.bankName = bankName || staff.bankName;
        staff.bankAcBranch = bankAcBranch || staff.bankAcBranch;
        staff.notes = notes || staff.notes;
        staff.workStatus = workStatus || staff.workStatus;

        // Save the updated staff details
        await staff.save();

        // Find and update the user details
        const user = await User.findById(staff.user._id);
        if (!user) {
            return res.status(404).json({ response_code: 404, success: false, message: "User not found" });
        }

        user.userName = userName || user.userName;
        user.email = email || user.email;
        user.status = workStatus || user.status;

        // Save the updated user details
        await user.save();

        res.status(200).json({ response_code: 200, success: true, message: 'Staff and user details updated successfully!' });
    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};

export const updateAdmin = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName,position,userName,email} = req.body;
    console.log(req.body,id);

    try {
        // Find the staff member by ID
        const admin = await Admin.findById(id).populate('user');
        if (!admin) {
            return res.status(404).json({ response_code: 404, success: false, message: "admin not found" });
        }

        // Update staff details
        admin.firstName = firstName || admin.firstName;
        admin.lastName = lastName || admin.lastName;
        admin.position = position || admin.position;
        
        // Save the updated staff details
        await admin.save();

        // Find and update the user details
        const user = await User.findById(admin.user);
        if (!user) {
            return res.status(404).json({ response_code: 404, success: false, message: "User not found" });
        }

        user.userName = userName || user.userName;
        user.email = email || user.email;

        // Save the updated user details
        await user.save();

        res.status(200).json({ response_code: 200, success: true, message: 'Staff and user details updated successfully!' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};

