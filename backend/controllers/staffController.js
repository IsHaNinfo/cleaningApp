import Staff from "../models/staffModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const createToken = (_id,role) => {
    return jwt.sign({ _id ,role}, process.env.SECRET, { expiresIn: 259200 });
};


export const addStaffMember = async (req, res) => {

    try {

    const {
            firstName, 
            lastName, 
            password,
            email, 
            address,
            phoneNumber,
            position,
            dateOfBirth,
            dateOfHire,
            empContactName,
            empPhoneNumber,
            bankAcNo,
            bankName,
            bankAcBranch,
            notes} = req.body;

            const existingStaff = await Staff.findOne( { email: email } );
        
            if (existingStaff) {
                return  res.status(404).json({ response_code: 404, success: false,message :"Staff already exists" });
            } 

            const adminId = req.adminId.id;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newStaff = new Staff({
                firstName,
                lastName, 
                password :hashedPassword,
                email, 
                address,
                phoneNumber,
                position,
                dateOfBirth,
                dateOfHire,
                empContactName,
                empPhoneNumber,
                bankAcNo,
                bankName,
                bankAcBranch,
                notes,
                adminId: adminId,
            });
    
            await newStaff.save();
            res.status(200).json({ response_code: 200, success: true,message :"Staff added successfully" ,newStaff});

        }catch(error){
            res.status(400).json({ response_code: 400, success: false, error: error.message });

        }

}


export const updateStaffById = async (req, res) => {
    const _id  = req.params.id;
    const { firstName, 
        lastName, 
        email, 
        address,
        phoneNumber,
        position,
        dateOfBirth,
        dateOfHire,
        empContactName,
        empPhoneNumber,
        bankAcNo,
        bankName,
        bankAcBranch,
        notes } = req.body;
    try {
          const updatedStaff = await Staff.findByIdAndUpdate(
            _id,
            { firstName, 
                lastName, 
                email, 
                address,
                phoneNumber,
                position,
                dateOfBirth,
                dateOfHire,
                empContactName,
                empPhoneNumber,
                bankAcNo,
                bankName,
                bankAcBranch,
                notes },
            { new: true, runValidators: true }
        );

        if (!updatedStaff) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Staff not found" });

        }
        res.status(200).json({ response_code: 200, success: true,message :"Staff updated successfully" ,updatedStaff});

    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};


export const deleteStaffById = async (req, res) => {
    const _id  = req.params.id;
    try {
        const deletedStaff = await Staff.findByIdAndDelete(_id);

        if (!deletedStaff) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Staff not found" });
        }
        res.status(200).json({ response_code: 200, success: true,message :"Staff deleted successfully" });

    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};

export const getStaffById = async (req, res) => {
    const { id } = req.params;
    try {
        const staff = await Staff.findById(id);

        if (!staff) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Staff not found" });
        }
        res.status(200).json({ response_code: 200, success: true,message :"Staff fetched successfully" ,staff});

    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};

export const getAllStaff = async (req, res) => {
    try {
        const staffs = await Staff.find();
        if (!staffs.length) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Staff not found" });
        }
        res.status(200).json({ response_code: 200, success: true,message :"Staff fetched successfully" ,staffs});
    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
}

export const getAllActiveStaff = async (req, res) => {
    try {
        const staffs = await Staff.find({ workStatus: 'active' });
        if (!staffs.length) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Staff not found" });
        }
        res.status(200).json({ response_code: 200, success: true,message :"Staff fetched successfully" ,staffs});
    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};

export const loginStaff = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw Error("Email and password are required");
        }

        const staff = await Staff.findOne({ email: email });
        if (!staff) {
            throw Error("Invalid email");
        }

        const isPasswordValid = bcrypt.compareSync(password, staff.password);
        if (!isPasswordValid) {
            throw Error("Invalid password");
        }

        const stafftoken = createToken(staff._id,staff.role);
        res.status(200).json({ response_code: 200, success: true,message  :"Staff fetched successfully",staff,stafftoken });
    } catch (error) {
        res.status(400).json({ response_code: 400, success: false,error: error.message });
    }
};


