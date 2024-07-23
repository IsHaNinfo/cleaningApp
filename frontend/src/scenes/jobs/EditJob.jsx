import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { environment } from '../../environment';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';

const jobSchema = yup.object().shape({
  jobName: yup.string().required("Job Name is required"),
  description: yup.string().required("Description is required"),
  client: yup.string().required("Client is required"),
  assignedStaff: yup.string().required("Assigned Staff is required"),
  startTime: yup.date().required("Start Time is required").nullable(),
  noOfhours: yup.number().required("Number of Hours is required").nullable(),
  hourRate: yup.number().required("Hourly Rate is required").nullable(),
  notes: yup.string(),
});

const EditJob = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [jobDetails, setJobDetails] = useState({
    jobName: '',
    description: '',
    client: '',
    assignedStaff: '',
    startTime: '',
    noOfhours: 0,
    hourRate: 0,
    notes: '',
  });

  const [clients, setClients] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
    fetchStaffs();
    fetchJobDetails();
  }, []);

  const fetchClients = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      };

      const response = await axios.get(environment.apiUrl + "/client/getAllActiveClient", { headers });

      if (response.data.success) {
        setClients(response.data.clients);
      } else {
        setAlertSeverity("error");
        setAlertMessage("Failed to fetch clients");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      setAlertSeverity("error");
      setAlertMessage("Failed to fetch clients");
      setOpenSnackbar(true);
    }
  };

  const fetchStaffs = async () => {
    try {
      const response = await axios.get(environment.apiUrl + "/staff/getAllActiveStaff", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setStaffs(response.data.staffs);
      } else {
        setAlertSeverity("error");
        setAlertMessage("Failed to fetch staffs");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error fetching staffs:", error);
      setAlertSeverity("error");
      setAlertMessage("Failed to fetch staffs");
      setOpenSnackbar(true);
    }
  };

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(environment.apiUrl + `/job/getJobById/${id}`);
      const responseData = response.data;

      if (responseData.success) {
        console.log("res",response)
        const job = responseData.job;
        // Convert the startTime to the required format
        if (job.startTime) {
          job.startTime = new Date(job.startTime).toISOString().slice(0, 16);
        }

        job.client = job.client._id;
        job.assignedStaff = job.assignedStaff._id
        setJobDetails(job);
      } else {
        console.error('Failed to fetch job details:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  const handleUpdateJob = async (values) => {
    setIsLoading(true);

    try {
      const response = await axios.put(environment.apiUrl + `/job/updatedJob/${id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = response.data;
      if (response.status === 200) {
        setAlertSeverity('success');
        setAlertMessage('Job updated successfully');
        setTimeout(() => {
          navigate('/jobs');
        }, 2000);
      } else {
        setAlertSeverity('error');
        setAlertMessage(`Failed to update job: ${responseData.message}`);
      }
    } catch (error) {
      setAlertSeverity('error');
      setAlertMessage(`Error updating job: ${error.message}`);
    } finally {
      setIsLoading(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <Box m="20px" height="70vh" overflow="auto" paddingRight="20px">
      <Header title={`Edit Job ID: ${id}`} subtitle="" />
      <Box ml={'40px'}>
        <Formik
          initialValues={jobDetails}
          enableReinitialize
          validationSchema={jobSchema}
          onSubmit={handleUpdateJob}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* Job details fields */}
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    Job Name:
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    margin="normal"
                    name="jobName"
                    value={values.jobName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.jobName && Boolean(errors.jobName)}
                    helperText={touched.jobName && errors.jobName}
                    sx={{ backgroundColor: 'white' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    Description:
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    margin="normal"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    multiline
                    rows={3}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                    sx={{ backgroundColor: 'white' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    Client:
                  </Typography>
                  <Field
                    as={Select}
                    fullWidth
                    variant="filled"
                    name="client"
                    value={values.client}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.client && Boolean(errors.client)}
                    helperText={touched.client && errors.client}
                    sx={{ backgroundColor: 'white' }}
                  >
                    {clients.map((client) => (
                      <MenuItem key={client._id} value={client._id}>
                        {client.firstName} {client.lastName}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    Assigned Staff:
                  </Typography>
                  <Field
                    as={Select}
                    fullWidth
                    variant="filled"
                    name="assignedStaff"
                    value={values.assignedStaff}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.assignedStaff && Boolean(errors.assignedStaff)}
                    helperText={touched.assignedStaff && errors.assignedStaff}
                    sx={{ backgroundColor: 'white' }}
                  >
                    {staffs.map((staff) => (
                      <MenuItem key={staff._id} value={staff._id}>
                        {staff.firstName} {staff.lastName}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    Start Time:
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    type="datetime-local"
                    name="startTime"
                    value={values.startTime}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.startTime && Boolean(errors.startTime)}
                    helperText={touched.startTime && errors.startTime}
                    sx={{ backgroundColor: 'white' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    Number of Hours:
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    type="number"
                    name="noOfhours"
                    value={values.noOfhours}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.noOfhours && Boolean(errors.noOfhours)}
                    helperText={touched.noOfhours && errors.noOfhours}
                    sx={{ backgroundColor: 'white' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    Hourly Rate:
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    type="number"
                    name="hourRate"
                    value={values.hourRate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.hourRate && Boolean(errors.hourRate)}
                    helperText={touched.hourRate && errors.hourRate}
                    sx={{ backgroundColor: 'white' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    Notes:
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    margin="normal"
                    name="notes"
                    value={values.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    multiline
                    rows={3}
                    error={touched.notes && Boolean(errors.notes)}
                    helperText={touched.notes && errors.notes}
                    sx={{ backgroundColor: 'white' }}
                  />
                </Grid>
                {/* Update button */}
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isLoading}
                    sx={{
                      backgroundColor: '#6870fa',
                      color: 'white',
                      marginRight: 2,
                      fontSize: '16px',
                      '&:hover': {
                        backgroundColor: '#3e4396',
                      },
                    }}
                  >
                    {isLoading ? 'Updating...' : 'Update Job'}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
      {/* Snackbar for alerts */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert
          onClose={() => setOpenSnackbar(false)}
          severity={alertSeverity}
          elevation={6}
          variant="filled"
          sx={{ color: '#fff' }}
        >
          {alertSeverity === 'success' ? 'Success' : 'Error'}
          {': '}
          {alertMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default EditJob;
