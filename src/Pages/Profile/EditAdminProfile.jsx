import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import app from "../../firebase";
import { css } from "@emotion/react";
import { PropagateLoader } from "react-spinners";
import Notifications from "../../Components/Notifications";

const EditAdminProfile = () => {
  //Get id from local storage
  const userId = localStorage.getItem("Token");
  const [loading, setLoading] = useState(false);
  const [btnLoadingUpdate, setBtnLoadingUpdate] = useState(false);
  const [btnLoadingReset, setBtnLoadingReset] = useState(false);

  //Fetch user data from backend
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [profileImagePath, setProfileImagePath] = useState("");
  const [error, setError] = useState("");
  const [updateError, setupdateError] = useState({
    firstNameError: "",
    lastNameError: "",
    phoneNoError: "",
  });
  const token = localStorage.getItem("Token");

  //password reset function
  const resetPassword = async (e) => {
    e.preventDefault();
    setBtnLoadingReset(true);
    try {
      if (newPassword !== newConfirmPassword) {
        setError("Passwords do not match");
      } else if (newPassword.length < 6) {
        setError("Password must be at least 6 characters");
      } else {
        const url = `https://rwa-webapp.azurewebsites.net/api/admin/ResetPassword`;
        const data = { oldPassword: oldPassword, newPassword: newPassword };
        const config = {
          headers: {
            Authorization: `${token}`,
          },
        };
        await axios.patch(url, data, config).then((res) => {
          if (res.data.status) {
            setNotify({
              isOpen: true,
              message: "Password Updated Successfully",
              type: "success",
            });
            localStorage.removeItem("Token");
            setTimeout(() => (window.location.href = "/login"), 1500);
          }
        });
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
        setBtnLoadingReset(false);
      }
    }
  };

  //Send token to backend to get user data with header authorization
  const fetchUser = async () => {
    setLoading(true);
    const res = await axios.get(
      `https://rwa-webapp.azurewebsites.net/api/admin/AdminProfile`,
      {
        headers: {
          Authorization: `${userId}`,
        },
      }
    );
    setFirstName(res.data.logedAdmin.firstName);
    setLastName(res.data.logedAdmin.lastName);
    setEmail(res.data.logedAdmin.email);
    setPhoneNo(res.data.logedAdmin.phoneNo);
    setProfileImagePath(res.data.logedAdmin.profileImagePath);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  //Alert Notification
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const personalInfoUpdate = async (e) => {
    e.preventDefault();
    setBtnLoadingUpdate(true);

    const PhoneNumberRegex = new RegExp("^[0-9-+]{9,15}$");
    const spetialCharaterRegex = new RegExp("[^A-Za-z\\s]");

    if (spetialCharaterRegex.test(firstName)) {
      var firstNameError =
        "First Name should not contain special characters and numbers";
    } else {
      var firstNameError = "";
    }
    if (spetialCharaterRegex.test(lastName)) {
      var lastNameError =
        "Last Name should not contain special characters and numbers";
    } else {
      var lastNameError = "";
    }

    if (!PhoneNumberRegex.test(phoneNo)) {
      var phoneNoError = "Phone Number must be a 10 digit number";
    } else {
      var phoneNoError = "";
    }

    setupdateError({
      firstNameError,
      lastNameError,
      phoneNoError,
    });

    if (!firstNameError && !lastNameError && !phoneNoError) {
      try {
        if (imageUrl) {
          // Your image upload logic...
        } else {
          const updatedProfile = {
            firstName,
            lastName,
            phoneNo,
          };
          await axios.patch(
            "https://rwa-webapp.azurewebsites.net/api/admin/UpdateAdmin",
            updatedProfile,
            {
              headers: {
                Authorization: `${userId}`,
              },
            }
          );
        }
        setNotify({
          isOpen: true,
          message: "Profile Updated Successfully",
          type: "success",
        });
        setTimeout(() => (window.location.href = "/profile"), 1500);
      } catch (error) {
        console.error(error);
        setNotify({
          isOpen: true,
          message: "Error updating Admin profile !",
          type: "error",
        });
      } finally {
        setBtnLoadingUpdate(false);
      }
    } else {
      setBtnLoadingUpdate(false);
    }
  };

  const OnReset = () => {
    fetchUser();
  };

  return (
    <>
      {loading ? (
        <div
          className="loader"
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            position: "fixed",
            top: "50%",
            left: "50%",
            width: "100%",
            height: "100%",
            zIndex: 999,
          }}
        >
          <PropagateLoader
            color={"#1A97F5"}
            loading={loading}
            css={override}
            size={20}
          />
        </div>
      ) : (
        <div className="add-new-admin">
          <div className="topic-admin">Edit My Profile</div>

          <div
            className="personal-info-container"
            style={{
              display: "flex",
            }}
          >
            <form className="addNewAdmin-form">
              <div
                className="form-left"
                style={{
                  width: "100%",
                }}
              >
                <div className="topic mb-4">Personal Information</div>
                <div className="input-box">
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                  />
                  <label>First Name</label>
                </div>
                {updateError.firstNameError && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "red",
                      marginTop: "-10px",
                    }}
                  >
                    {updateError.firstNameError}
                  </div>
                )}
                <div className="input-box">
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                  />
                  <label>Last Name</label>
                </div>
                {updateError.lastNameError && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "red",
                      marginTop: "-10px",
                    }}
                  >
                    {updateError.lastNameError}
                  </div>
                )}

                <div className="input-box">
                  <input
                    type="text"
                    required
                    value={phoneNo}
                    onChange={(e) => {
                      setPhoneNo(e.target.value);
                    }}
                    maxLength="10"
                  />
                  <label>Contact Number</label>
                </div>
                {updateError.phoneNoError && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "red",
                      marginTop: "-10px",
                    }}
                  >
                    {updateError.phoneNoError}
                  </div>
                )}
                <div className="input-box">
                  <input
                    type="text"
                    required
                    value={email}
                    // onChange={(e) => {
                    //   setEmail(e.target.value);
                    // }}
                  />
                  <label>Email</label>
                </div>

                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontWeight: "200",
                    marginBottom: "10px",
                    marginTop: "-10px",
                  }}
                >
                  Upload Image <MdCloudUpload style={{ color: "red" }} />
                </span>

                <div className="input-box">
                  <input
                    type="file"
                    style={{ padding: "8px 20px", marginTop: "-22px" }}
                    autoFocus={true}
                    accept="image/*"
                    onChange={(e) => {
                      setImageUrl(e.target.files[0]);
                    }}
                  />
                </div>
                <div
                  className="button-container"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                  }}
                >
                  <input
                    type="reset"
                    className="update-btn"
                    style={{
                      cursor: "pointer",
                      backgroundColor: "#17BF9E",
                      width: "150px",
                      color: "white",
                      height: "40px",
                      borderRadius: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
                    }}
                    value="Reset"
                    onClick={OnReset}
                  />

                  <button
                    type="submit"
                    className={`update-btn ${
                      btnLoadingUpdate ? "disabled" : ""
                    }`}
                    disabled={btnLoadingUpdate}
                    onClick={personalInfoUpdate}
                    style={{
                      cursor: btnLoadingUpdate ? "not-allowed" : "pointer",
                      backgroundColor: btnLoadingUpdate ? "#ccc" : "#1a97f5",
                      width: "150px",
                      color: "white",
                      height: "40px",
                      borderRadius: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
                      border: "none",
                      outline: "none",
                    }}
                  >
                    {btnLoadingUpdate ? "Updating..." : "Update"}
                  </button>
                </div>
                <br />
                <br />
              </div>
            </form>
            <form onSubmit={resetPassword}>
              <div
                className="vl"
                style={{
                  borderLeft: "1px solid #888181",
                  height: "500px",
                  marginTop: "50px",
                }}
              ></div>
              <div
                className="form-right"
                style={{
                  width: "100%",
                }}
              >
                <div
                  className="topic"
                  style={{
                    marginTop: "90px",
                  }}
                >
                  Reset Password
                </div>

                <div
                  className="input-box"
                  style={{
                    marginTop: "20px",
                  }}
                >
                  <input
                    type="password"
                    required
                    onChange={(e) => {
                      setOldPassword(e.target.value);
                    }}
                  />
                  <label>Old Password</label>
                </div>

                <div className="input-box">
                  <input
                    type="password"
                    required
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                    }}
                  />
                  <label>New Password</label>
                </div>

                <div className="input-box">
                  <input
                    type="password"
                    required
                    onChange={(e) => {
                      setNewConfirmPassword(e.target.value);
                    }}
                  />
                  <label>Confirm New Password</label>
                </div>
                {error && (
                  <div
                    style={{
                      width: "100%",
                      padding: "15px",
                      margin: "5px 0",
                      fontSize: "14px",
                      backgroundColor: "#f34646",
                      color: "white",
                      borderRadius: "5px",
                      textAlign: "center",
                    }}
                  >
                    {error}
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  <button
                    className={`update-btn ${
                      btnLoadingReset ? "disabled" : ""
                    }`}
                    disabled={btnLoadingReset}
                    style={{
                      cursor: btnLoadingReset ? "not-allowed" : "pointer",
                      backgroundColor: btnLoadingReset ? "#ccc" : "#1a97f5",
                      width: "150px",
                      color: "white",
                      height: "40px",
                      borderRadius: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
                      border: "none",
                      outline: "none",
                    }}
                    type="submit"
                  >
                    {btnLoadingReset ? "Resetting..." : "Reset"}
                  </button>
                </div>
              </div>
            </form>
          </div>
          <Notifications notify={notify} setNotify={setNotify} />
        </div>
      )}
    </>
  );
};

const override = css`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
`;

export default EditAdminProfile;
