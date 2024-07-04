import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Button, IconButton, Tooltip, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import jsPDF from "jspdf";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const SubscripttionPackage = () => {
  const [data, setData] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://jcgnapi.hasthiya.org/package/getallpackages"
        );
        const result = await response.json();
        if (result.status) {
          const sortedData = result.result
            .map((item) => ({
              id: item.id,
              packageName: item.package_name,
              amount: item.amount,
              features: item.features,
              subscriptionNote: item.subscription_note,
              typeOfSubscription: item.typeOfSubscription,
            }))
            .sort((a, b) => b.id - a.id);
          setData(sortedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const handleViewClick = (id) => {
    console.log(`View clicked for id:`, id);
  };

  const handleEditClick = (id) => {
    console.log(`Edit clicked for id:`, id);
  };

  const deletePckage = async (id) => {
    try {
      const response = await fetch(
        `https://jcgnapi.hasthiya.org/package/deletebyid/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete the subscription package");
      }
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this subscription package!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePckage(id);
          const updatedData = data.filter((item) => item.id !== id);
          setData(updatedData);
          Swal.fire(
            "Deleted!",
            "The subscription package has been deleted.",
            "success"
          );
        } catch (error) {
          console.error("Error deleting subscription package:", error);
          Swal.fire(
            "Error!",
            "Failed to delete subscription package. Please try again later.",
            "error"
          );
        }
      }
    });
  };

  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          "Membership ID",
          "Package Name",
          "Type of Subscription",
          "Charges",
          "Status",
        ],
      ],
      body: data.map(
        ({ id, packageName, typeOfSubscription, amount, status }) => [
          id,
          packageName,
          typeOfSubscription,
          amount,
          status,
        ]
      ),
    });
    doc.save("subscription_data.pdf");
  };

  const columns = [
    { field: "id", headerName: "Membership ID", flex: 0.5 },
    { field: "packageName", headerName: "Package Name", flex: 1 },
    {
      field: "typeOfSubscription",
      headerName: "Type of Subscription",
      flex: 1,
    },
    { field: "amount", headerName: "Charges", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.7,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View">
            <Link to={`/subscription/viewsubcription/${params.row.id}`}>
              <IconButton onClick={() => handleViewClick(params.row.id)}>
                <VisibilityIcon />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Edit">
            <Link to={`/subscription/editsubcription/${params.row.id}`}>
              <IconButton onClick={() => handleEditClick(params.row.id)}>
                <EditIcon />
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
        <Header
          title="Subscription Membership Management"
          subtitle="All the saved subscription Memberships can be found here"
        />
        <Box>
          <Link to={"newsubcription"} style={{ marginRight: "10px" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#6870fa",
                color: "white",
                fontSize: "14px",
                "&:hover": {
                  backgroundColor: "#3e4396",
                },
              }}
            >
              Add New Subscription Membership
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

export default SubscripttionPackage;
