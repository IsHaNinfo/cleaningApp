import {
    Box,
    Button,
    MenuItem,
    Alert as MuiAlert,
    Select,
    Snackbar,
    TextField,
    Typography,
    FormControl,
  FormHelperText
  } from "@mui/material";
  import AlertTitle from "@mui/material/AlertTitle";
  import useMediaQuery from "@mui/material/useMediaQuery";
  import { Formik } from "formik";
  import React, { useState, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import * as yup from "yup";
  import axios from "axios";
  import Header from "../../components/Header";
import { environment } from "../../environment";
  
  const AddJob = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("success");
    const [clients, setClients] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchClients();
      fetchStaffs();
    }, []);
    const token = localStorage.getItem("token")

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
          //const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
          const response = await axios.get(environment.apiUrl + "/staff/getAllActiveStaff", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.data.success) {
            console.log(staffs);
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
  
      const handleFormSubmit = async (values, { resetForm }) => {
        setLoading(true);
        try {
          const headers = {
            Authorization: `Bearer ${token}`
          };
      
          const response = await axios.post(environment.apiUrl + `/job/addJob`, values, { headers });
          console.log("Response:", response.data);
      
          if (response.data.success== true) {
            setAlertSeverity("success");
            setAlertMessage("Job Added Successfully");
            setTimeout(() => {
              navigate("/jobs");
            }, 2000);
            resetForm();
          } else {
            setAlertSeverity("error");
            setAlertMessage(response.data.result.message);
          }
        } catch (error) {
          console.error("Error creating job:", error);
          setAlertSeverity("error");
          setAlertMessage("Failed to add job");
        } finally {
          setLoading(false);
          setOpenSnackbar(true);
        }
      };
  
    return (
      <Box
        m="20px"
        height="70vh"
        width="90%"
        overflow="auto"
        paddingRight="20px"
        position="relative"
      >
        <Header title="Add Job" subtitle="" />
        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MuiAlert
            onClose={() => setOpenSnackbar(false)}
            severity={alertSeverity}
            elevation={6}
            variant="filled"
            sx={{ color: "#fff" }}
          >
            <AlertTitle>
              {alertSeverity === "success" ? "Success" : "Error"}
            </AlertTitle>
            {alertMessage}
          </MuiAlert>
        </Snackbar>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={jobSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit} height="41vh">
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns={
                  isNonMobile ? "repeat(1, 1fr)" : "repeat(1, 1fr)"
                }
              >
                <Typography fontWeight="bold" fontSize="16px">
                  Job Name*
                </Typography>
                <Box mt={-2}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.jobName}
                    name="jobName"
                    error={!!touched.jobName && !!errors.jobName}
                    helperText={touched.jobName && errors.jobName}
                  />
                </Box>
                <Typography fontWeight="bold" fontSize="16px">
                  Description*
                </Typography>
                <Box mt={-2}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description}
                    name="description"
                    multiline
                    rows={5}
                    error={!!touched.description && !!errors.description}
                    helperText={touched.description && errors.description}
                  />
                </Box>
                <Typography fontWeight="bold" fontSize="16px">
                  Client*
                </Typography>
                <Box mt={-2}>
                <FormControl
                 fullWidth
                 variant="filled"
                 error={!!touched.client && !!errors.client}
                     >
                  <Select
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.client}
                    name="client"
                    error={!!touched.client && !!errors.client}
                    helperText={touched.client && errors.client}
                  >
                    {clients.map((client) => (
                      <MenuItem key={client._id} value={client._id}>
                        {client.firstName} {client.lastName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{touched.client && errors.client}</FormHelperText>
                  </FormControl>
                </Box>
                <Typography fontWeight="bold" fontSize="16px">
                  Assigned Staff*
                </Typography>
                
                <Box mt={-2}>
                <FormControl
  fullWidth
  variant="filled"
  error={!!touched.client && !!errors.client}
>
                  <Select
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.assignedStaff}
                    name="assignedStaff"
                    error={!!touched.assignedStaff && !!errors.assignedStaff}
                    helperText={touched.assignedStaff && errors.assignedStaff}
                  >
                    {staffs.map((staff) => (
                      <MenuItem key={staff._id} value={staff._id}>
                        {staff.firstName} {staff.lastName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{touched.assignedStaff && errors.assignedStaff}</FormHelperText>
                  </FormControl>
                </Box>
                <Typography fontWeight="bold" fontSize="16px">
                  Start Time*
                </Typography>
                <Box mt={-2}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="datetime-local"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.startTime}
                    name="startTime"
                    error={!!touched.startTime && !!errors.startTime}
                    helperText={touched.startTime && errors.startTime}
                  />
                </Box>
                <Typography fontWeight="bold" fontSize="16px">
                  Number of Hours*
                </Typography>
                <Box mt={-2}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.noOfhours}
                    name="noOfhours"
                    error={!!touched.noOfhours && !!errors.noOfhours}
                    helperText={touched.noOfhours && errors.noOfhours}
                  />
                </Box>
                <Typography fontWeight="bold" fontSize="16px">
                  Hourly Rate*
                </Typography>
                <Box mt={-2}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.hourRate}
                    name="hourRate"
                    error={!!touched.hourRate && !!errors.hourRate}
                    helperText={touched.hourRate && errors.hourRate}
                  />
                </Box>
                <Typography fontWeight="bold" fontSize="16px">
                  Notes
                </Typography>
                <Box mt={-2}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.notes}
                    name="notes"
                    multiline
                    rows={3}
                    error={!!touched.notes && !!errors.notes}
                    helperText={touched.notes && errors.notes}
                  />
                </Box>
              </Box>
              {/* Submit Button */}
              <Box display="flex" justifyContent="end" mt="20px">
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    backgroundColor: "#6870fa",
                    color: "white",
                    marginRight: 2,
                    fontSize: "16px",
                    "&:hover": {
                      backgroundColor: "#3e4396",
                    },
                  }}
                >
                  {loading ? "Adding..." : "Add"}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    );
  };
  
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
  
  const initialValues = {
    jobName: "",
    description: "",
    client: "",
    assignedStaff: "",
    startTime: "",
    noOfhours: "",
    hourRate: "",
    notes: "",
  };
  
  export default AddJob;
  