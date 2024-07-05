import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            enum: ['admin', 'staff','superAdmin'],
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            required: true,
            default: 'active'
        },
        adminDetails: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
        },
        staffDetails: {
            type: Schema.Types.ObjectId,
            ref: 'Staff',
        },
        superAdminDetails: {
            type: Schema.Types.ObjectId,
            ref: 'SuperAdmin',
        },
       
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);
export default User;