import {
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
  } from "@mui/icons-material";
  import EditIcon from "@mui/icons-material/Edit";
  import {
    Box,
    Button,
    IconButton,
    Tooltip,
    useTheme,
    Select,
    MenuItem,
    Typography,
    TextField,
  } from "@mui/material";
  import { DataGrid, GridToolbar } from "@mui/x-data-grid";
  import jsPDF from "jspdf";
  import "jspdf-autotable";
  import React, { useEffect, useState } from "react";
  import { Link } from "react-router-dom";
  import Swal from "sweetalert2";
  import axios from "axios";
  import Header from "../../components/Header";
  import { tokens } from "../../theme";
  import { jwtDecode } from "jwt-decode";
  import { environment } from '../../environment';


  const Jobs = () => {
    const [data, setData] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
    
    
  
    const getUserIdFromToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          return decodedToken._id; // Adjust according to your token structure
        } catch (error) {
          console.error("Error decoding token:", error);
          return null;
        }
      }
      return null;
    };

    const getUserRoleFromToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          return decodedToken.role; // Adjust according to your token structure
        } catch (error) {
          console.error("Error decoding token:", error);
          return null;
        }
      }
      return null;
    };
    const userRole = getUserRoleFromToken();
    const shouldShowButton = userRole !== "staff";
  
    const userId = getUserIdFromToken();
    const formatTime = (dateTime) => {
      if (!dateTime) return null;
      const time = new Date(dateTime);
      return time.toLocaleTimeString("en-CA", { hour: '2-digit', minute: '2-digit', second: '2-digit',hour12: false, });
    };
  
    // const fetchJobs = async () => {
    //   try {
    //     let response;
    //     if (userRole === "staff") {
    //       response = await axios.get(environment.apiUrl + `/job/getJobsbyStaff/${userId}`);
    //     } else {
    //       response = await axios.get(environment.apiUrl + "/job/getAllJobs");
    //     }
  
    //     const responseData = response.data;
    //     if (responseData.success) {
          
    //       const modifiedData = responseData.jobs.map((item) => ({
    //         ...item,
    //         startTime: item.startTime.split("T")[0],
    //         signInTime:formatTime(item.signInTime),
    //         signOffTime:formatTime(item.signOffTime),
    //         id: item._id, // Set id for DataGrid row key
    //       }));
  
    //       modifiedData.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  
    //       setData(modifiedData);
    //     } else {
    //       console.error("Failed to fetch jobs:", responseData.message);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching jobs:", error);
    //   }
    // };

    const fetchJobs = async () => {
      try {
        let url;
        if (userRole === "staff") {
          url = environment.apiUrl + `/job/getJobsbyStaff/${userId}`;
        } else {
          url = environment.apiUrl + "/job/getAllJobs";
        }
  
        if (startDate && endDate) {
          url += `?startDate=${startDate}&endDate=${endDate}`;
        }
  
        const response = await axios.get(url);
        const responseData = response.data;
        if (responseData.success) {
          const modifiedData = responseData.jobs.map((item) => ({
            ...item,
            startTime: item.startTime.split("T")[0],
            signInTime: formatTime(item.signInTime),
            signOffTime: formatTime(item.signOffTime),
            id: item._id, // Set id for DataGrid row key
          }));
  
          modifiedData.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  
          setData(modifiedData);
        } else {
          console.error("Failed to fetch jobs:", responseData.message);
        }
      } catch (error) {
        if(error.response.data.message === 'Jobs not found'){
          setData([])
        }
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
          `${client.firstName} ${client.lastName} `,
          `${assignedStaff.firstName} ${assignedStaff.lastName}`,
          startTime,
        ]),
      });
      doc.save("jobs_data.pdf");
    };
  
    const handleStatusChange = async (id, newStatus) => {
      try {
        const response = await axios.patch(
          environment.apiUrl + `/job/updateStatus/${id}`,
          { jobStatus: newStatus }
        );
        if (response.data.success) {
          setData((prevData) =>
            prevData.map((item) =>
              item.id === id ? { ...item, jobStatus: newStatus } : item
            )
          );
          Swal.fire("Updated!", "Job status has been updated.", "success");
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Error updating job status:", error);
        Swal.fire("Error!", "Failed to update job status. Please try again later.", "error");
      }
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
              Swal.fire("Error!", "Failed to delete job. Please try again later.", "error");
            });
        }
      });
    };
  
    const handleEditClick = (id) => { };

    const handleSignInSignOut = async (id,staffId, isSignedIn) => {
      try {
        let response;
        if (!isSignedIn) {
          response = await axios.put(environment.apiUrl + `/job/signInJob/${id}`,{staffId:staffId});
        } else {
          response = await axios.put(environment.apiUrl + `/job/signOffJob/${id}`);
        }
    
        if (response.data.success) {
          await fetchJobs();
          const updatedJob = response.data.job;
          setData((prevData) =>
            prevData.map((item) =>
              item.id === id ? { ...item, ...updatedJob } : item
            )
          );
          Swal.fire("Updated!", `Job has been ${!isSignedIn ? 'signed in' : 'signed out'}.`, "success");
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error(`Error ${!isSignedIn ? 'signing in' : 'signing out'} job:`, error);
        Swal.fire("Error!", `Failed to ${!isSignedIn ? 'sign in' : 'sign out'} job. Please try again later.`, "error");
      }
    };

    const handleViewJobs = () => {
      fetchJobs();
    };
    
    
  
    const columns = [
      { field: "id", headerName: "Job ID" },
      { field: "jobName", headerName: "Job Name", flex: 1 },
      {
        field: "client",
        headerName: "Client",
        flex: 0.8,
        renderCell: (params) =>
          `${params.row.client.firstName} ${params.row.client.lastName}`,
      },
      {
        field: "assignedStaff",
        headerName: "Assigned Staff",
        flex: 0.8,
        renderCell: (params) =>
          `${params.row.assignedStaff.firstName} ${params.row.assignedStaff.lastName}`,
      },
      { field: "startTime", headerName: "Start Time (YYYY/MM/DD)", flex: 0.6 },
      {
        field: "signInTime",
        headerName: "Sign In Time",
        flex: 0.5,
      },
      {
        field: "signOffTime",
        headerName: "Sign Out Time",
        flex: 0.5,
      },
      {
        field: "jobStatus",
        headerName: "Status",
        flex: 0.6,
        renderCell: (params) => (
          <Select
            value={params.row.jobStatus}
            onChange={(e) => handleStatusChange(params.row.id,e.target.value)}
          >
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        ),
        
      },
      {
        field: "signInSignOut",
        headerName: "Sign In/Sign Out",
        flex: 0.6,
        renderCell: (params) => {
          const isSignedIn = !!params.row.signInTime && !params.row.signOutTime;
          const isSignedOut = !!params.row.signOffTime;
          return (
            <Button
              variant="contained"
              color={isSignedIn ? "secondary" : "primary"}
              disabled={isSignedOut}
              onClick={() => handleSignInSignOut(params.row.id,params.row.assignedStaff._id, isSignedIn)}
            >
               {isSignedOut ? "Signed Out" : isSignedIn ? "Sign Out" : "Sign In"}
            </Button>
          );
        },
        hide: userRole !== "staff"
      },
      {
        field: "Actions",
        headerName: "Actions",
        flex: 0.6,
        renderCell: (params) => (
          <Box>{shouldShowButton &&
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
            }
            
            <Tooltip title="View">
              <Link to={`/jobs/viewjob/${params.row.id}`}>
                <IconButton>
                  <VisibilityIcon />
                </IconButton>
              </Link>
            </Tooltip>
            {shouldShowButton &&
            <Tooltip title="Delete">
            <IconButton onClick={() => handleDeleteClick(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>}
            
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
          {shouldShowButton && (
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
          )}
        </Box>
        {/* <Box
          display="flex"
          justifyContent="flex-start"
          marginTop="10px"
          marginBottom="20px"
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
        </Box> */}
<Box display="flex" justifyContent="flex-start" alignItems="center" marginBottom="20px" gap="10px">
  <Box>
    <Typography fontWeight="bold" fontSize="16px">From</Typography>
    <Box >
      <TextField
        fullWidth
        variant="outlined"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        name="startTime"
      />
    </Box>
  </Box>
  <Box>
    <Typography fontWeight="bold" fontSize="16px">To</Typography>
    <Box>
      <TextField
        fullWidth
        variant="outlined"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        name="endTime"
      />
    </Box>
  </Box>
  <Button
    variant="contained"
    onClick={handleViewJobs}
    sx={{
      backgroundColor: "#4caf50",
      color: "white",
      fontSize: "10px",
      "&:hover": {
        backgroundColor: "#388e3c",
      },
    }}
    disabled={(!startDate && endDate) || (startDate && !endDate)}
  >
    View Jobs
  </Button>
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
  