import Job from "../models/jobModel.js"
import Staff from "../models/staffModel.js"
import Client from "../models/clientModel.js"
import mongoose from 'mongoose';

export const addJob = async (req, res) => {

    try {

    const {
            jobName, 
            description, 
            client, 
            assignedStaff,
            startTime,
            noOfhours,
            hourRate,
            notes
        } = req.body;

            const existingJob = await Job.findOne( { jobName: jobName } );
        
            if (existingJob) {
                return  res.status(404).json({ response_code: 404, success: false,message :"Job already exists" });
            } 

            const clientExists = await Client.findById(client);
            if (!clientExists) {
                return res.status(404).json({ response_code: 404, success: false, message: "Client not found" });
            }
    
            // Check if the assigned staff exists
            const staffExists = await Staff.findById(assignedStaff);
            if (!staffExists) {
                return res.status(404).json({ response_code: 404, success: false, message: "Assigned staff not found" });
            }

            const adminId = req.userId._id;
            const newJob = new Job({
                jobName, 
                description, 
                client, 
                assignedStaff,
                startTime,
                noOfhours,
                hourRate,
                notes,
                adminId: adminId,
            });
    
            await newJob.save();
            res.status(200).json({ response_code: 200, success: true,message :"Job added successfully" ,newJob});

        }catch(error){
            res.status(400).json({ response_code: 400, success: false, error: error.message });

        }

}


export const updatedJob = async (req, res) => {
    const _id  = req.params.id;
    const { 
        jobName, 
        description, 
        client, 
        assignedStaff,
        startTime,
        noOfhours,
        hourRate,
        notes
    } = req.body;
    try {
          const updatedJob = await Job.findByIdAndUpdate(
            _id,
            { 
                jobName, 
                description, 
                client, 
                assignedStaff,
                startTime,
                noOfhours,
                hourRate,
                notes
             },
            { new: true, runValidators: true }
        );

        if (!updatedJob) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Job not found" });

        }
        res.status(200).json({ response_code: 200, success: true,message :"Job updated successfully" ,updatedJob});

    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};

export const deleteJobById = async (req, res) => {
    const _id  = req.params.id;
    try {
        const deletedJob = await Job.findByIdAndDelete(_id);

        if (!deletedJob) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Job not found" });
        }
        res.status(200).json({ response_code: 200, success: true,message :"Job deleted successfully" });

    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};

export const getJobById = async (req, res) => {
    const { id } = req.params;
    try {
        const job = await Job.findById(id).populate('assignedStaff').populate('client');

        if (!job) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Job not found" });
        }
        res.status(200).json({ response_code: 200, success: true,message :"Job fetched successfully" ,job});

    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};

export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate({
                path: 'assignedStaff',
                select: 'firstName lastName'
            })
            .populate({
                path: 'client',
                select: 'firstName lastName'  // Adjust field name as per your Client schema
            })

        if (!jobs.length) {
            return res.status(404).json({ response_code: 404, success: false, message: "Jobs not found" });
        }
        res.status(200).json({ response_code: 200, success: true, message: "Jobs fetched successfully", jobs });
    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
}



export const getAllJobPagination = async (req, res) => {
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
        const totalJob = await Job.countDocuments(query);

        // Fetch customers for the current page
        const jobs = await Job.find(query)
            .skip((parsedPage - 1) * parsedLimit)
            .sort({ createdAt: -1 }) // Sort by 'createdAt' in descending order
            .limit(parsedLimit);

        if (!jobs.length) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Jobs not found" });

        }
       const paginationInfo = {
            totalPages: Math.ceil(totalJob / parsedLimit),
            currentPage: parsedPage,
            totalResult: totalJob, // Total number of customers matching the search
            pageSize: parsedLimit,
        }   
       

        res.status(200).json({ response_code: 200, success: true,message :"Jobs fetched successfully" ,jobs:jobs ,paginationInfo});


    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};


export const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { jobStatus } = req.body;

    
    try {
        const job = await Job.findByIdAndUpdate(
            id,
            { jobStatus },
            { new: true }
        );

        if (!job) {
            return  res.status(404).json({ response_code: 404, success: false,message :"Job not found" });
        }
        res.status(200).json({ response_code: 200, success: true,message :"Job Status updated successfully" ,job});

    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
}

export const getAllCompletedJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ jobStatus: 'Completed' });
        if (!jobs.length) {
            return  res.status(404).json({ response_code: 404, success: false,message :"jobs not found" });
        }
        res.status(200).json({ response_code: 200, success: true,message :"jobs fetched successfully" ,jobs});
    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};

