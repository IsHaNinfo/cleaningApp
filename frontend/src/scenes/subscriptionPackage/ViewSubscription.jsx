import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";

function ViewSubscription() {
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://jcgnapi.hasthiya.org/package/getPackgeById/${id}`
        );
        const result = await response.json();
        if (result.status) {
          const packageData = result.result;
          const formattedData = {
            "Package Name": packageData.package_name,
            Amount: `$${packageData.amount}`,
            Features: packageData.features.join(", "),
            "Type of Subscription": packageData.typeOfSubscription,
            // Status: "Active", // Assuming status is always active as it is not provided in the API response
            "Subscription Note": packageData.subscription_note,
          };
          setUserDetails(formattedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!userDetails) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box m="20px" height="80vh" overflow="auto" paddingRight="20px">
      <Header title={`View Subscription ID ${id}`} subtitle="" />
      <Box ml={"40px"}>
        <Grid container spacing={2}>
          {Object.entries(userDetails).map(([field, value]) => (
            <React.Fragment key={field}>
              <Grid item xs={2}>
                <Typography
                  variant="h5"
                  component="span"
                  fontWeight="bold"
                  mt={3}
                >
                  {field}:
                </Typography>{" "}
              </Grid>
              <Grid item xs={1}>
                :
              </Grid>
              <Grid item xs={9}>
                <Typography variant="h5" component="span" mt={3} mr={2}>
                  {value}
                </Typography>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default ViewSubscription;
