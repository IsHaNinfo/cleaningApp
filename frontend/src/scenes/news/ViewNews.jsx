import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";

function ViewNews() {
  const { id } = useParams();
  const [newsDetails, setNewsDetails] = useState({
    id: "",
    description: "",
    Date: "",
    status: "",
  });

  useEffect(() => {
    fetchNewsDetails();
  }, [id]);

  const fetchNewsDetails = async () => {
    try {
      const response = await fetch(
        `https://jcgnapi.hasthiya.org/api/news/getNews/${id}`
      );
      const responseData = await response.json();
      if (responseData.result.status) {
        const modifiedData = {
          ...responseData.result.result,
          Date: responseData.result.result.date.split("T")[0], // Extract only the date part
          status: capitalizeFirstLetter(responseData.result.result.status), // Capitalize status
        };
        setNewsDetails(modifiedData);
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

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <Box m="20px" height="70vh" overflow="auto" paddingRight="20px">
      <Header title={`View News ID: ${id}`} subtitle="" />
      <Box ml={"40px"}>
        <Grid container spacing={2}>
          {Object.entries(newsDetails)
            .filter(([field]) => field !== "date") // Filter out the record with key "date"
            .map(([field, value]) => (
              <React.Fragment key={field}>
                <Grid item xs={1.8}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    {capitalizeFirstLetter(field)}
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

export default ViewNews;
