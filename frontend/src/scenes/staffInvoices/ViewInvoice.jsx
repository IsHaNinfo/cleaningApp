import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import { environment } from '../../environment';

const ViewInvoice = () => {
  const { id } = useParams();
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceTitle: "",
    invoiceDescription: "",
    sendDate: "",
    staff: {
      firstName: "",
      lastName: "",
      email: "",
    },
    amount: "",
    invoiceStatus: "",
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchInvoiceDetails();
  }, [id]);

  const fetchInvoiceDetails = async () => {
    try {

       
      const response = await axios.get(environment.apiUrl + `/staffinvoice/getStaffInvoiceById/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`
          }
      });

      const responseData = response.data;

      if (responseData.success) {
        const { invoice } = responseData;
        const { invoiceTitle, invoiceDescription, sendDate, staff, amount, invoiceStatus } = invoice;
        const formattedStaff = {
          firstName: staff.firstName,
          lastName: staff.lastName,
        };
        console.log(formattedStaff)
        setInvoiceDetails({
          invoiceTitle,
          invoiceDescription,
          sendDate,
          staff: formattedStaff,
          amount,
          invoiceStatus,
        });
      } else {
        console.error('Failed to fetch invoice details:', responseData.message);
      }
    } catch (error) {
      console.error('Error fetching invoice details:', error);
    }
  };

  return (
    <Box m="20px" height="70vh" overflow="auto" paddingRight="20px">
      <Header title={`View Staff Invoice ID: ${id}`} subtitle="" />
      <Box ml={"40px"}>
        <Grid container spacing={2}>
          {Object.entries(invoiceDetails)
            .filter(([field]) => field !== "staff") // Filter out nested objects
            .map(([field, value]) => (
              <React.Fragment key={field}>
                <Grid item xs={2}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    :
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography>{value}</Typography>
                </Grid>
              </React.Fragment>
            ))}
          {/* Client Details */}
          <Grid item xs={2}>
            <Typography variant="h5" component="span" fontWeight="bold">
              Staff
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="h5" component="span" fontWeight="bold">
              :
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography>{`${invoiceDetails.staff.firstName} ${invoiceDetails.staff.lastName}`}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ViewInvoice;
