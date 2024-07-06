import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import axios from "axios";

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
    startTime: "",
    jobStatus: "",
    notes: "",
  });

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/job/getJobById/${id}`);
      const responseData = response.data;
      console.log(responseData)
      if (responseData.success) {
        const { job, message } = responseData;
        const { jobName, description, client, assignedStaff, startTime, jobStatus, notes } = job;
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
          startTime,
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
                    {field}
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
              Client
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
              Assigned Staff
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
