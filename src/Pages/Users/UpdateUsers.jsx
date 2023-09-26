import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Notifications from "../../Components/Notifications";

const UpdateUsers = () => {
  //Get id from local storage
  const token = localStorage.getItem("Token");

  //Fetch user data from backend
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [fullName, setFullName] = useState("");
  const [header, setHeader] = useState("");
  const [verified, setVerified] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [userUpdateError, setUserUpdateError] = useState({
    firstNameError: "",
    lastNameError: "",
    emailError: "",
    phoneNoError: "",
  });

  const UseParams = useParams();

  const id = UseParams.id;

  //Send token to backend to get user data with header authorization
  const fetchUser = async () => {
    const res = await axios.get(
      `https://rwa-webapp.azurewebsites.net/api/userMgt/GetOneUser/${id}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    setFirstName(res.data.user.firstName);
    setLastName(res.data.user.lastName);
    setEmail(res.data.user.email);
    setPhoneNo(res.data.user.phoneNo);
    setImageUrl(res.data.user.imageUrl);
    setFullName(res.data.user.fullName);
    setHeader(res.data.user.heading);
    setVerified(res.data.user.verified);
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

  //Update user data to backend and firebase
  const personalInfoUpdate = async (e) => {
    e.preventDefault();

    const PhoneNumberRegex = new RegExp("^[0-9-+]{9,15}$");
    const spetialCharaterRegex = new RegExp("[^A-Za-z]");

    if (spetialCharaterRegex.test(firstName)) {
      var firstNameError =
        "First name should not contain special characters and numbers";
    } else {
      var firstNameError = "";
    }

    if (spetialCharaterRegex.test(lastName)) {
      var lastNameError =
        "Last name should not contain special characters and numbers";
    } else {
      var lastNameError = "";
    }
    if (!PhoneNumberRegex.test(phoneNo)) {
      var phoneNoError = "Phone number should be 10 digits number";
    } else {
      var phoneNoError = "";
    }

    setUserUpdateError({
      firstNameError,
      lastNameError,
      phoneNoError,
    });

    if (!firstNameError && !lastNameError && !phoneNoError) {
      const updatedProfle = {
        firstName,
        lastName,
        phoneNo,
        verified,
      };

      axios
        .patch(
          `https://rwa-webapp.azurewebsites.net/api/userMgt/UpdateUser/${id}`,
          updatedProfle,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        )
        .then((res) => {
          setNotify({
            isOpen: true,
            message: "User Updated Successfully !",
            type: "success",
          });
          setTimeout(() => (window.location.href = "/users"), 1500);
        })
        .catch((res) => {
          setNotify({
            isOpen: true,
            message: "Error in updating User !",
            type: "error",
          });
        });
    }
  };

  //password reset function
  const SetTemporaryPassword = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
      } else if (password.length < 6) {
        setError("Password must be at least 6 characters");
      } else {
        const url = `https://rwa-webapp.azurewebsites.net/api/userMgt/SetTemporyPassword/${id}`;
        const data = { tempPassword: password };
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
            setTimeout(() => (window.location.href = "/Users"), 1500);
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

  const onReset = () => {
    fetchUser();
    setUserUpdateError("");
  };
  return (
    <div className="add-new-admin">
      <div className="topic-admin">Edit User Profile</div>

      <div
        className="user-profile"
        style={{
          width: "1050px",
          height: "160px",
          boxShadow: "0px 4px 30px 2px rgba(0, 0, 0, 0.25)",
          borderRadius: "20px",
          margin: "25px 0px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          className="user-profile-image"
          style={{
            width: "120px",
            height: "120px",
            margin: "0px 20px",
          }}
        >
          <img
            src={
              imageUrl ||
              "https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101028/112815904-no-image-available-icon-flat-vector-illustration.jpg?ver=6"
            }
            alt=""
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>

        <div
          className="user-profile-details"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <div
            className="user-profile-details-name"
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#000000",
            }}
          >
            {fullName}
          </div>

          <div
            className="user-profile-details-header"
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#596B65",
            }}
          >
            {header ? header : "Candidate"}
          </div>
        </div>
      </div>

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
            {userUpdateError.firstNameError && (
              <div
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "-10px",
                }}
              >
                {userUpdateError.firstNameError}
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
            {userUpdateError.lastNameError && (
              <div
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "-10px",
                }}
              >
                {userUpdateError.lastNameError}
              </div>
            )}

            <div className="input-box">
              <input
                type="text"
                value={phoneNo}
                onChange={(e) => {
                  setPhoneNo(e.target.value);
                }}
                maxLength="10"
              />
              <label>Contact Number</label>
            </div>
            {userUpdateError.phoneNoError && (
              <div
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "-10px",
                }}
              >
                {userUpdateError.phoneNoError}
              </div>
            )}
            <div className="input-box">
              <input type="text" required value={email} />
              <label>Email</label>
            </div>

            <div class="input-box">
              <select
                name="jobType"
                id="jobType"
                value={verified}
                onChange={(e) => {
                  setVerified(e.target.value);
                }}
                required
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              <label>User Status</label>
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
                value="Reset"
                onClick={onReset}
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
              />

              <input
                type="submit"
                value="Update"
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
              />
            </div>
            <br />
            <br />
          </div>
        </form>
        <form onSubmit={SetTemporaryPassword}>
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
              Add Temporary Password
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
                  setPassword(e.target.value);
                }}
              />
              <label>Enter Temporary Password</label>
            </div>

            <div className="input-box">
              <input
                type="password"
                required
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
              <label>Confirm Temporary Password</label>
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
          </div>
        </form>
      </div>
      <Notifications notify={notify} setNotify={setNotify} />
    </div>
  );
};

export default UpdateUsers;
