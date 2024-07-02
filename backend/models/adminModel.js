import mongoose from "mongoose";
const Schema = mongoose.Schema;

const adminSchema = new Schema(
    {
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        role:{
            type: String,
            default: 'admin',
            required: true,
        },
    },
    {
        timestamps: true
    }
)

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;