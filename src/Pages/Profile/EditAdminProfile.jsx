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
import { useNavigate } from "react-router-dom";
import Notifications from "../../Components/Notifications";
import { async } from "@firebase/util";

const EditAdminProfile = () => {
  //Get id from local storage
  const userId = localStorage.getItem("Token");

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
      }
    }
  };

  //Send token to backend to get user data with header authorization
  const fetchUser = async () => {
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

  const navigate = useNavigate();

  //Update user data to backend and firebase
  // const personalInfoUpdate = async (e) => {
  //   e.preventDefault();

  //   const fileName = new Date().getTime().toString() + imageUrl.name;
  //   const storage = getStorage(app);
  //   const storageRef = ref(storage, fileName);

  //   const uploadTask = uploadBytesResumable(storageRef, imageUrl);

  //   //Upload the file to Firebase Storage
  //   uploadTask.on(
  //     "state_changed",
  //     (snapshot) => {
  //       const progress =
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       console.log("Upload is " + progress + " % done");
  //       switch (snapshot.state) {
  //         case "paused":
  //           console.log("Upload is paused");
  //           break;
  //         case "running":
  //           console.log("Upload is running");
  //           break;
  //       }
  //     },
  //     (error) => {
  //       // Handle unsuccessful uploads
  //     },
  //     () => {
  //       // Handle successful uploads on complete
  //       // For instance, get the download URL: https://firebasestorage.googleapis.com/...
  //       getDownloadURL(uploadTask.snapshot.ref).then((imageUrl) => {
  //         console.log("File available at :", imageUrl);

  //         const updatedProfle = {
  //           firstName,
  //           lastName,
  //           phoneNo,
  //           imageUrl,
  //           fullName,
  //           createdDate,
  //         };
  //         console.log(updatedProfle);
  //         axios
  //           .patch(
  //             "https://rwa-webapp.azurewebsites.net/api/admin/UpdateAdmin",
  //             updatedProfle,
  //             {
  //               headers: {
  //                 Authorization: `${userId}`,
  //               },
  //             }
  //           )
  //           .then((res) => {
  //             console.log(res);
  //             setNotify({
  //               isOpen: true,
  //               message: "Profile Updated Successfully",
  //               type: "success",
  //             });
  //             setTimeout(() => (window.location.href = "/profile"), 1500);
  //           })
  //           .catch((res) => {
  //             setNotify({
  //               isOpen: true,
  //               message: "Error updating Admin profile !",
  //               type: "error",
  //             });
  //           });
  //       });
  //     }
  //   );
  // };

  const personalInfoUpdate = async (e) => {
    e.preventDefault();
    // console.log(profileImagePath);

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
      if (imageUrl) {
        const storage = getStorage(app);
        const fileName = new Date().getTime().toString() + imageUrl.name;
        const storageRef = ref(storage, "/Admin/Profile Images/" + fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageUrl);

        if (profileImagePath) {
          const desertRef = ref(storage, profileImagePath);

          // Delete the file
          await deleteObject(desertRef)
            .then(() => {
              console.log("file deleted");
            })
            .catch((error) => {
              console.log(error);
            });
        }

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

              const updatedProfle = {
                firstName,
                lastName,
                phoneNo,
                imageUrl,
                profileImagePath: "/Admin/Profile Images/" + fileName,
              };
              axios
                .patch(
                  "https://rwa-webapp.azurewebsites.net/api/admin/UpdateAdmin",
                  updatedProfle,
                  {
                    headers: {
                      Authorization: `${userId}`,
                    },
                  }
                )
                .then((res) => {
                  console.log(res);
                  setNotify({
                    isOpen: true,
                    message: "Profile Updated Successfully",
                    type: "success",
                  });
                  setTimeout(() => (window.location.href = "/profile"), 2000);
                })
                .catch((res) => {
                  setNotify({
                    isOpen: true,
                    message: "Error updating Admin profile !",
                    type: "error",
                  });
                });
            });
          }
        );
      } else {
        const updatedProfle = {
          firstName,
          lastName,
          phoneNo,
        };

        console.log(updatedProfle);
        await axios
          .patch(
            "https://rwa-webapp.azurewebsites.net/api/admin/UpdateAdmin",
            updatedProfle,
            {
              headers: {
                Authorization: `${userId}`,
              },
            }
          )
          .then((res) => {
            console.log(res);
            setNotify({
              isOpen: true,
              message: "Profile Updated Successfully",
              type: "success",
            });
            setTimeout(() => (window.location.href = "/profile"), 1500);
          })
          .catch((res) => {
            setNotify({
              isOpen: true,
              message: "Error updating Admin profile !",
              type: "error",
            });
          });
      }
    }
  };

  const OnReset = () => {
    fetchUser();
  };

  return (
    <div className="add-new-admin">
      <div className="topic-admin">Edit My Profile</div>

      <div
        className="personal-info-container"
        style={{
          display: "flex",
        }}
      >
        <form className="addNewAdmin-form" onSubmit={personalInfoUpdate}>
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

              <input
                type="submit"
                className="update-btn"
                style={{
                  cursor: "pointer",
                  backgroundColor: "#1a97f5",
                  width: "150px",
                  color: "white",
                  height: "40px",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
                }}
                value="Update"
              />
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
              <input
                className="update-btn"
                style={{
                  cursor: "pointer",
                  backgroundColor: "#1a97f5",
                  width: "150px",
                  color: "white",
                  height: "40px",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
                }}
                type="submit"
                value="Update"
              />
            </div>
          </div>
        </form>
      </div>
      <Notifications notify={notify} setNotify={setNotify} />
    </div>
  );
};

export default EditAdminProfile;
