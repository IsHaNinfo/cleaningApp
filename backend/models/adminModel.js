import mongoose from "mongoose";
const Schema = mongoose.Schema;

const adminSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true
    }
)

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;