const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

const sendEmail = (email, subject, text) => {
    // Use a nodemailer or any email service to send email
    // For simplicity, here is a basic example using nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hasthiyatalentoc@gmail.com',
            pass: 'jaokcskonjeshdvl'
        }
    });

    const mailOptions = {
        from: 'hasthiyatalentoc@gmail.com',
        to: email,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            throw Error("Email is required");
        }
        if (!validator.isEmail(email)) {
            throw Error("Email not valid");
        }

        const user = await Staff.findOne({ email: email });
        if (!user) {
            throw Error("User not found");
        }

        const otp = generateOTP();
        const otpExpiry = Date.now() + 3600000; // OTP valid for 1 hour

        user.resetPasswordOTP = otp;
        user.resetPasswordOTPExpiry = otpExpiry;

        await user.save();

         sendEmail(email, 'Password Reset OTP', `Your OTP is ${otp}. It is valid for 1 hour.`);

        res.status(200).json({ response_code: 200, success: true, message: 'OTP sent successfully!' });

    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};
export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        if (!email || !otp) {
            throw Error("Email and OTP are required");
        }

        const user = await Staff.findOne({ email: email });
        if (!user) {
            throw Error("User not found");
        }

        if (user.resetPasswordOTP !== otp) {
            throw Error("Invalid OTP");
        }

        if (user.resetPasswordOTPExpiry < Date.now()) {
            throw Error("OTP expired");
        }

        res.status(200).json({ response_code: 200, success: true, message: 'OTP verified successfully!' });

    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        if (!email || !otp || !newPassword) {
            throw Error("Email, OTP, and new password are required");
        }

        if (!validator.isLength(newPassword, { min: 8 })) {
            throw new Error("Password must be at least 8 characters long");
        }
        if (!validator.isStrongPassword(newPassword)) {
            throw Error("Password not strong enough");
        }

        const user = await PassangerModel.findOne({ email: email });
        if (!user) {
            throw Error("User not found");
        }

        if (user.resetPasswordOTP !== otp) {
            throw Error("Invalid OTP");
        }

        if (user.resetPasswordOTPExpiry < Date.now()) {
            throw Error("OTP expired");
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 12);
        user.password = hashedPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpiry = undefined;

        await user.save();

        res.status(200).json({ response_code: 200, success: true, message: 'Password reset successfully!' });

    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};
 export const getAllStaffsPagination = async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;

    // Parse limit and page to ensure they are numbers
    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedPage = parseInt(page, 10) || 1;

    // Build the search query
    const query = {
        $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { address: { $regex: search, $options: 'i' } },
            // Add more fields if necessary
        ]
    };

    try {
        const totalStaff = await Staff.countDocuments(query);

        // Fetch customers for the current page
        const staffs = await Staff.find(query)
            .skip((parsedPage - 1) * parsedLimit)
            .sort({ createdAt: -1 }) // Sort by 'createdAt' in descending order
            .limit(parsedLimit);

        if (!staffs.length) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Staff not found" });

        }
       const paginationInfo = {
            totalPages: Math.ceil(totalStaff / parsedLimit),
            currentPage: parsedPage,
            totalResult: totalStaff, // Total number of customers matching the search
            pageSize: parsedLimit,
        }   
       

        res.status(200).json({ response_code: 200, success: true,message :"Staff fetched successfully" ,staffs:staffs ,paginationInfo});


    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};


export const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { workStatus } = req.body;

    
    try {
        const staff = await Staff.findByIdAndUpdate(
            id,
            { workStatus },
            { new: true }
        );

        if (!staff) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Staff not found" });
        }
        res.status(200).json({ response_code: 200, success: true,message :"Staff updated successfully" ,staff});

    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
}