import StaffInvoice from "../models/staffInvoiceModel.js";
import Staff from "../models/staffInvoiceModel.js"

export const addStaffInvoice = async ( req,res) =>{
    try{
        const {
            invoiceTitle, 
            invoiceDescription, 
            sendDate, 
            staff,
            amount,
        } = req.body;

          
    
           

            const newInvoice = new StaffInvoice({
            invoiceTitle, 
            invoiceDescription, 
            sendDate, 
            staff,
            amount,
            });
    
            await newInvoice.save();
            res.status(200).json({ response_code: 200, success: true,message :"Invoice added successfully" ,newInvoice});

    }catch(error){
        res.status(400).json({ response_code: 400, success: false, error: error.message });

    }
}

export const updatedInvoice = async (req, res) => {
    const _id  = req.params.id;
    const { 
            invoiceTitle, 
            invoiceDescription, 
            sendDate, 
            client,
            amount,
    } = req.body;
    try {
          const updatedInvoice = await StaffInvoice.findByIdAndUpdate(
            _id,
            { 
                invoiceTitle, 
                invoiceDescription, 
                sendDate, 
                client,
                amount,
             },
            { new: true, runValidators: true }
        );

        if (!updatedInvoice) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Invoice not found" });

        }
        res.status(200).json({ response_code: 200, success: true,message :"Invoice updated successfully" ,updatedInvoice});

    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};


export const getInvoiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const invoice = await StaffInvoice.findById(id).populate('staff');

        if (!invoice) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Invoice not found" });
        }
        res.status(200).json({ response_code: 200, success: true,message :"Invoice fetched successfully" ,invoice});

    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};
export const getAllInvoices = async (req, res) => {

    const {startDate, endDate} = req.query;

    let filter = {};
    if (startDate && endDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0); 

        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        filter.sendDate = { $gte: start, $lte: end };
    }

    try {
        const invoices = await StaffInvoice.find(filter)
            .populate({
                path: 'staff',
                select: 'firstName lastName'  // Adjust field name as per your Client schema
            })

        if (!invoices.length) {
            return res.status(404).json({ response_code: 404, success: false, message: "Invoices not found" });
        }
        res.status(200).json({ response_code: 200, success: true, message: "Invoices fetched successfully", invoices });
    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
}

export const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { invoiceStatus } = req.body;

    
    try {
        const job = await StaffInvoice.findByIdAndUpdate(
            id,
            { invoiceStatus },
            { new: true }
        );

        if (!job) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Invoice not found" });
        }
        res.status(200).json({ response_code: 200, success: true,message :"Invoice Status updated successfully" ,job});

    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
}

export const deleteInvoiceById = async (req, res) => {
    const _id  = req.params.id;
    try {
        const deletedInvoice = await StaffInvoice.findByIdAndDelete(_id);

        if (!deletedInvoice) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Invoice not found" });
        }
        res.status(200).json({ response_code: 200, success: true,message :"Invoice deleted successfully" });

    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};