import AnalyticsIcon from "@mui/icons-material/Analytics";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MicIcon from "@mui/icons-material/MicOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaylistAddCheckOutlinedIcon from "@mui/icons-material/PlaylistAddCheckOutlined";
import PlaylistPlayOutlinedIcon from "@mui/icons-material/PlaylistPlayOutlined";
import SchoolIcon from "@mui/icons-material/School";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { Menu, MenuItem, ProSidebar } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

const Item = ({ title, to, icon, selected, setSelected, children }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const handleSubmenuToggle = () => {
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  return (
    <>
      <MenuItem
        active={selected === title}
        style={{
          color: colors.grey[100],
        }}
        onClick={() => {
          setSelected(title);
          handleSubmenuToggle();
        }}
        icon={icon}
      >
        <Typography>{title}</Typography>
        <Link to={to} />
      </MenuItem>
      {isSubmenuOpen && children}
    </>
  );
};

const Subtopic = ({ title, to, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
        textAlign: "center",
      }}
      onClick={() => setSelected(title)}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "10px 30px 5px 10px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "30px 20 20px 20px",
              color: colors.grey[100],
              textAlign: "center",
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="30px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  Tangora
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <Box
            pl={!isCollapsed ? "20px" : undefined}
            alignItems="left"
            sx={{ marginTop: "20px" }}
            width={!isCollapsed ? "calc(100% + 40px)" : undefined}
          >
    
            {/* <Item
              title="Subscription Options"
              to="/subscription"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            >
              <Subtopic
                title="Subscribed Users"
                to="/subscribedusers"
                selected={selected}
                setSelected={setSelected}
              />{" "}
            </Item>
           
            <Item
              title="News"
              to="/news"
              icon={<MicIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
              <Item
              title="Jobs"
              to="/jobs"
              icon={<WorkOutlineIcon />}
              selected={selected}
              setSelected={setSelected}
            />

              <Item
              title="Clients"
              to="/clients"
              icon={<BusinessCenterOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
             <Item
              title="Staff"
              to="/staff"
              icon={<BusinessCenterOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
