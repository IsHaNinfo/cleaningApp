import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { environment } from '../../environment';

const EditClient = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [clientDetails, setClientDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phoneNumber: "",
    contactName: "",
    contactPhoneNumber: "",
    contactEmail: "",
    accountManager: "",
    notes: "",
  });

  const [editedDetails, setEditedDetails] = useState({ ...clientDetails });
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchClientDetails();
  }, [id]);

  const fetchClientDetails = async () => {
    try {
      const response = await axios.get(environment.apiUrl+`/client/getClientById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = response.data;
      if (responseData.success) {
        setClientDetails(responseData.client);
        setEditedDetails(responseData.client);
      } else {
        console.error('Failed to fetch client details:', responseData.message);
      }
    } catch (error) {
      console.error('Error fetching client details:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleUpdateClient = async () => {
    setIsLoading(true);

    try {
      const response = await axios.put(environment.apiUrl+`/client/updateClientById/${id}`, editedDetails, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setClientDetails(editedDetails);
        setAlertSeverity('success');
        setAlertMessage('Client updated successfully');
        setTimeout(() => {
          navigate('/clients');
        }, 2000);
      } else {
        setAlertSeverity('error');
        setAlertMessage(`Failed to update client: ${response.data.message}`);
      }
    } catch (error) {
      setAlertSeverity('error');
      setAlertMessage(`Error updating client: ${error.message}`);
    } finally {
      setIsLoading(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <Box m="20px" height="70vh" overflow="auto" paddingRight="20px">
      <Header title={`Edit Client ID: ${id}`} subtitle="" />
      <Box ml={'40px'}>
        <Grid container spacing={2}>
          {/* Client details fields */}
          {Object.entries(clientDetails).map(([field, value]) => (
            <React.Fragment key={field}>
                {field !== 'createdAt' && field !== 'clientStatus' && field !== '__v' && field !== '_id' && field !== 'updatedAt' && field !== 'adminId' && (
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    {`${field.charAt(0).toUpperCase() + field.slice(1)}:`}
                  </Typography>
                  <TextField
                    fullWidth
                    variant="filled"
                    margin="normal"
                    name={field}
                    value={editedDetails[field]}
                    onChange={handleInputChange}
                    multiline={field === 'notes'}
                    rows={field === 'notes' ? 3 : 1}
                  />
                </Grid>
              )}
            </React.Fragment>
          ))}
          {/* Update button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateClient}
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
              {isLoading ? 'Updating...' : 'Update Client'}
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

export default EditClient;
