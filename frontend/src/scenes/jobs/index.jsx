import {
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
  } from "@mui/icons-material";
  import EditIcon from "@mui/icons-material/Edit";
  import { Box, Button, IconButton, Tooltip, useTheme } from "@mui/material";
  import { DataGrid, GridToolbar } from "@mui/x-data-grid";
  import jsPDF from "jspdf";
  import "jspdf-autotable";
  import React, { useEffect, useState } from "react";
  import { Link } from "react-router-dom";
  import Swal from "sweetalert2";
  import axios from "axios";
  import Header from "../../components/Header";
  import { tokens } from "../../theme";
import { environment } from "../../environment";
  
  const Jobs = () => {
    const [data, setData] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
    const fetchJobs = async () => {
      try {
        const response = await axios.get(environment.apiUrl + "/job/getAllJobs");
        const responseData = response.data;
        if (responseData.success) {
          const modifiedData = responseData.jobs.map((item) => ({
            ...item,
            startTime: item.startTime.split("T")[0],
            id: item._id, // Set id for DataGrid row key
          }));
  
          modifiedData.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  
          setData(modifiedData);
        } else {
          console.error("Failed to fetch jobs:", responseData.message);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
  
    useEffect(() => {
      fetchJobs();
    }, []);
  
    const exportToPdf = () => {
      const doc = new jsPDF();
      doc.autoTable({
        head: [["Job ID", "Job Name", "Client", "Assigned Staff", "Start Time"]],
        body: data.map(({ _id, jobName, client, assignedStaff, startTime }) => [
          _id,
          jobName,
          `${client.firstName} ${client.lastName}`,
          `${assignedStaff.firstName} ${assignedStaff.lastName}`,
          startTime,
        ]),
      });
      doc.save("jobs_data.pdf");
    };
  
    const handleStatusChange = (id, newStatus) => {
      const updatedData = data.map((item) => {
        if (item.id === id) {
          return { ...item, jobStatus: newStatus };
        }
        return item;
      });
      setData(updatedData);
      console.log("Status changed for id:", id, "New status:", newStatus);
    };
  
    const handleDeleteClick = (id) => {
      Swal.fire({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this job!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Delete",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(environment.apiUrl + `/job/deleteJobById/${id}`)
            .then((response) => {
              if (response.status !== 200) {
                throw new Error("Failed to delete job");
              }
  
              setData(data.filter((item) => item.id !== id));
              Swal.fire("Deleted!", "The job has been deleted.", "success");
            })
            .catch((error) => {
              console.error("Error deleting job:", error);
              Swal.fire(
                "Error!",
                "Failed to delete job. Please try again later.",
                "error"
              );
            });
        }
      });
    };
  
    const handleEditClick = (id) => {};
  
    const columns = [
      { field: "id", headerName: "Job ID" },
      { field: "jobName", headerName: "Job Name", flex: 1.5 },
      {
        field: "client",
        headerName: "Client",
        flex: 1,
        renderCell: (params) =>
          `${params.row.client.firstName} ${params.row.client.lastName}`,
      },
      {
        field: "assignedStaff",
        headerName: "Assigned Staff",
        flex: 1,
        renderCell: (params) =>
          `${params.row.assignedStaff.firstName} ${params.row.assignedStaff.lastName}`,
      },
      { field: "startTime", headerName: "Start Time (YYYY/MM/DD)", flex: 1 },
      {
        field: "jobStatus",
        headerName: "Status",
        flex: 0.6,
        renderCell: (params) => (
          <span style={{ textTransform: "capitalize" }}>
            {params.row.jobStatus.toLowerCase()}
          </span>
        ),
      },
      {
        field: "Actions",
        headerName: "Actions",
        flex: 0.6,
        renderCell: (params) => (
          <Box>
            <Tooltip title="Edit">
              <Link to={`/jobs/editjob/${params.row.id}`}>
                <IconButton>
                  <EditIcon
                    onClick={() =>
                      handleEditClick(params.row.id, params.row.role)
                    }
                  />
                </IconButton>
              </Link>
            </Tooltip>
            <Tooltip title="View">
              <Link to={`/jobs/viewjob/${params.row.id}`}>
                <IconButton>
                  <VisibilityIcon />
                </IconButton>
              </Link>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={() => handleDeleteClick(params.row.id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ];
  
    return (
      <Box m="20px">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="-10px"
        >
          <Header title="Jobs Management" subtitle="Managing the jobs" />
          <Box>
            <Link to={"/jobs/newjob"} style={{ marginRight: "10px" }}>
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
                Add a Job
              </Button>
            </Link>
          </Box>
        </Box>
        <Box
          m="10px 0 0 0"
          height="55vh"
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
          <Button
            variant="contained"
            onClick={exportToPdf}
            sx={{
              backgroundColor: "#4caf50",
              color: "white",
              fontSize: "10px",
              "&:hover": {
                backgroundColor: "#388e3c",
              },
            }}
          >
            Export as PDF
          </Button>
          <DataGrid
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>
    );
  };
  
  export default Jobs;
  