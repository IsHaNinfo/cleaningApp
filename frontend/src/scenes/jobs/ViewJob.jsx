import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import axios from "axios";
import { environment } from "../../environment";

function ViewJob() {
  const { id } = useParams();
  const [jobDetails, setJobDetails] = useState({
    jobName: "",
    description: "",
    client: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
    assignedStaff: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
    orgNoOfhours: "",
    orgHourRate: "",
    orgTotal: "",
    staffPayTotal: "",
    estNoOfhours: "",
    staffHourRate: "",
    jobStatus: "",
    notes: "",
  });

  const fieldNames = {
    jobName: "Job Name",
    description: "Description",
    orgNoOfhours: "Original Number of Hours",
    orgHourRate: "Original Hour Rate",
    orgTotal: "Original Total",
    staffPayTotal: "Staff Pay Total",
    estNoOfhours: "Estimated Number of Hours",
    staffHourRate: "Staff Hour Rate",
    jobStatus: "Job Status",
    notes: "Notes",
    client: "Client",
    assignedStaff: "Assigned Staff"
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(environment.apiUrl + `/job/getJobById/${id}`);
      const responseData = response.data;
      console.log(responseData)
      if (responseData.success) {
        const { job, message } = responseData;
        const { jobName, description, client, assignedStaff, orgNoOfhours, orgHourRate, estNoOfhours, staffHourRate, orgTotal, staffPayTotal, jobStatus, notes } = job;
        const formattedClient = {
          firstName: client.firstName,
          lastName: client.lastName,
          phoneNumber: client.phoneNumber,
        };
        const formattedAssignedStaff = {
          firstName: assignedStaff.firstName,
          lastName: assignedStaff.lastName,
          phoneNumber: assignedStaff.phoneNumber,
        };
        setJobDetails({
          jobName,
          description,
          client: formattedClient,
          assignedStaff: formattedAssignedStaff,
          orgNoOfhours,
          orgHourRate,
          estNoOfhours,
          staffHourRate,
          orgTotal,
          staffPayTotal,
          jobStatus,
          notes,
        });
      } else {
        console.error("Failed to fetch job details:");
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  return (
    <Box m="20px" height="70vh" overflow="auto" paddingRight="20px">
      <Header title={`View Job ID: ${id}`} subtitle="" />
      <Box ml={"40px"}>
        <Grid container spacing={2}>
          {Object.entries(jobDetails)
            .filter(([field]) => field !== "client" && field !== "assignedStaff") // Filter out nested objects
            .map(([field, value]) => (
              <React.Fragment key={field}>
                <Grid item xs={1.8}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    {fieldNames[field]}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    :
                  </Typography>
                </Grid>
                <Grid item xs={9.2}>
                  <Typography>{value}</Typography>
                </Grid>
              </React.Fragment>
            ))}
          {/* Client Details */}
          <Grid item xs={1.8}>
            <Typography variant="h5" component="span" fontWeight="bold">
              {fieldNames.client}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="h5" component="span" fontWeight="bold">
              :
            </Typography>
          </Grid>
          <Grid item xs={9.2}>
            <Typography>{`${jobDetails.client.firstName} ${jobDetails.client.lastName}`}</Typography>
            <Typography>{`Phone Number: ${jobDetails.client.phoneNumber}`}</Typography>
          </Grid>
          {/* Assigned Staff Details */}
          <Grid item xs={1.8}>
            <Typography variant="h5" component="span" fontWeight="bold">
              {fieldNames.assignedStaff}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="h5" component="span" fontWeight="bold">
              :
            </Typography>
          </Grid>
          <Grid item xs={9.2}>
            <Typography>{`${jobDetails.assignedStaff.firstName} ${jobDetails.assignedStaff.lastName}`}</Typography>
            <Typography>{`Phone Number: ${jobDetails.assignedStaff.phoneNumber}`}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default ViewJob;
