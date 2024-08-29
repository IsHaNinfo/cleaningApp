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
  FormHelperText,
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
  const [isHoliday, setIsHoliday] = useState(false);
  const [holidayName, setHolidayName] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchClients();
    fetchStaffs();
  }, []);

  const fetchClients = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(
        `${environment.apiUrl}/client/getAllActiveClient`,
        { headers }
      );
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
      const response = await axios.get(
        `${environment.apiUrl}/staff/getAllActiveStaff`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  const checkHoliday = async (date) => {
    const selectedYear = new Date(date).getFullYear();
    const countryCode = "AU"; // Australia
    console.log(selectedYear)
    try {
      const response = await axios.get(
        `https://date.nager.at/api/v3/PublicHolidays/${selectedYear}/${countryCode}`
      );
      console.log(response)
      if (response.status === 200) {
        const holidays = response.data;
        const selectedDate = new Date(date).toISOString().split("T")[0];

        const holiday = holidays.find(
          (holiday) => holiday.date === selectedDate
        );

        if (holiday) {
          setIsHoliday(true);
          setHolidayName(holiday.localName);
        } else {
          setIsHoliday(false);
          setHolidayName("");
        }
      } else {
        setIsHoliday(false);
        setHolidayName("");
      }
    } catch (error) {
      console.error("Error fetching holidays:", error);
      setIsHoliday(false);
      setHolidayName("");
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    setLoading(true);
  
    if (isHoliday) {
      setAlertSeverity("error");
      setAlertMessage(`The selected date (${values.jobDate}) is a holiday (${holidayName}). Please choose a different date.`);
      setOpenSnackbar(true);
      setLoading(false);
      return; // Stop form submission if it's a holiday
    }
  
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.post(
        `${environment.apiUrl}/job/addJob`,
        values,
        { headers }
      );
      if (response.data.success) {
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
          <form onSubmit={handleSubmit}>
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
                  >
                    {clients.map((client) => (
                      <MenuItem key={client._id} value={client._id}>
                        {client.firstName} {client.lastName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {touched.client && errors.client}
                  </FormHelperText>
                </FormControl>
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                Assigned Staff*
              </Typography>
              <Box mt={-2}>
                <FormControl
                  fullWidth
                  variant="filled"
                  error={!!touched.assignedStaff && !!errors.assignedStaff}
                >
                  <Select
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.assignedStaff}
                    name="assignedStaff"
                  >
                    {staffs.map((staff) => (
                      <MenuItem key={staff._id} value={staff._id}>
                        {staff.firstName} {staff.lastName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {touched.assignedStaff && errors.assignedStaff}
                  </FormHelperText>
                </FormControl>
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                Job Date*
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="date"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFieldValue("jobDate", e.target.value);
                    checkHoliday(e.target.value);
                  }}
                  value={values.jobDate}
                  name="jobDate"
                  error={!!touched.jobDate && !!errors.jobDate}
                  helperText={touched.jobDate && errors.jobDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                Original Number of Hours*
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.orgNoOfhours}
                  name="orgNoOfhours"
                  error={!!touched.orgNoOfhours && !!errors.orgNoOfhours}
                  helperText={touched.orgNoOfhours && errors.orgNoOfhours}
                />
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                Original Hourly Rate*
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.orgHourRate}
                  name="orgHourRate"
                  error={!!touched.orgHourRate && !!errors.orgHourRate}
                  helperText={touched.orgHourRate && errors.orgHourRate}
                />
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                Estimated Number of Hours*
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.estNoOfhours}
                  name="estNoOfhours"
                  error={!!touched.estNoOfhours && !!errors.estNoOfhours}
                  helperText={touched.estNoOfhours && errors.estNoOfhours}
                />
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                Staff Hourly Rate*
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.staffHourRate}
                  name="staffHourRate"
                  error={!!touched.staffHourRate && !!errors.staffHourRate}
                  helperText={touched.staffHourRate && errors.staffHourRate}
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
              {isHoliday && (
                <Box mt={2} color="error.main">
                  <Typography variant="body2" fontWeight="bold">
                    The selected date is a holiday: {holidayName}.
                  </Typography>
                </Box>
              )}
            </Box>
            {/* Submit Button */}
            <Box display="flex" justifyContent="flex-end" mt={4}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={loading}
                sx={{ padding: "10px 20px", fontSize: "16px" }}
              >
                {loading ? "Submitting..." : "Add Job"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const initialValues = {
  jobName: "",
  description: "",
  client: "",
  assignedStaff: "",
  jobDate: "",
  orgNoOfhours: "",
  orgHourRate: "",
  estNoOfhours: "",
  staffHourRate: "",
  notes: "",
};

const jobSchema = yup.object().shape({
  jobName: yup.string().required("Job Name is required"),
  description: yup.string().required("Description is required"),
  client: yup.string().required("Client is required"),
  assignedStaff: yup.string().required("Assigned Staff is required"),
  jobDate: yup.date().required("Start Time is required"),
  orgNoOfhours: yup
    .number()
    .required("Original Number of Hours is required")
    .min(0, "Hours must be greater than or equal to 0"),
  orgHourRate: yup
    .number()
    .required("Original Hourly Rate is required")
    .min(0, "Rate must be greater than or equal to 0"),
  estNoOfhours: yup
    .number()
    .required("Estimated Number of Hours is required")
    .min(0, "Hours must be greater than or equal to 0"),
  staffHourRate: yup
    .number()
    .required("Estimated Hourly Rate is required")
    .min(0, "Rate must be greater than or equal to 0"),
});

export default AddJob;
