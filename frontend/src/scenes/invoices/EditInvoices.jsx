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
import { environment } from "../../environment";

const EditInvoice = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceTitle: "",
    invoiceDescription: "",
    sendDate: "",
    client: "",
    amount: ""
  });

  const [editedDetails, setEditedDetails] = useState({ ...invoiceDetails });
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchClients();
    fetchInvoiceDetails();
  }, [id]);

  const fetchClients = async () => {
    try {
      const response = await axios.get(environment.apiUrl + "/client/getAllClient", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

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

  const fetchInvoiceDetails = async () => {
    try {
      const response = await axios.get(environment.apiUrl + `/invoice/getInvoiceById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = response.data;
      if (responseData.success) {
        const invoice = responseData.invoice;
        // Format the sendDate to YYYY-MM-DD for the input field
        if (invoice.sendDate) {
          invoice.sendDate = new Date(invoice.sendDate).toISOString().split('T')[0];
        }
        setInvoiceDetails(invoice);
        setEditedDetails(invoice);
      } else {
        console.error('Failed to fetch invoice details:', responseData.message);
      }
    } catch (error) {
      console.error('Error fetching invoice details:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleUpdateInvoice = async () => {
    setIsLoading(true);

    try {
      const response = await axios.put(environment.apiUrl + `/invoice/updatedInvoice/${id}`, editedDetails, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setInvoiceDetails(editedDetails);
        setAlertSeverity('success');
        setAlertMessage('Invoice updated successfully');
        setTimeout(() => {
          navigate('/invoices');
        }, 2000);
      } else {
        setAlertSeverity('error');
        setAlertMessage(`Failed to update invoice: ${response.data.message}`);
      }
    } catch (error) {
      setAlertSeverity('error');
      setAlertMessage(`Error updating invoice: ${error.message}`);
    } finally {
      setIsLoading(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <Box m="20px" height="70vh" overflow="auto" paddingRight="20px">
      <Header title={`Edit Invoice ID: ${id}`} subtitle="" />
      <Box ml={'40px'}>
        <Grid container spacing={2}>
          {/* Invoice details fields */}
          {Object.entries(invoiceDetails).map(([field, value]) => {
            if (field === 'client' || field === 'createdAt' || field === 'updatedAt' || field === '_id' || field === '__v' || field === 'invoiceStatus') {
              return null;
            }

            return (
              <Grid item xs={12} key={field}>
                <Typography variant="h5" component="span" fontWeight="bold">
                  {`${field.charAt(0).toUpperCase() + field.slice(1)}:`}
                </Typography>
                {/* Render appropriate input based on field */}
                {field === 'sendDate' ? (
                  <TextField
                    fullWidth
                    variant="filled"
                    type="date"
                    name="sendDate"
                    value={editedDetails.sendDate || ''}
                    onChange={handleInputChange}
                    sx={{ backgroundColor: 'white' }}
                  />
                ) : (
                  <TextField
                    fullWidth
                    variant="filled"
                    margin="normal"
                    name={field}
                    value={editedDetails[field]}
                    onChange={handleInputChange}
                    multiline={field === 'invoiceDescription'}
                    rows={field === 'invoiceDescription' ? 3 : 1}
                    sx={{ backgroundColor: 'white' }}
                  />
                )}
              </Grid>
            );
          })}
          {/* Client field */}
          <Grid item xs={12}>
            <Typography variant="h5" component="span" fontWeight="bold">
              Client:
            </Typography>
            <Select
              fullWidth
              variant="filled"
              value={editedDetails.client._id || ''}
              onChange={(e) => handleInputChange({ target: { name: 'client', value: e.target.value } })}
              name="client"
              sx={{ backgroundColor: 'white' }}
            >
              {clients.map((client) => (
                <MenuItem key={client._id} value={client._id}>
                  {client.firstName} {client.lastName}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          {/* Update button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateInvoice}
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
              {isLoading ? 'Updating...' : 'Update Invoice'}
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

export default EditInvoice;
