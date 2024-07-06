import Client from "../models/clientModel.js"


export const addClient = async (req, res) => {

    try {

    const {
            firstName, 
            lastName, 
            email, 
            address,
            phoneNumber,
            contactName,
            contactPhoneNumber,
            contactEmail,
            accountManager,
            notes
        } = req.body;

            const existingClient = await Client.findOne( { email: email } );
        
            if (existingClient) {
                return  res.status(404).json({ response_code: 404, success: false,message :"Client already exists" });
            } 

            const adminId = req.userId._id;
            const newClient = new Client({
                firstName, 
                lastName, 
                email, 
                address,
                phoneNumber,
                contactName,
                contactPhoneNumber,
                contactEmail,
                accountManager,
                notes,
                adminId: adminId,
            });
    
            await newClient.save();
            res.status(200).json({ response_code: 200, success: true,message :"Client added successfully" ,newClient});

        }catch(error){
            res.status(400).json({ response_code: 400, success: false, error: error.message });

        }

}

export const updateClientById = async (req, res) => {
    const _id  = req.params.id;
    const { 
        firstName, 
        lastName, 
        email, 
        address,
        phoneNumber,
        contactName,
        contactPhoneNumber,
        contactEmail,
        accountManager,
        notes
    } = req.body;
    try {
          const updatedClient = await Client.findByIdAndUpdate(
            _id,
            { 
                firstName, 
                lastName, 
                email, 
                address,
                phoneNumber,
                contactName,
                contactPhoneNumber,
                contactEmail,
                accountManager,
                notes
             },
            { new: true, runValidators: true }
        );

        if (!updatedClient) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Staff not found" });

        }
        res.status(200).json({ response_code: 200, success: true,message :"Staff updated successfully" ,updatedClient});

    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};

export const deleteClientById = async (req, res) => {
    const _id  = req.params.id;
    try {
        const deletedClient = await Client.findByIdAndDelete(_id);

        if (!deletedClient) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Client not found" });
        }
        res.status(200).json({ response_code: 200, success: true,message :"Client deleted successfully" });

    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};

export const getClientById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await Client.findById(id);

        if (!client) {
            return  res.status(404).json({ response_code: 404, success: false,message :"client not found" });
        }
        res.status(200).json({ response_code: 200, success: true,message :"client fetched successfully" ,client});

    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};

export const getAllClient = async (req, res) => {
    try {
        const clients = await Client.find();
        if (!clients.length) {
            return  res.status(404).json({ response_code: 404, success: false,message :"clients not found" });
        }
        res.status(200).json({ response_code: 200, success: true,message :"clients fetched successfully" ,clients});
    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
}
export const getAllActiveClient = async (req, res) => {
    try {
        const clients = await Client.find({ clientStatus: 'active' });
        if (!clients.length) {
            return  res.status(404).json({ response_code: 404, success: false,message :"clients not found" });
        }
        res.status(200).json({ response_code: 200, success: true,message :"clients fetched successfully" ,clients});
    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};


export const getAllClientPagination = async (req, res) => {
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
        const totalClient = await Client.countDocuments(query);

        // Fetch customers for the current page
        const clients = await Client.find(query)
            .skip((parsedPage - 1) * parsedLimit)
            .sort({ createdAt: -1 }) // Sort by 'createdAt' in descending order
            .limit(parsedLimit);

        if (!clients.length) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Client not found" });

        }
       const paginationInfo = {
            totalPages: Math.ceil(totalClient / parsedLimit),
            currentPage: parsedPage,
            totalResult: totalClient, // Total number of customers matching the search
            pageSize: parsedLimit,
        }   
       

        res.status(200).json({ response_code: 200, success: true,message :"clients fetched successfully" ,clients:clients ,paginationInfo});


    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};

export const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { clientStatus } = req.body;

    
    try {
        const staff = await Client.findByIdAndUpdate(
            id,
            { clientStatus },
            { new: true }
        );

        if (!staff) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Client not found" });
        }
        res.status(200).json({ response_code: 200, success: true,message :"Client updated successfully" ,staff});

    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
}