import mongoose from "mongoose";
const Schema = mongoose.Schema;

const StaffInvoiceSchema = new Schema(
    {

        invoiceTitle: {
            type: String,
            required: true,
        },
        invoiceDescription: {
            type: String,
            required: true,
        },
        sendDate: {
            type: Date,
            required: false,
        },
        staff: {
            type: Schema.Types.ObjectId,
            ref: 'Staff',
            required: true,
        },
        amount: {
            type: Number,
            required: false,
        },
        invoiceStatus:{
            type: String,
            enum: ['Pending', 'Done'],
            default: 'Pending',
            required: true,
        },
     
    },
    {
        timestamps: true
    }
)

const StaffInvoice= mongoose.model('StaffInvoice', StaffInvoiceSchema);

export default StaffInvoice;