export const signInJob = async (req, res) => {
    const { jobId } = req.params;
    const { staffId } = req.body; // Ensure you pass the staffId in the request body

    try {
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ response_code: 404, success: false, message: 'Job not found' });
        }

        job.signInTime = new Date();
        job.assignedStaff = staffId;
        job.isSignOff = false
        await job.save();

        res.status(200).json({ response_code: 200, success: true, message: 'Staff signed in successfully', data:job });
    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, message: error.message });
    }
};


export const signOffJob = async (req, res) => {
    const { jobId } = req.params;

    try {
        const job = await Job.findById(jobId);
        console.log("job found",job);
        if (!job) {
            return res.status(404).json({ response_code: 404, success: false, message: 'Job not found' });
        }

        if(job.isSignOff == true){
            return res.status(404).json({ response_code: 404, success: false, message: 'This Job is already sign off' });
        }

        job.signOffTime = new Date();

        // Calculate the number of hours worked
        const signInTime = new Date(job.signInTime);
        const signOffTime = new Date(job.signOffTime);
        const noOfHours = (signOffTime - signInTime) / (1000 * 60 * 60); // Convert milliseconds to hours

        job.noOfhours = noOfHours;
        job.isSignOff = true;
        job.payment = noOfHours * job.hourRate;

        await job.save();

        res.status(200).json({ response_code: 200, success: true, message: 'Staff signed off successfully', data:job });
    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, message: error.message });
    }
};


export const getInvoice = async (req, res) => {
    const { jobId } = req.params;

    try {
        const job = await Job.findById(jobId)
            .populate('client', 'name')
            .populate('assignedStaff', 'firstName lastName');

        if (!job) {
            return res.status(404).json({ response_code: 404, success: false, message: 'Job not found' });
        }

        if (job.jobStatus !== 'Completed') {
            return res.status(400).json({ response_code: 400, success: false, message: 'Job is not completed yet' });
        }

        const invoice = {
            jobName: job.jobName,
            description: job.description,
            client: job.client.name,
            assignedStaff: `${job.assignedStaff.firstName} ${job.assignedStaff.lastName}`,
            startTime: job.startTime,
            signInTime: job.signInTime,
            signOffTime: job.signOffTime,
            noOfhours: job.noOfhours,
            hourRate: job.hourRate,
            payment: job.payment,
            notes: job.notes,
        };

        res.status(200).json({ response_code: 200, success: true, invoice });
    } catch (error) {
        res.status(500).json({ response_code: 500, success: false, message: error.message });
    }
};

export const getJobsByStaffId = async (req, res) => {
    const { staffId } = req.params; // Get the staffId from the request parameters
    const staffData = await Staff.find({user:staffId});
   
    const staffObjectId = staffData[0]._id;
    
    try {
        const jobs = await Job.find({ assignedStaff:staffObjectId }).populate('assignedStaff').populate('client');

        if (jobs.length === 0) {
            return res.status(404).json({ response_code: 404, success: false, message: "No jobs found for this staff member" });
        }

        res.status(200).json({ response_code: 200, success: true, message: "Jobs fetched successfully", jobs });
    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};


export const getFilteredJobs = async (req, res) => {
    const {clientId}
    
    = req.params;
    const {  jobStatus, minPayment, maxPayment, month, year } = req.query;

    try {
        
        // Build the query object
        let query = {};

        if (clientId) {
            query.client = clientId;
        }

        if (jobStatus) {
            query.jobStatus = jobStatus;
        }

     //   if (minPayment !== undefined || maxPayment !== undefined) {
        //    query.payment = {};
//    if (minPayment !== undefined) {
//         query.payment.$gte = parseFloat(minPayment);
//}
//if (maxPayment !== undefined) {
//query.payment.$lte = //parseFloat(maxPayment);
//}
//}

        if (month || year) {
            query.startTime = {};
            if (year) {
                query.startTime.$gte = new Date(year, 0, 1);
                query.startTime.$lt = new Date(year + 1, 0, 1);
            }
            if (month && year) {
                query.startTime.$gte = new Date(year, month - 1, 1);
                query.startTime.$lt = new Date(year, month, 1);
            }
        }

        const jobs = await Job.find(query)
            .populate('client')
            .populate('assignedStaff')
            .populate('adminId')
            .exec();

        res.status(200).json({
            response_code: 200,
            success: true,
            total: jobs.length,
            jobs,
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(400).json({ response_code: 400, success: false, error: error.message });
    }
};
