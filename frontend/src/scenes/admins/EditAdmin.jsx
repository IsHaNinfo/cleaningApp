import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Snackbar,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { environment } from "../../environment";

const EditAdmin = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [adminDetails, setAdminDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    position: "",
    userName: "",
  });

  const [editedDetails, setEditedDetails] = useState({ ...adminDetails });
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [passwordDetails, setPasswordDetails] = useState({
    password: "",
    confirmPassword: "",
  });
  const [admin, setAdmin] = useState('');

  useEffect(() => {
    fetchAdminDetails();
  }, [id]);

  const fetchAdminDetails = async () => {
    try {
      const response = await axios.get(`${environment.apiUrl}/user/getUser/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = response.data.userDetails;
      if (responseData) {
        const adminData = responseData.adminDetails;
        setAdmin(adminData._id);
        setAdminDetails({
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          email: responseData.email,
          position: adminData.position,
          userName: responseData.userName,
        });
        setEditedDetails({
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          email: responseData.email,
          position: adminData.position,
          userName: responseData.userName,
        });
      } else {
        console.error('Failed to fetch admin details:', responseData.message);
      }
    } catch (error) {
      console.error('Error fetching admin details:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleUpdateAdmin = async () => {
    setIsLoading(true);

    try {
      const response = await axios.put(`${environment.apiUrl}/user/updateAdmin/${admin}`, editedDetails, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setAdminDetails(editedDetails);
        setAlertSeverity('success');
        setAlertMessage('Admin account updated successfully');
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      } else {
        console.error(response);
        setAlertSeverity('error');
        setAlertMessage(`Failed to update admin: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error updating admin:', error);
      setAlertSeverity('error');
      setAlertMessage(`Error updating admin: ${error.message}`);
    } finally {
      setIsLoading(false);
      setOpenSnackbar(true);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwordDetails.password) {
      setAlertSeverity('error');
      setAlertMessage('Please enter a valid password');
      setOpenSnackbar(true);
      return;
    }
    if (passwordDetails.password !== passwordDetails.confirmPassword) {
      setAlertSeverity('error');
      setAlertMessage('Passwords do not match');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await axios.put(`${environment.apiUrl}/admin/updateAdminPassword/${id}`, { password: passwordDetails.password }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setAlertSeverity('success');
        setAlertMessage('Password updated successfully');
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      } else {
        setAlertSeverity('error');
        setAlertMessage(`Failed to update password: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setAlertSeverity('error');
      setAlertMessage(`Error updating password: ${error.message}`);
    } finally {
      setOpenSnackbar(true);
    }
  };

  // Function to filter out unwanted fields
  const filterFields = (field) => {
    const unwantedFields = ['createdAt', '__v', '_id', 'updatedAt', 'adminId', 'user', 'status', 'adminDetails', 'role'];
    return !unwantedFields.includes(field);
  };

  return (
    <Box m="20px" height="70vh" overflow="auto" paddingRight="20px">
      <Header title={`Edit Admin ID: ${id}`} subtitle="" />
      <Box ml={'40px'}>
        <Grid container spacing={2}>
          {/* Render fields */}
          {Object.entries(adminDetails).map(([field, value]) => (
            <React.Fragment key={field}>
              {filterFields(field) && (
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
              onClick={handleUpdateAdmin}
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
              {isLoading ? 'Updating...' : 'Update Admin'}
            </Button>
          </Grid>

          {/* Password update fields */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h5" component="span" fontWeight="bold">
              Update Password:
            </Typography>
            <TextField
              fullWidth
              variant="filled"
              margin="normal"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={passwordDetails.password}
              onChange={handlePasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              variant="filled"
              margin="normal"
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={passwordDetails.confirmPassword}
              onChange={handlePasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleUpdatePassword}
              sx={{
                backgroundColor: '#f50057',
                color: 'white',
                marginTop: 2,
                fontSize: '16px',
                '&:hover': {
                  backgroundColor: '#ab003c',
                },
              }}
            >
              Update Password
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

export default EditAdmin;
