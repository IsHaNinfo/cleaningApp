import Job from "../models/jobModel.js"

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
        await job.save();

        res.status(200).json({ response_code: 200, success: true, message: 'Staff signed in successfully', job });
    } catch (error) {
        res.status(400).json({ response_code: 400, success: false, message: error.message });
    }
};


export const signOffJob = async (req, res) => {
    const { jobId } = req.params;

    try {
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ response_code: 404, success: false, message: 'Job not found' });
        }

        if(!job.isSignOff == true){
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

        res.status(200).json({ response_code: 200, success: true, message: 'Staff signed off successfully', job });
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