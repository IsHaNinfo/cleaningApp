import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";

function EditNews() {
  const { id } = useParams();
  const [newsDetails, setNewsDetails] = useState({
    description: "",
    date: "",
    status: "",
  });

  const [editedDetails, setEditedDetails] = useState({
    description: "",
    date: "",
    status: "",
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    fetchNewsDetails();
  }, []);

  const fetchNewsDetails = async () => {
    try {
      const response = await fetch(
        `https://jcgnapi.hasthiya.org/api/news/getNews/${id}`
      );
      const responseData = await response.json();
      if (responseData.result.status) {
        const modifiedData = {
          ...responseData.result.result,
          date: responseData.result.result.date.split("T")[0],
        };
        setNewsDetails(modifiedData);
        setEditedDetails(modifiedData);
        setWordCount(
          modifiedData.description
            .split(/\s+/)
            .filter((word) => word.length > 0).length
        );
      } else {
        console.error(
          "Failed to fetch news details:",
          responseData.result.message
        );
      }
    } catch (error) {
      console.error("Error fetching news details:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "description") {
      const words = value.split(/\s+/).filter((word) => word.length > 0);
      if (words.length <= 50) {
        setEditedDetails((prevDetails) => ({
          ...prevDetails,
          [name]: value,
        }));
        setWordCount(words.length);
      }
    } else {
      setEditedDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const handleUpdateNews = async () => {
    if (!editedDetails.description.trim()) {
      setError("Description is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://jcgnapi.hasthiya.org/api/news/updateNews/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedDetails),
        }
      );
      const responseData = await response.json();
      if (response.ok) {
        setNewsDetails(editedDetails);
        setAlertSeverity("success");
        setAlertMessage("News updated successfully");
        setTimeout(() => {
          navigate("/news");
        }, 2000);
      } else {
        setAlertSeverity("error");
        setAlertMessage(`Failed to update news: ${responseData.message}`);
      }
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage(`Error updating news: ${error.message}`);
    } finally {
      setIsLoading(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <Box m="20px" height="70vh" overflow="auto" paddingRight="20px">
      <Header title={`Edit News ID: ${id}`} subtitle="" />
      <Box ml={"40px"}>
        <Grid container spacing={2}>
          {Object.entries(newsDetails).map(([field, value]) => (
            <React.Fragment key={field}>
              {field !== "id" && (
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    {field === "date"
                      ? "Date (MM/DD/YYYY):"
                      : `${field.charAt(0).toUpperCase() + field.slice(1)}:`}
                  </Typography>
                  {field === "date" ? (
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      type="date"
                      name={field}
                      value={editedDetails[field]}
                      onChange={handleInputChange}
                    />
                  ) : field === "status" ? (
                    <Select
                      fullWidth
                      variant="outlined"
                      value={editedDetails[field]}
                      onChange={handleInputChange}
                      name={field}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  ) : (
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      name={field}
                      value={editedDetails[field]}
                      onChange={handleInputChange}
                      error={field === "description" && !!error}
                      helperText={field === "description" && error}
                      multiline={field === "description"}
                      rows={field === "description" ? 5 : 1}
                    />
                  )}
                  {field === "description" && (
                    <Typography variant="caption" color="textSecondary">
                      Word Count: {wordCount}/50
                    </Typography>
                  )}
                </Grid>
              )}
            </React.Fragment>
          ))}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateNews}
              disabled={isLoading}
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
              {isLoading ? "Updating..." : "Update News"}
            </Button>
          </Grid>
        </Grid>
      </Box>
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
          {alertSeverity === "success" ? "Success" : "Error"}
          {": "}
          {alertMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}

export default EditNews;
