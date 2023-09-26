import React from "react";
import { BiPlusCircle } from "react-icons/bi";
import "./ProfileContent.scss";
import { Link } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope, FaPencilAlt, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import ConfirmDialog from "../../Components/ConfirmDialog";
import Notifications from "../../Components/Notifications";

const ProfileContent = () => {
  //Alert Notification

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  //Confirm Dialog
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  function deleteHandler() {
    setConfirmDialog({
      ...ConfirmDialog,
      isOpen: false,
    });
    axios
      .delete(`https://rwa-webapp.azurewebsites.net/api/admin/DeleteAdmin`, {
        headers: {
          Authorization: `${userId}`,
        },
      })

      .then((res) => {
        setNotify({
          isOpen: true,
          message: "Your Account Deleted",
          type: "success",
        });
        localStorage.removeItem("Token");
        setTimeout((window.location.href = "/"), 1000);
      })

      .catch((err) => {
        setNotify({
          isOpen: true,
          message: "Error Deleting Account!",
          type: "error",
        });
      });
  }

  //Get id from local storage
  const userId = localStorage.getItem("Token");

  //Fetch user data from backend
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    fullName: "",
    imageUrl: "",
    phoneNo: "",
    createdAt: "",
  });

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
    setUser(res.data.logedAdmin);
    console.log(res.data.logedAdmin);
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div className="container-profile-content">
      <div className="profile-header">
        <div className="profile-header-topic">
          <h1
            style={{
              fontSize: "2.0rem",
              fontWeight: "semibold",
              letterSpacing: "2px",
            }}
          >
            My Profile
          </h1>
        </div>
        <div className="profile-header-newAdmin">
          <Link to="/newAdmin">
            <button
              className="btn btn-primary"
              style={{
                backgroundColor: "#1A97F5",
                color: "white",
                borderRadius: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "180px",
                gap: "0.5rem",
                height: "50px",
                marginTop: "-10px",
              }}
            >
              <BiPlusCircle
                style={{
                  fontSize: "1.5rem",
                }}
              />
              <span>Add New Admin</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="profile-body">
        <div className="profile-body-left">
          <div className="profile-body-left-name">
            <h1>{user.fullName}</h1>
          </div>

          <div className="profile-body-left-details">
            <div className="profile-body-left-details-item">
              <div
                className="profile-body-left-details-email"
                style={{
                  marginRight: "50px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                  }}
                >
                  <div>
                    <FaEnvelope
                      style={{
                        color: "#00B341",
                        marginRight: "20px",
                        fontSize: "20px",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "start",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "500",
                        letterSpacing: "2px",
                      }}
                    >
                      Email{" "}
                    </span>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "400",
                        color: "#596B65",
                      }}
                    >
                      {user.email}
                    </span>
                  </div>
                </div>
              </div>
              <div className="profile-body-left-details-phone">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                  }}
                >
                  <div>
                    <FaPhoneAlt
                      style={{
                        color: "#00B341",
                        marginRight: "20px",
                        fontSize: "20px",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "start",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "500",
                        letterSpacing: "2px",
                      }}
                    >
                      Contact Number{" "}
                    </span>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "400",
                        color: "#596B65",
                      }}
                    >
                      {user.phoneNo
                        ? user.phoneNo
                        : "Insert Your Contact Number *"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="createdAt">
              <span>Created On: {user.createdAt?.split("T")[0]}</span>
            </div>
          </div>
        </div>

        <div className="profile-body-right">
          <div className="profile-body-right-image">
            <img
              src={
                user.imageUrl ||
                "https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101028/112815904-no-image-available-icon-flat-vector-illustration.jpg?ver=6"
              }
              alt="profile"
            />
          </div>

          <div className="profile-body-right-Actions">
            <Link to="/editAdminProfile">
              <div className="profile-body-right-Actions-edit">
                <button
                  className="btn btn-primary"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <FaPencilAlt />
                  <span>Edit</span>
                </button>
              </div>
            </Link>
            <div className="profile-body-right-Actions-delete">
              <button
                className="btn btn-primary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
                onClick={() => {
                  setConfirmDialog({
                    isOpen: true,
                    title: "Delete My Account!",
                    subTitle: "Are you sure you want to delete this account?",
                    onConfirm: () => {
                      deleteHandler();
                    },
                  });
                }}
              >
                <FaTrash />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Notifications notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </div>
  );
};

export default ProfileContent;
