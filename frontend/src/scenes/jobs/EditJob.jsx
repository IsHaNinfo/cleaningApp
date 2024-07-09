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
const EditJob = () => {
    const { id } = useParams();
    const token = localStorage.getItem("token")

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

  const [editedDetails, setEditedDetails] = useState({
    jobName: '',
    description: '',
    client: '',
    assignedStaff: '',
    startTime: '',
    noOfhours: 0,
    hourRate: 0,
    notes: '',
  });
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [clients, setClients] = useState([]);
  const [staffs, setStaffs] = useState([]);

  useEffect(() => {
    fetchClients();
    fetchStaffs();
    fetchJobDetails(); // Assuming fetchJobDetails fetches job data including client and staff info
  }, []);

  const fetchClients = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      };

      const response = await axios.get(environment.apiUrl + "/client/getAllClient", { headers });

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
      const response = await axios.get(environment.apiUrl + "/staff/getAllStaff", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data)
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

      const response = await axios.get(environment.apiUrl + `/job/getJobById/${id}`,);

      console.log(response.data.message)
      const responseData = response.data;
      console.log(responseData.job)

      if (responseData.success) {
        setJobDetails(responseData.job);
        setEditedDetails(responseData.job);
        console.log(editedDetails)
      } else {
        console.error('Failed to fetch job details:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // For client and assignedStaff fields, set the value to the corresponding object
    if (name === 'client') {
      const selectedClient = clients.find(client => client._id === value);
      setEditedDetails(prevDetails => ({
        ...prevDetails,
        client: selectedClient || '', // Set to empty string or handle null case as needed
      }));
    } else if (name === 'assignedStaff') {
      const selectedStaff = staffs.find(staff => staff._id === value);
      setEditedDetails(prevDetails => ({
        ...prevDetails,
        assignedStaff: selectedStaff || '', // Set to empty string or handle null case as needed
      }));
    } else {
      // For other fields, update normally
      setEditedDetails(prevDetails => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };
  const handleUpdateJob = async () => {
    setIsLoading(true);

    try {


      const response = await axios.put( environment.apiUrl + `/job/updatedJob/${id}`, editedDetails,{
        headers: {
            Authorization: `Bearer ${token}`
          }
      });
      const responseData = response.data;
      if (response.status === 200) {
        setJobDetails(editedDetails);
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
        <Grid container spacing={2}>
          {/* Job details fields */}
          {Object.entries(jobDetails).map(([field, value]) => (
            <React.Fragment key={field}>
            {field !== 'createdAt' && field !== 'updatedAt' && field !== '__v' &&  field !=='jobStatus' &&(
              <Grid item xs={12}>
                <Typography variant="h5" component="span" fontWeight="bold">
                  {`${field.charAt(0).toUpperCase() + field.slice(1)}:`}
                </Typography>
                {/* Render appropriate input based on field */}
                {field === 'client' ? (
                  <Select
                    fullWidth
                    variant="outlined"
                    value={editedDetails.client}
                    onChange={handleInputChange}
                    name="client"
                  >
                    {clients.map((client) => (
                      <MenuItem key={client._id} value={client._id}>
                        {client.firstName} {client.lastName}
                      </MenuItem>
                    ))}
                  </Select>
                ) : field === 'assignedStaff' ? (
                  <Select
                    fullWidth
                    variant="outlined"
                    value={editedDetails.assignedStaff}
                    onChange={handleInputChange}
                    name="assignedStaff"
                  >
                    {staffs.map((staff) => (
                      <MenuItem key={staff._id} value={staff._id}>
                        {staff.firstName} {staff.lastName}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    name={field}
                    value={editedDetails[field]}
                    onChange={handleInputChange}
                    multiline={field === 'description' || field === 'notes'}
                    rows={field === 'description' || field === 'notes' ? 3 : 1}
                  />
                )}
              </Grid>
            )}
          </React.Fragment>

          ))}
          {/* Update button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateJob}
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
