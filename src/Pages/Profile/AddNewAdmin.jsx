import React, { useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import axios from "axios";
import "./AddNewAdmin.scss";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../../firebase";
import Notifications from "../../Components/Notifications";

const AddNewAdmin = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setcPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [profileImagePath, setprofileImagePath] = useState("");
  const [error, seterror] = useState("");
  const [customErrors, setCustomErrors] = useState({
    firstNameError: "",
    lastNameError: "",
    phoneNumError: "",
    emailError: "",
  });

  //Alert Notification
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const AdminRegister = async (e) => {
    e.preventDefault();
    try {
      const PhoneNumberRegex = new RegExp("^[0-9-+]{9,15}$");
      const EmailRegex = new RegExp(
        "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
      );
      const spetialCharaterRegex = new RegExp("[^A-Za-z\\s]");
      if (spetialCharaterRegex.test(firstName)) {
        var firstNameError =
          "First name can not contain special characters and numbers";
      } else {
        var firstNameError = "";
      }

      if (spetialCharaterRegex.test(lastName)) {
        var lastNameError =
          "Last name can not contain special characters and numbers";
      } else {
        var lastNameError = "";
      }

      if (!PhoneNumberRegex.test(phoneNo)) {
        var phoneNumError = "Phone Number must be a 10 Numbers";
      } else {
        var phoneNumError = "";
      }

      if (!EmailRegex.test(email)) {
        var emailError = "Invalid Email Address";
      } else {
        var emailError = "";
      }

      setCustomErrors({
        firstNameError,
        lastNameError,
        phoneNumError,
        emailError,
      });

      if (!firstNameError && !lastNameError && !phoneNumError && !emailError) {
        if (password !== cPassword) {
          seterror("Passwords do not match !");
        } else if (password.length < 6) {
          seterror("Password must be at least 6 characters !");
        } else {
          if (imageUrl) {
            var fileName = new Date().getTime().toString() + imageUrl.name;
            const storage = getStorage(app);
            const storageRef = ref(
              storage,
              "/Admin/Profile Images/" + fileName
            );

            const uploadTask = uploadBytesResumable(storageRef, imageUrl);
            //Upload the file to Firebase Storage
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + " % done");
                switch (snapshot.state) {
                  case "paused":
                    console.log("Upload is paused");
                    break;
                  case "running":
                    console.log("Upload is running");
                    break;
                }
              },
              (error) => {
                // Handle unsuccessful uploads
              },
              () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((imageUrl) => {
                  console.log("File available at :", imageUrl);

                  const data = {
                    firstName,
                    lastName,
                    email,
                    phoneNo,
                    imageUrl,
                    password,
                    profileImagePath: "/Admin/Profile Images/" + fileName,
                  };
                  console.log(data);
                  axios
                    .post(
                      "https://rwa-webapp.azurewebsites.net/api/admin/Register",
                      data
                    )
                    .then((res) => {
                      console.log(res);
                      setNotify({
                        isOpen: true,
                        message: "Admin Account Created",
                        type: "success",
                      });
                      setTimeout(
                        () => (window.location.href = "/profile"),
                        1500
                      );
                    })
                    .catch((res) => {
                      setNotify({
                        isOpen: true,
                        message: "Error in Create Admin profile !",
                        type: "error",
                      });
                    });
                });
              }
            );
          } else {
            const data = {
              firstName,
              lastName,
              email,
              phoneNo,
              password,
              profileImagePath,
            };

            axios
              .post(
                "https://rwa-webapp.azurewebsites.net/api/admin/Register",
                data
              )
              .then((res) => {
                console.log(res);
                setNotify({
                  isOpen: true,
                  message: "Admin Account Created",
                  type: "success",
                });
                setTimeout(() => (window.location.href = "/profile"), 1500);
              })
              .catch((res) => {
                setNotify({
                  isOpen: true,
                  message: "Error in Create Admin profile !",
                  type: "error",
                });
              });
          }
        }
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setNotify({
          isOpen: true,
          message: error.response.data.message,
          type: "error",
        });
      }
    }
  };

  return (
    <div className="add-new-admin">
      <div className="topic-admin">Create New Admin</div>

      <div className="personal-info-container">
        <form className="addNewAdmin-form" onSubmit={AdminRegister}>
          <div className="form-left">
            <div className="topic mb-4">Personal Information</div>
            <div className="input-box">
              <input
                type="text"
                required
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
              <label>First Name</label>
            </div>

            {customErrors.firstNameError && (
              <div
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "-10px",
                }}
              >
                {customErrors.firstNameError}
              </div>
            )}
            <div className="input-box">
              <input
                type="text"
                required
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
              <label>Last Name</label>
            </div>
            {customErrors.lastNameError && (
              <div
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "-10px",
                }}
              >
                {customErrors.lastNameError}
              </div>
            )}

            <div className="input-box">
              <input
                type="text"
                required
                maxLength={10}
                onChange={(e) => {
                  setPhoneNo(e.target.value);
                }}
              />
              <label>Contact Number</label>
            </div>
            {customErrors.phoneNumError && (
              <div
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "-10px",
                }}
              >
                {customErrors.phoneNumError}
              </div>
            )}

            <div className="input-box">
              <input
                type="text"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <label>Email</label>
            </div>
            {customErrors.emailError && (
              <div
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "-10px",
                }}
              >
                {customErrors.emailError}
              </div>
            )}
            <br />

            <br />
            <br />
          </div>

          <div className="form-right">
            <div
              className="topic"
              style={{
                visibility: "hidden",
                marginBottom: "14.5px",
              }}
            >
              Personal Information
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
              Profile Picture <MdCloudUpload style={{ color: "red" }} />
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
              className="input-box"
              style={{
                marginTop: "-10px",
              }}
            >
              <input
                type="password"
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <label>Password</label>
            </div>

            <div className="input-box">
              <input
                type="password"
                required
                onChange={(e) => {
                  setcPassword(e.target.value);
                }}
              />
              <label>Confirm Password</label>
            </div>

            {error && (
              <div
                style={{
                  width: "100%",
                  padding: "15px",
                  margin: "15px 0 -60px",
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

            <input
              type="submit"
              className="submit-btn"
              style={{
                minWidth: "40%",
                cursor: "pointer",
                marginLeft: "-120px",
                marginTop: "110px",
              }}
              value="Create New Admin"
            />
          </div>
        </form>
      </div>
      <Notifications notify={notify} setNotify={setNotify} />
    </div>
  );
};

export default AddNewAdmin;
