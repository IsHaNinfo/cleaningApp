import mongoose from "mongoose";
const Schema = mongoose.Schema;


const jobSchema = new Schema(
    {

        jobName: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        client: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
        },
        assignedStaff: {
            type: Schema.Types.ObjectId,
            ref: 'Staff',
            required: true,
        },
        startTime: {
            type: Date,
            required: false,
        },
        signInTime: {
            type: Date,
            required: false,
        },
        signOffTime: {
            type: Date,
            required: false,
        },
        isSignOff: {
            type: Boolean,
            default:false,
            required: false,
        },
        noOfhours: {
            type: Number,
            required: false,
        },
        hourRate: {
            type: Number,
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
        payment: {
            type: Number,
            required: false,
        },
        paymentStatus:{
            type: String,
            enum: ['Pending', 'Done'],
            default: 'Pending',
            required: true,
        },
        jobStatus:{
            type: String,
            enum: ['InProgress', 'Completed','Cancelled'],
            default: 'InProgress',
            required: true,
        },
     
    },
    {
        timestamps: true
    }
)

const Job = mongoose.model('Job', jobSchema);

export default Job;