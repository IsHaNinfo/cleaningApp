import { CssBaseline, ThemeProvider } from "@mui/material";
import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import PrivateRoutes from "./Utils/PrivateRoutes.jsx";


import Sidebar from "./scenes/global/Sidebar";
import Topbar from "./scenes/global/Topbar";
import Login from "./scenes/login";

import News from "./scenes/news";
import AddNews from "./scenes/news/AddNews";
import EditNews from "./scenes/news/EditNews";
import ViewNews from "./scenes/news/ViewNews";


import Jobs from "./scenes/jobs"
import AddJob from "./scenes/jobs/AddJob.jsx";
import ViewJob from "./scenes/jobs/ViewJob.jsx"
import EditJob from "./scenes/jobs/EditJob.jsx";

import Clients from "./scenes/clients";
import EditSubscription from "./scenes/subscriptionPackage/EditSubscription";
import NewSubscripion from "./scenes/subscriptionPackage/NewSubscripion";
import ViewSubscription from "./scenes/subscriptionPackage/ViewSubscription";
import Profile from "./scenes/profile";
import ChangePw from "./scenes/profile/ChangePw";
import EditProfile from "./scenes/profile/EditProfile";
import { ColorModeContext, useMode } from "./theme";
import EditSubUser from "./scenes/subscriptionPackage/subscribedUsers/EditSubUser";
import SubscribedUsers from "./scenes/subscriptionPackage/subscribedUsers/Index";
import ViewSubUser from "./scenes/subscriptionPackage/subscribedUsers/ViewSubUser";
import SubscriptionPackage from "./scenes/subscriptionPackage";
import PrivateRoute from "./PrivateRoutes.js";

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

            <Route
              path="/subscription"
              element={
                <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
                  <SubscriptionPackage />
                </PrivateRoute>
              }
            />
            <Route
              path="/subscribedusers"
              element={
                <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
                  <SubscribedUsers />
                </PrivateRoute>
              }
            />
            <Route
              path="/subscribedusers/viewsubscribeduser/:id"
              element={
                <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
                  <ViewSubUser />
                </PrivateRoute>
              }
            />
            <Route
              path="/subscribedusers/editsubscribeduser/:id"
              element={
                <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
                  <EditSubUser />
                </PrivateRoute>
              }
            />
            <Route
              path="/news"
              element={
                <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
                  <News />
                </PrivateRoute>
              }
            />
            <Route
              path="/news/newnews"
              element={
                <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
                  <AddNews />
                </PrivateRoute>
              }
            />
            <Route
              path="/news/viewnews/:id"
              element={
                <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
                  <ViewNews />
                </PrivateRoute>
              }
            />
            <Route
              path="/news/editnews/:id"
              element={
                <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
                  <EditNews />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <PrivateRoute allowedRoles={["admin", "superAdmin", "staff"]}>
                  <Jobs />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobs/newjob"
              element={
                <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
                  <AddJob />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobs/viewjob/:id"
              element={
                <PrivateRoute allowedRoles={["admin", "superAdmin","staff"]}>
                  <ViewJob />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobs/editjob/:id"
              element={
                <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
                  <EditJob />
                </PrivateRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
                  <Clients />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/profile/changepassword"
              element={
                <PrivateRoute allowedRoles={["admin", "superAdmin", "staff"]}>
                  <ChangePw />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute allowedRoles={["admin", "superAdmin", "staff"]}>
                  <EditProfile />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  </ColorModeContext.Provider>
);
}

export default App;
