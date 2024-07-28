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
        orgNoOfhours: {
            type: Number,
            required: false,
        },
        orgHourRate: {
            type: Number,
            required: false,
        },
        orgTotal: {
            type: Number,
            required: false,
        },
        estNoOfhours: {
            type: Number,
            required: false,
        },
        staffHourRate: {
            type: Number,
            required: false,
        },
        staffPayTotal: {
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
        jobDate: {
            type: Date,
            required: false,
        },
     
    },
    {
        timestamps: true
    }
)

const Job = mongoose.model('Job', jobSchema);

export default Job;