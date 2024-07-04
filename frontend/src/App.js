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
                  element={<SubscriptionPackage></SubscriptionPackage>}
                />
                <Route
                  path="/subscribedusers"
                  element={<SubscribedUsers></SubscribedUsers>}
                />
                <Route
                  path="/subscribedusers/viewsubscribeduser/:id"
                  element={<ViewSubUser></ViewSubUser>}
                />
                <Route
                  path="/subscribedusers/editsubscribeduser/:id"
                  element={<EditSubUser></EditSubUser>}
                />
               

                <Route path="/news" element={<News></News>}></Route>
                <Route
                  path="/news/newnews"
                  element={<AddNews></AddNews>}
                ></Route>

                <Route
                  path="/news/viewnews/:id"
                  element={<ViewNews></ViewNews>}
                ></Route>
                <Route
                  path="/news/editnews/:id"
                  element={<EditNews></EditNews>}
                ></Route>

<Route
                  path="/profile/changepassword"
                  element={<ChangePw></ChangePw>}
                ></Route>
                <Route
                  path="/profile/editprofile"
                  element={<EditProfile></EditProfile>}
                ></Route>
                
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
