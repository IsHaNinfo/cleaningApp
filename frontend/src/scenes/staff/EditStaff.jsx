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
import { environment } from "../../environment";

const EditStaff = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [staffDetails, setStaffDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phoneNumber: "",
    position: "",
    dateOfBirth: "",
    dateOfHire: "",
    empContactName: "",
    empPhoneNumber: "",
    bankAcNo: "",
    bankName: "",
    bankAcBranch: "",
    notes: "",
    workStatus: "",
    userName: "",
  });

  const [editedDetails, setEditedDetails] = useState({ ...staffDetails });
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchStaffDetails();
  }, [id]);

  const fetchStaffDetails = async () => {
    try {
      const response = await axios.get(environment.apiUrl+`/staff/getStaffById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = response.data;
      if (responseData.success) {
        setStaffDetails(responseData.staff);
        setEditedDetails(responseData.staff);
      } else {
        console.error('Failed to fetch staff details:', responseData.message);
      }
    } catch (error) {
      console.error('Error fetching staff details:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleUpdateStaff = async () => {
    setIsLoading(true);

    try {
      const response = await axios.put(environment.apiUrl+`/user/updateStaff/${id}`, editedDetails, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    console.log(response)
      if (response.status === 200) {
        setStaffDetails(editedDetails);
        setAlertSeverity('success');
        setAlertMessage('Staff updated successfully');
        setTimeout(() => {
          navigate('/staff');
        }, 2000);
      } else {
        setAlertSeverity('error');
        setAlertMessage(`Failed to update staff: ${response.data.message}`);
      }
    } catch (error) {
      setAlertSeverity('error');
      setAlertMessage(`Error updating staff: ${error.message}`);
    } finally {
      setIsLoading(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <Box m="20px" height="70vh" overflow="auto" paddingRight="20px">
      <Header title={`Edit Staff ID: ${id}`} subtitle="" />
      <Box ml={'40px'}>
        <Grid container spacing={2}>
          {/* Staff details fields */}
          {Object.entries(staffDetails).map(([field, value]) => (
            <React.Fragment key={field}>
                {field !== 'createdAt' && field !== '__v' && field !== '_id' && field !== 'updatedAt' && field !== 'adminId' &&  field !== 'user' && field !== 'workStatus' &&(
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    {`${field.charAt(0).toUpperCase() + field.slice(1)}:`}
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
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
              onClick={handleUpdateStaff}
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
              {isLoading ? 'Updating...' : 'Update Staff'}
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

export default EditStaff;
