import { ArrowDropDownCircleOutlined } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ColorModeContext, tokens } from "../../theme";
const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({
    name: "",
    image: "",
  });
  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch(
          "https://jcgnapi.hasthiya.org/admin/getAdmin"
        );
        const data = await response.json();
        if (data && data.length > 0) {
          setAdminData(data[0]);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  const logoSrc =
    theme.palette.mode === "dark"
      ? "../../assets/logo2.png"
      : "../../assets/logo.png";

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/");
      }
    });
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      backgroundColor={colors.primary[400]}
      p={2}
    >
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="50%"
        overflow="hidden"
        width="100px"
        height="100px"
      >
        <img
          alt="profile-user"
          src={logoSrc}
          style={{
            width: "100%",
            height: "100%",
            cursor: "pointer",
            borderRadius: "50%",
            transform:
              theme.palette.mode === "dark" ? "scale(1.2)" : "scale(1)",
            transition: "transform 0.3s ease",
          }}
        />
      </Box>
      {/* <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <img
          alt="profile-user-2"
          width="100px"
          height="100px"
          src={`./JCGN Logo.png`}
          style={{
            cursor: "pointer",
            borderRadius: "50%",
          }} // Ensure image fills parent box
        />
      </Box> */}

      {/* ICONS */}
      <Box>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon style={{ fontSize: "1.8rem" }} />
          ) : (
            <LightModeOutlinedIcon style={{ fontSize: "1.8rem" }} />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon style={{ fontSize: "1.8rem" }} />
        </IconButton>

        <IconButton
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginRight="20px"
        >
          <img
            alt="profile-user"
            width="50px"
            height="50px"
            src={adminData.image}
            style={{ cursor: "pointer", borderRadius: "50%" }}
          />
          <Typography
            sx={{ display: "flex", flexDirection: "column", m: "10px" }}
            onClick={handleClick}
          >
            <Typography
              variant="h4"
              color={colors.grey[100]}
              fontWeight="bold"
              sx={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              {adminData.name} <ArrowDropDownCircleOutlined />
            </Typography>
            <Typography variant="h5" color={colors.greenAccent[500]}>
              Admin
            </Typography>
          </Typography>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              component={Link}
              to="/profile"
              onClick={handleClose}
              style={{ fontSize: "larger" }}
            >
              <IconButton>
                <AccountCircleIcon />
              </IconButton>
              My Profile
            </MenuItem>
            <MenuItem onClick={handleLogout} style={{ fontSize: "larger" }}>
              <IconButton>
                <ExitToAppIcon />
              </IconButton>
              Logout
            </MenuItem>
          </Menu>
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
