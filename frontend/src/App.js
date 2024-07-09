import { CssBaseline, ThemeProvider } from "@mui/material";
import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import PrivateRoutes from "./Utils/PrivateRoutes.jsx";


import Sidebar from "./scenes/global/Sidebar";
import Topbar from "./scenes/global/Topbar";
import Login from "./scenes/login";

import Jobs from "./scenes/jobs"
import AddJob from "./scenes/jobs/AddJob.jsx";
import ViewJob from "./scenes/jobs/ViewJob.jsx"
import EditJob from "./scenes/jobs/EditJob.jsx";
import CompletedJobs from "./scenes/jobs/completedJobs";

import Staff from "./scenes/staff";
import ViewStaff from "./scenes/staff/ViewStaff.jsx";
import AddStaff from "./scenes/staff/AddStaff.jsx";
import EditStaff from "./scenes/staff/EditStaff.jsx";

import Clients from "./scenes/clients";
import AddClient from "./scenes/clients/AddClient.jsx";
import ViewClient from "./scenes/clients/ViewClient.jsx";
import EditClient from "./scenes/clients/EditClient.jsx";

import ChangePw from "./scenes/profile/ChangePw";
import EditProfile from "./scenes/profile/EditProfile";
import { ColorModeContext, useMode } from "./theme";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();

  // Check if the current route is the login page
  const isLoginPage = location.pathname === "/";

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!isLoginPage && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            {!isLoginPage && <Topbar setIsSidebar={setIsSidebar} />}
            <Routes>
              <Route path="/" element={<Login />} />

                <Route path="/jobs" element={<Jobs></Jobs>}></Route>
                <Route path="/jobs/newjob" element={<AddJob></AddJob>}></Route>
                <Route path="/jobs/viewjob/:id"element={<ViewJob></ViewJob>}></Route>
                <Route path="/jobs/editjob/:id" element={<EditJob></EditJob>}></Route>

                <Route path="/completedjobs" element={<CompletedJobs></CompletedJobs>}></Route>

                <Route path="/clients" element={<Clients></Clients>}></Route>
                <Route path="/clients/newclient" element={<AddClient></AddClient>}></Route>
                <Route path="/clients/viewclient/:id" element={<ViewClient></ViewClient>}></Route>
                <Route path="/clients/editclient/:id" element={<EditClient></EditClient>}></Route>

                <Route path="/staff" element={<Staff></Staff>}></Route>
                <Route path="/staff/newstaff" element={<AddStaff></AddStaff>}></Route>
                <Route path="/staff/viewstaff/:id" element={<ViewStaff></ViewStaff>}></Route>
                <Route path="/staff/editStaff/:id" element={<EditStaff></EditStaff>}></Route>

                <Route path="/profile/changepassword"element={<ChangePw></ChangePw>} ></Route>
                <Route path="/profile" element={<EditProfile></EditProfile>}></Route>
                
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
