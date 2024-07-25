import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import axios from "axios";
import { environment } from "../../environment";
import { Link } from "react-router-dom";
import { Email } from "@mui/icons-material";

const ViewStaff = () => {
  const { id } = useParams();
  const [staffDetails, setStaffDetails] = useState({
    firstName: "",
    lastName: "",
    address: "",
    email:"",
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
  });

  useEffect(() => {
    fetchStaffDetails();
  }, [id]);
  
  const token = localStorage.getItem("token")

  const fetchStaffDetails = async () => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
          };
      const response = await axios.get(environment.apiUrl+`/staff/getStaffById/${id}`, { headers });
      const responseData = response.data;
      console.log(response);
      if (responseData.success) {
        const { staff } = responseData;
        setStaffDetails(staff);
      } else {
        console.error("Failed to fetch staff details:");
      }
    } catch (error) {
      console.error("Error fetching staff details:", error);
    }
  };

  return (
    <Box m="20px" height="70vh" overflow="auto" paddingRight="20px">
      <Header title={`View Staff ID: ${id}`} subtitle="" />

      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
        <Link to={`/staff/viewstaff/${id}/jobs`} style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#6870fa",
              color: "white",
              fontSize: "16px",
              "&:hover": {
                backgroundColor: "#3e4396",
              },
            }}
          >
            View Staff Jobs
          </Button>
        </Link>
      </Box>

      <Box ml={"40px"}>
        <Grid container spacing={2}>
          {Object.entries(staffDetails)
            .filter(([field]) => field !== "createdAt" && field !== "__v" && field !== "updatedAt" && field !== "user") // Filter out nested objects
            .map(([field, value]) => (
              <React.Fragment key={field}>
                <Grid item xs={1.8}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    {field}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    :
                  </Typography>
                </Grid>
                <Grid item xs={9.2}>
                  <Typography>{value}</Typography>
                </Grid>
              </React.Fragment>
            ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ViewStaff;
