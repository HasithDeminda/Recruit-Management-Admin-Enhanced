import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar, Footer, Sidebar, ThemeSettings } from "./Components";
import { Ecommerce, FeaturedJobs, Users, Customers } from "./Pages";
import "./App.css";
import { useStateContext } from "./Contexts/ContextProvider";
import Login from "./Pages/Auth/Login/Login";
import Signup from "./Pages/Auth/Signup/Signup";
import Landing from "./Pages/Landing/Landing";
import ForgotPw from "./Pages/Auth/Forgot_Password/ForgotPw";
import ResetPw from "./Pages/Auth/Reset_Password/ResetPw";
import CheckEmail from "./Pages/Auth/Signup/CheckEmail";
import AddJobs from "./Pages/Jobs/AddJobs";
import ProfileContent from "./Pages/Profile/ProfileContent";
import AddNewAdmin from "./Pages/Profile/AddNewAdmin";
import AdminViewFeedbacks from "./Pages/Feedbacks/AdminViewFeedbacks";
import EditAdminProfile from "./Pages/Profile/EditAdminProfile";
import Announcements from "./Pages/Announcements/Announcements";
import NewAnnouncement from "./Pages/Announcements/NewAnnouncement";
import EditAnnouncement from "./Pages/Announcements/EditAnnouncement";
import UpdateJobs from "./Pages/Jobs/UpdateJobs";
import UpdateUsers from "./Pages/Users/UpdateUsers";
import Applications from "./Pages/Applications/Applications";
import JobDetails from "./Pages/Jobs/JobDetails";
import UserDetails from "./Pages/Users/UserDetails";

const App = () => {
  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    activeMenu,
    themeSettings,
  } = useStateContext();

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("colorMode");
    const currentThemeMode = localStorage.getItem("themeMode");
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  const Token = localStorage.getItem("Token");
  const isLoggedIn = Token ? true : false;

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <BrowserRouter>
        {isLoggedIn === true ? (
          <div className="flex relative dark:bg-main-dark-bg">
            <>
              {activeMenu ? (
                <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
                  <Sidebar />
                </div>
              ) : (
                <div className="w-0 dark:bg-secondary-dark-bg">
                  <Sidebar />
                </div>
              )}

              <div
                className={
                  activeMenu
                    ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  "
                    : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
                }
              >
                <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
                  <Navbar />
                </div>

                <div>
                  {themeSettings && <ThemeSettings />}

                  <Routes>
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route exact path="/home" element={<Ecommerce />} />

                    {/* pages  */}

                    <Route path="/Jobs" element={<FeaturedJobs />} />
                    <Route path="/Users" element={<Users />} />
                    <Route
                      path="/Users/update-users/:id"
                      element={<UpdateUsers />}
                    />
                    <Route path="/Users/view/:id" element={<UserDetails />} />

                    <Route path="/Applications" element={<Applications />} />
                    <Route
                      path="/Applications/view/:id"
                      element={<JobDetails />}
                    />
                    <Route path="/Jobs/view/:id" element={<JobDetails />} />
                    <Route path="/Jobs/new-job" element={<AddJobs />} />
                    <Route
                      path="/jobs/update-jobs/:id"
                      element={<UpdateJobs />}
                    />
                    <Route path="/profile" element={<ProfileContent />} />
                    <Route path="/newAdmin" element={<AddNewAdmin />} />
                    <Route path="/Feedbacks" element={<AdminViewFeedbacks />} />
                    <Route
                      path="/editAdminProfile"
                      element={<EditAdminProfile />}
                    />
                    <Route path="/Announcements" element={<Announcements />} />
                    <Route
                      path="/Announcements/new-announcement"
                      element={<NewAnnouncement />}
                    />

                    <Route
                      path="/Announcements/update-announcement/:id"
                      element={<EditAnnouncement />}
                    />
                  </Routes>
                </div>
                <Footer />
              </div>
            </>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgotpw" element={<ForgotPw />} />
            <Route path="/resetpw/:link" element={<ResetPw />} />
            <Route path="/notice" element={<CheckEmail />} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
};

export default App;
