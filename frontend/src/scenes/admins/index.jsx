import {
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
  } from "@mui/icons-material";
  import EditIcon from "@mui/icons-material/Edit";
  import { Box, Button, IconButton, MenuItem, Select, Tooltip, useTheme } from "@mui/material";
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
  
  const Admin = () => {
    const [data, setData] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
    const token = localStorage.getItem("token");
  
    const fetchAdmins = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`
        };
  
        const response = await axios.get(`${environment.apiUrl}/admin/getAllAdmins`, { headers });
        const responseData = response.data;
        if (responseData.success) {
          const modifiedData = responseData.admins.map((item) => ({
            ...item,
            id: item._id, // Set id for DataGrid row key
          }));
  
          modifiedData.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  
          setData(modifiedData);
        } else {
          console.error("Failed to fetch admins:", responseData.message);
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };
  
    useEffect(() => {
      fetchAdmins();
    }, []);
  
    const exportToPdf = () => {
      const doc = new jsPDF();
      doc.autoTable({
        head: [["ADMIN ID", "User Name", "Email", "Phone Number", "Status"]],
        body: data.map(({ _id, userName, email, status }) => [
          _id,
          userName,
          email,
        status,
        ]),
      });
      doc.save("admin_data.pdf");
    };
  
    const handleDeleteClick = (id) => {
      Swal.fire({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this admin Account!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Delete",
      }).then((result) => {
        if (result.isConfirmed) {
          const headers = {
            Authorization: `Bearer ${token}`
          };
          axios
            .delete(environment.apiUrl + `/user/deleteUser/${id}`, { headers })
            .then((response) => {
              if (response.status !== 200) {
                throw new Error("Failed to delete admin");
              }
  
              setData(data.filter((item) => item.id !== id));
              Swal.fire("Deleted!", "The admin has been deleted.", "success");
            })
            .catch((error) => {
              console.error("Error deleting admin:", error);
              Swal.fire(
                "Error!",
                "Failed to delete admin. Please try again later.",
                "error"
              );
            });
        }
      });
    };
  
    const handleStatusChange = (id, newStatus) => {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to change the status of this admin?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, change it!",
      }).then((result) => {
        if (result.isConfirmed) {
          const headers = {
            Authorization: `Bearer ${token}`
          };
  
          axios
            .patch(environment.apiUrl + `/admin/updateStatus/${id}`, { status: newStatus }, { headers })
            .then((response) => {
              if (response.status !== 200) {
                throw new Error("Failed to update status");
              }
  
              const updatedData = data.map((item) => {
                if (item.id === id) {
                  return { ...item, status: newStatus };
                }
                return item;
              });
              setData(updatedData);
              Swal.fire("Updated!", "The admin status has been updated.", "success");
            })
            .catch((error) => {
              console.error("Error updating admin status:", error);
              Swal.fire(
                "Error!",
                "Failed to update admin status. Please try again later.",
                "error"
              );
            });
        }
      });
    };
  
    const handleEditClick = (id) => {};
  
    const columns = [
      { field: "id", headerName: "ID", flex: 1 },
      {
        field: "userName",
        headerName: "User Name",
        flex: 1,
        renderCell: (params) => params.row.userName,
      },
      { field: "email", headerName: "Email", flex: 1 },
      {
        field: "status",
        headerName: "Status",
        flex: 0.6,
        renderCell: (params) => (
          <Select
            value={params.row.status}
            onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        ),
      },
      {
        field: "Actions",
        headerName: "Actions",
        flex: 0.6,
        renderCell: (params) => (
          <Box>
            <Tooltip title="Edit">
              <Link to={`/admin/editadmin/${params.row.id}`}>
                <IconButton>
                  <EditIcon onClick={() => handleEditClick(params.row.id)} />
                </IconButton>
              </Link>
            </Tooltip>
            <Tooltip title="View">
              <Link to={`/admin/viewadmin/${params.row.id}`}>
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
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="-10px">
          <Header title="Admin Management" subtitle="Managing the Admin Accounts" />
          <Box>
            <Link to={"/admin/createAdmin"} style={{ marginRight: "10px" }}>
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
                Create Admin
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
  
  export default Admin;
  