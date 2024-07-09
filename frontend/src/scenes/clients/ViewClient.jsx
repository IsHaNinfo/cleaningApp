import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import axios from "axios";
import { environment } from '../../environment';

const ViewClient = () => {
  const { id } = useParams();
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
    clientStatus: "",
  });

  useEffect(() => {
    fetchClientDetails();
  }, [id]);
  const token = localStorage.getItem("token")

  const fetchClientDetails = async () => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
          };
      const response = await axios.get(environment.apiUrl+`/client/getClientById/${id}`,{headers});
      const responseData = response.data;
      console.log(response)
      if (responseData.success) {
        const { client } = responseData;
        setClientDetails(client);
      } else {
        console.error("Failed to fetch client details:");
      }
    } catch (error) {
      console.error("Error fetching client details:", error);
    }
  };

  return (
    <Box m="20px" height="70vh" overflow="auto" paddingRight="20px">
      <Header title={`View Client ID: ${id}`} subtitle="" />
      <Box ml={"40px"}>
        <Grid container spacing={2}>
          {Object.entries(clientDetails)
         .filter(([field]) => field !== "createdAt" && field !== "__v" && field !== "updatedAt"&& field !== "adminId"  ) // Filter out nested objects
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
}

export default ViewClient;
