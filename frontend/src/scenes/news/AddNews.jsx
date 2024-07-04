import {
  Box,
  Button,
  MenuItem,
  Alert as MuiAlert,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import AlertTitle from "@mui/material/AlertTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import Header from "../../components/Header";

const CreateNewNews = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [wordCount, setWordCount] = useState(0);
  const navigate = useNavigate();

  const handleFormSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://jcgnapi.hasthiya.org/api/news/createNews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      const responseData = await response.json();
      console.log("Response:", responseData);
      if (responseData.result.status) {
        setAlertSeverity("success");
        setAlertMessage("News Added Successfully");
        setTimeout(() => {
          navigate("/news");
        }, 2000);
        resetForm();
      } else {
        setAlertSeverity("error");
        setAlertMessage(responseData.result.message);
      }
    } catch (error) {
      console.error("Error creating news:", error);
      setAlertSeverity("error");
      setAlertMessage("Failed to add news");
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  const handleDescriptionChange = (event, setFieldValue) => {
    const value = event.target.value;
    const words = value.split(/\s+/).filter((word) => word.length > 0);
    if (words.length <= 50) {
      setFieldValue("description", value);
      setWordCount(words.length);
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
      <Header title="Create News" subtitle="" />
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
        validationSchema={checkoutSchema}
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
                Description (Word Count {wordCount}/50)*
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  onBlur={handleBlur}
                  onChange={(e) => handleDescriptionChange(e, setFieldValue)}
                  value={values.description}
                  name="description"
                  multiline
                  rows={5}
                  error={!!touched.description && !!errors.description}
                  helperText={touched.description && errors.description}
                />
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                Date*
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="date"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.date}
                  name="date"
                  error={!!touched.date && !!errors.date}
                  helperText={touched.date && errors.date}
                />
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                Status*
              </Typography>
              <Box mt={-2}>
                <Select
                  fullWidth
                  variant="filled"
                  label="Status*"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.status}
                  name="status"
                  error={!!touched.status && !!errors.status}
                  helperText={touched.status && errors.status}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
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

const checkoutSchema = yup.object().shape({
  description: yup
    .string()
    .test(
      "word-count",
      "Description must be 50 words or less",
      (value) =>
        !value ||
        value.split(/\s+/).filter((word) => word.length > 0).length <= 50
    )
    .required("Description is required"),
  date: yup.date().required("Date is required").nullable(),
  status: yup.string().required("Status is required"),
});

const initialValues = {
  description: "",
  date: "",
  status: "active",
};

export default CreateNewNews;
