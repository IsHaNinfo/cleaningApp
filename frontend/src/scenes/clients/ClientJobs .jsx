import {
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    Edit as EditIcon,
  } from "@mui/icons-material";
  import { Box, Button, IconButton, MenuItem, Select, Tooltip, useTheme } from "@mui/material";
  import { DataGrid, GridToolbar } from "@mui/x-data-grid";
  import React, { useEffect, useState } from "react";
  import { useParams, Link } from "react-router-dom";
  import Swal from "sweetalert2";
  import axios from "axios";
  import Header from "../../components/Header";
  import { tokens } from "../../theme";
  import { environment } from "../../environment";
  
  const ClientJobs = () => {
    const { id } = useParams();
    const [jobs, setJobs] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
    const token = localStorage.getItem("token");
  
    useEffect(() => {
      fetchClientJobs();
    }, [id]);
  
    const fetchClientJobs = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(environment.apiUrl + `/job/getFilteredJobs/${id}`, { headers });
        const responseData = response.data;
        if (responseData.success) {
          setJobs(responseData.jobs);
          console.log(jobs);
        } else {
          console.error("Failed to fetch client jobs:", responseData.message);
        }
      } catch (error) {
        console.error("Error fetching client jobs:", error);
      }
    };
  
    const columns = [
      { field: "_id", headerName: "Job ID", flex: 1 },
      { field: "jobName", headerName: "Job Name", flex: 1 },
      { field: "description", headerName: "Description", flex: 2 },
      { field: "jobStatus", headerName: "Status", flex: 1 },
      { field: "startTime", headerName: "Start Time", flex: 1 },
      { field: "isSignOff", headerName: "Signed Off", flex: 1, renderCell: (params) => (params.value ? "Yes" : "No") },
      { field: "noOfhours", headerName: "Hours", flex: 1 },
      { field: "hourRate", headerName: "Rate", flex: 1 },
      { field: "payment", headerName: "Payment", flex: 1 },
    ];
  
    return (
      <Box m="20px">
        <Header title="Client Jobs" subtitle={`Jobs for Client ID: ${id}`} />
        <Box
          m="10px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              fontSize: "14px",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.greenAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.greenAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            },
          }}
        >
          <DataGrid
            rows={jobs}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row._id}
          />
        </Box>
      </Box>
    );
  };
  
  export default ClientJobs;
  