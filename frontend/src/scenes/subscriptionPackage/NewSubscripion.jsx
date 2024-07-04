import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import Header from "../../components/Header";
const CreateNewsub = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://jcgnapi.hasthiya.org/package/addpackage",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            package_name: values.Name,
            amount: values.amount,
            features: values.feature,
            subscription_note: values.note,
            typeOfSubscription: values.type,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add package");
      }

      const result = await response.json();
      console.log(result);

      setAlertSeverity("success");
      setAlertMessage("Package added successfully!");
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/subscription");
      }, 2000);
    } catch (error) {
      console.error(error);
      setAlertSeverity("error");
      setAlertMessage("Failed to add package.");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box m="20px" height="70vh" width="90%" overflow="auto" paddingRight="20px">
      <Header title="Create New Subscription Option" subtitle="" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit} height="41vh">
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns={
                isNonMobile ? "repeat(1, 1fr)" : "repeat(1, 1fr)"
              }
            >
              <Box>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Package Name*"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.Name}
                  name="Name"
                  error={!!touched.Name && !!errors.Name}
                  helperText={touched.Name && errors.Name}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label="Amount (US Dollars)*"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.amount}
                  name="amount"
                  error={!!touched.amount && !!errors.amount}
                  helperText={touched.amount && errors.amount}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Features*"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.feature}
                  rows={3}
                  name="feature"
                  multiline
                  error={!!touched.feature && !!errors.feature}
                  helperText={touched.feature && errors.feature}
                />
              </Box>

              <Box>
                <FormControl
                  fullWidth
                  variant="filled"
                  error={!!touched.type && !!errors.type}
                >
                  <InputLabel>Type of Subscription*</InputLabel>
                  <Select
                    name="type"
                    value={values.type}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Type of Subscription*"
                  >
                    <MenuItem value="Organization">Organization</MenuItem>
                    <MenuItem value="18+ Married/Single Parent">
                      18+ Married/Single Parent
                    </MenuItem>
                    <MenuItem value="18+ Single">18+ Single</MenuItem>
                    <MenuItem value="12-17 Years Old">12-17 Years Old</MenuItem>
                  </Select>
                  <FormHelperText>{touched.type && errors.type}</FormHelperText>
                </FormControl>
              </Box>

              <Box>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Subscription Note*"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.note}
                  name="note"
                  multiline
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
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  Name: yup.string().required("Name is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .required("Amount is required"),
  feature: yup.string().required("Feature is required"),
  type: yup.string().required("Type of subscription is required"),
});

const initialValues = {
  Name: "",
  amount: "",
  feature: "",
  type: "",
  note: "",
  image: null,
};

export default CreateNewsub;
