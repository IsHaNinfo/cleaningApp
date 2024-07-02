import mongoose from "mongoose";
const Schema = mongoose.Schema;

const staffSchema = new Schema(
    {

        firstName: {
            type: String,
            required: true,
        },
        lastName: {
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
        address: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        position: {
            type: String,
            required: false,
        },
        dateOfBirth: {
            type: Date,
            required: false,
        },
        dateOfHire: {
            type: Date,
            required: false,
        },
        empContactName: {
            type: String,
            required: false,
        },
        empPhoneNumber: {
            type: String,
            required: false,
        },
        bankAcNo: {
            type: Number,
            required: false,
        },
        bankName: {
            type: String,
            required: false,
        },
        bankAcBranch: {
            type: String,
            required: false,
        },
        bankAcBranch: {
            type: String,
            required: false,
        },

        adminId: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
            required: true,
        },
        notes: {
            type: String,
            required: false,
        },
        workStatus:{
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
            required: true,
        },
        role:{
            type: String,
            default: 'staff',
            required: true,
        },
    },
    {
        timestamps: true
    }
)

const Staff = mongoose.model('Staff', staffSchema);

export default Staff;