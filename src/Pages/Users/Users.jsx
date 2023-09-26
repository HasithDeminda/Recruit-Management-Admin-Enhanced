import React, { useEffect, useState } from "react";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { UserRepotGenarate } from "../../Components/Report/ReportGenarate";
import axios from "axios";
import "../../Pages/Announcements/Announcements.scss";
import { Header } from "../../Components";
import { FaEdit } from "react-icons/fa";
import { GiClick } from "react-icons/gi";
import ConfirmDialog from "../../Components/ConfirmDialog";
import Notifications from "../../Components/Notifications";
import { TbReportAnalytics } from "react-icons/tb";

const Users = () => {
  const [users, setUsers] = useState("");

  //Get id from local storage
  const userId = localStorage.getItem("Token");

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

  useEffect(() => {
    const Users = async () => {
      const allUsers = await axios
        .get("https://rwa-webapp.azurewebsites.net/api/userMgt/GetAllUsers", {
          headers: {
            Authorization: `${userId}`,
          },
        })
        .then((response) => {
          return response.data.allUsers;
        })
        .catch((error) => {
          console.log(error);
        });

      let temp = [];

      for (let i = 0; i < allUsers.length; i++) {
        var usersatatus;
        if (allUsers[i].verified) {
          usersatatus = "Active";
        } else {
          usersatatus = "Inactive";
        }
        temp.push({
          id: allUsers[i]._id,
          fullName: allUsers[i].fullName,
          email: allUsers[i].email,
          phoneNo: allUsers[i].phoneNo,
          imageUrl: allUsers[i].imageUrl,
          status: usersatatus,
          createdAt: moment(allUsers[i].createdAt).format("MMMM Do YYYY"),
        });
      }
      setUsers(temp);
    };
    Users();
  }, []);

  // Delete User
  function deleteHandler(id) {
    setConfirmDialog({
      ...ConfirmDialog,
      isOpen: false,
    });
    axios
      .delete(
        `https://rwa-webapp.azurewebsites.net/api/userMgt/DeleteUser/${id}`,
        {
          headers: {
            Authorization: `${userId}`,
          },
        }
      )

      .then((res) => {
        setNotify({
          isOpen: true,
          message: "User Deleted!",
          type: "success",
        });

        setTimeout(window.location.reload.bind(window.location), 1000);
      })

      .catch((err) => {
        setNotify({
          isOpen: true,
          message: "Error Deleting User!",
          type: "error",
        });
      });
  }

  const filterData = (users, searchKey) => {
    const result = users.filter(
      (users) =>
        users.fullName.toLowerCase().includes(searchKey) ||
        users.email.toLowerCase().includes(searchKey)
    );
    setUsers(result);
  };

  //Search Function
  const onSearch = async (e) => {
    const searchKey = e.currentTarget.value;
    axios
      .get("https://rwa-webapp.azurewebsites.net/api/userMgt/GetAllUsers", {
        headers: {
          Authorization: `${userId}`,
        },
      })
      .then((res) => {
        if (res.data.status) {
          var temp = [];

          for (let i = 0; i < res.data.allUsers.length; i++) {
            var usersatatus;
            if (res.data.allUsers[i].verified) {
              usersatatus = "Active";
            } else {
              usersatatus = "Inactive";
            }
            temp.push({
              id: res.data.allUsers[i]._id,
              fullName: res.data.allUsers[i].fullName,
              email: res.data.allUsers[i].email,
              phoneNo: res.data.allUsers[i].phoneNo,
              imageUrl: res.data.allUsers[i].imageUrl,
              status: usersatatus,
              createdAt: moment(res.data.allUsers[i].createdAt).format(
                "MMMM Do YYYY"
              ),
            });
          }
        } else {
          console.log("Threre is no data ");
        }
        filterData(temp, searchKey.toLowerCase());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Report Genarate
  const onReportGenarate = () => {
    const FileName =
      "User Report - " + moment(new Date()).format("MMMM Do YYYY - HH.mm.ss");
    const columns = [
      { header: "Full Name", key: "fullName" },
      { header: "Email", key: "email" },
      { header: "Phone Number", key: "phoneNo" },
      { header: "User Status", key: "status" },
      { header: "Account Created Date", key: "createdAt" },
    ];
    UserRepotGenarate(users, columns, FileName);
  };

  const columns = [
    {
      field: "fullName",
      headerName: "User Name",
      width: 250,
      renderCell: (params) => {
        return (
          <div
            className="userlist-container"
            style={{ width: "50px", height: "50px" }}
          >
            <img
              className="userlist-img"
              src={
                params.row.imageUrl ||
                "https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101028/112815904-no-image-available-icon-flat-vector-illustration.jpg?ver=6"
              }
              alt=""
              style={{
                width: "100%",
                height: "100%",
                minHeight: "100%",
                minWidth: "100%",
                borderRadius: "50px",
              }}
            />
            {params.row.fullName}
          </div>
        );
      },
    },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "phoneNo",
      headerName: "Contact Number",
      width: 160,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {params.row.phoneNo || "-"}
          </div>
        );
      },
    },
    { field: "createdAt", headerName: "Registered On", width: 170 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        return (
          <div>
            {params.row.status === "Active" ? (
              <div
                className=""
                style={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  padding: "5px",
                  borderRadius: "15px",
                  width: "80px",
                  textAlign: "center",
                }}
              >
                <span className="active">Active</span>
              </div>
            ) : (
              <div
                className=""
                style={{
                  backgroundColor: "#f44336",
                  color: "white",
                  padding: "5px",
                  borderRadius: "15px",
                  width: "80px",
                  textAlign: "center",
                }}
              >
                <span className="inactive">Inactive</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userlist-container">
            <Link to={"/Users/view/" + params.row.id}>
              <GiClick
                title="View Job"
                className="userlist-delete-btn"
                style={{
                  color: "#4caf50",
                  marginRight: "10px",
                }}
              />
            </Link>
            <Link to={"/Users/update-users/" + params.row.id}>
              <button
                className="userlist-edit-btn"
                style={{
                  display: "flex",
                  gap: "5px",
                }}
              >
                <FaEdit
                  style={{
                    fontSize: "16px",
                  }}
                />
                Update
              </button>
            </Link>

            <MdDelete
              className="userlist-delete-btn"
              onClick={() => {
                setConfirmDialog({
                  isOpen: true,
                  title: "Delete a User!",
                  subTitle: "Are you sure you want to delete this user?",
                  onConfirm: () => {
                    deleteHandler(params.row.id);
                  },
                  console: console.log(params.row.id),
                });
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div
      style={{
        overflowY: "hidden",
        width: "95%",
        margin: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          marginTop: "20px",
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "20px",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Header category="Page" title="Registered Users 🤵" />
          </div>
        </div>
        <br />
        <div
          className="search-reports"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: "50px",
          }}
        >
          <div
            className="search-reports-container"
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Search"
              style={{
                width: "300px",
                height: "40px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                padding: "0 10px",
                outline: "none",
              }}
              onChange={onSearch}
            />
            <button
              className="btn btn-primary"
              style={{
                backgroundColor: "#1A97F5",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 10px",
                width: "100px",
                height: "35px",
                borderRadius: "10px",
                marginLeft: "-102px",
              }}
              disabled
            >
              Search
            </button>
          </div>

          <button
            onClick={onReportGenarate}
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
              height: "40px",
              marginLeft: "20px",
            }}
          >
            <TbReportAnalytics />
            Generate Report
          </button>
        </div>
        <div style={{ height: 550, width: "100%", marginTop: "-30px" }}>
          <DataGrid
            rows={users}
            rowHeight={75}
            columns={columns}
            pageSize={6}
            rowsPerPageOptions={[6]}
            disablecheckboxSelection
            disableSelectionOnClick
            style={{
              overflowX: "auto",
              padding: "0px 0px 0px 20px",
            }}
          />
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

export default Users;
