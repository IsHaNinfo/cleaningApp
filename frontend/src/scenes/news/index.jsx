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
import Header from "../../components/Header";
import { tokens } from "../../theme";

const News = () => {
  const [data, setData] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const fetchNews = async () => {
    try {
      const response = await fetch(
        "https://jcgnapi.hasthiya.org/api/news/getAllNews"
      );
      const responseData = await response.json();
      if (responseData.result.status) {
        const modifiedData = responseData.result.data.map((item) => ({
          ...item,
          date: item.date.split("T")[0],
        }));

        modifiedData.sort((a, b) => b.id - a.id);

        setData(modifiedData);
      } else {
        console.error("Failed to fetch news:", responseData.result.message);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [["News ID", "News Title", "Date"]],
      body: data.map(({ id, description, date }) => [id, description, date]),
    });
    doc.save("news_data.pdf");
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

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this news!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://jcgnapi.hasthiya.org/api/news/deleteNews/${id}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to delete news");
            }

            setData(data.filter((item) => item.id !== id));
            Swal.fire("Deleted!", "The news has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting news:", error);
            Swal.fire(
              "Error!",
              "Failed to delete news. Please try again later.",
              "error"
            );
          });
      }
    });
  };

  const handleEditClick = (id) => {};

  const columns = [
    { field: "id", headerName: "News ID" },
    { field: "description", headerName: "News Description", flex: 1.5 },
    { field: "date", headerName: "Date (YYYY/MM/DD)", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.6,
      renderCell: (params) => (
        <span style={{ textTransform: "capitalize" }}>
          {params.row.status.toLowerCase()}
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
            <Link to={`/news/editnews/${params.row.id}`}>
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
            <Link to={`/news/viewnews/${params.row.id}`}>
              <IconButton>
                <VisibilityIcon />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Delete">
            {/* Use handleDeleteClick to handle the delete action */}
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
        <Header title="News Management" subtitle="Managing the news" />
        <Box>
          <Link to={"/news/newnews"} style={{ marginRight: "10px" }}>
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
              Add a News
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

export default News;
