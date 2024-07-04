import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Button, IconButton, Tooltip, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import jsPDF from "jspdf";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../../components/Header";
import { mockDataContacts } from "../../../data/mockData";
import { tokens } from "../../../theme";
const SubscribedUsers = () => {
  const [data, setData] = useState(
    mockDataContacts.map((item) => ({
      ...item,
      status: Math.random() < 0.5 ? "Active" : "Inactive", // randomly assign Active or Inactive
    }))
  );

  const handleViewClick = (id) => {
    console.log(`View clicked id:`, id);
  };

  const handleEditClick = (id) => {
    console.log(`Edit clicked for id:`, id);
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedData = data.map((item) => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    setData(updatedData);
    console.log("Status changed for id:", id, "New status:", newStatus);
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "id", headerName: "User ID" },
    { field: "registrarId", headerName: "Membership ID", flex: 1 },
    { field: "name", headerName: "User Name", flex: 1 },
    { field: "zipCode", headerName: "Type of Subscription", flex: 1 },
    { field: "age", headerName: "Charges", flex: 1 },
    { field: "endDate", headerName: "End Date", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "Actions",
      headerName: "Actions",
      renderCell: (params) => (
        <Box>
          <Tooltip title="View">
            <Link to={`/subscribedusers/viewsubscribeduser/${params.row.id}`}>
              <IconButton onClick={() => handleViewClick(params.row.id)}>
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

  const getRowClassName = (params) => {
    return "row-divider";
  };

  const handleDeleteClick = (id) => {
    const updatedData = data.filter((item) => item.id !== id);
    setData(updatedData);
    console.log("Deleted item with ID:", id);
  };

  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          "User ID",
          "Membership ID",
          "User Name",
          "Type of Subscription",
          "Charges",
          "End Date",
          "Status",
        ],
      ],
      body: data.map(
        ({ id, registrarId, name, zipCode, age, endDate, status }) => [
          id,
          registrarId,
          name,
          zipCode,
          age,
          endDate,
          status,
        ]
      ),
    });
    doc.save("subscribed_users_data.pdf");
  };

  return (
    <Box m="20px">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="-10px"
      >
        <Header
          title="Subscribed Users"
          subtitle="See all the subscribed users"
        />
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
        {/* Export to PDF button */}
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
          Export to PDF
        </Button>
        {/* DataGrid component */}
        <DataGrid
          rows={data}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowClassName={getRowClassName}
        />
      </Box>
    </Box>
  );
};

export default SubscribedUsers;
