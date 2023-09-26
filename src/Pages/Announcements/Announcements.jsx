import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Announcements.scss";
import { BiPlusCircle } from "react-icons/bi";
import { TbReportAnalytics } from "react-icons/tb";
import { Header } from "../../Components";
import { FaEdit } from "react-icons/fa";
import Notifications from "../../Components/Notifications";
import ConfirmDialog from "../../Components/ConfirmDialog";
import moment from "moment";
import { AnnoucementReportGenerate } from "../../Components/Report/ReportGenarate";

const Announcements = () => {
  const [Announcements, setAnnouncements] = useState([]);
  const token = window.localStorage.getItem("Token");

  useEffect(() => {
    const announcement = async () => {
      const allAnnouncements = await axios
        .get("https://rwa-webapp.azurewebsites.net/api/notice/getNotice", {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          return res.data.allnotices;
        })
        .catch((err) => {
          console.error(err);
        });

      let temp = [];

      for (let i = 0; i < allAnnouncements.length; i++) {
        temp.push({
          id: allAnnouncements[i]._id,
          title: allAnnouncements[i].title,
          description: allAnnouncements[i].description,
          date: allAnnouncements[i].expDate,
          noticeStatus: allAnnouncements[i].noticeStatus,
          imageUrlPoster: allAnnouncements[i].imageUrlPoster,
          imageUrlIcon: allAnnouncements[i].imageUrlIcon,
          expDate: moment(allAnnouncements[i].expDate).format("MMMM Do YYYY"),
          postedDate: moment(allAnnouncements[i].postedDate).format(
            "MMMM Do YYYY"
          ),
        });
      }
      setAnnouncements(temp);
    };
    announcement();
  }, []);

  console.log(Announcements);

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

  // Delete a announcement
  function deleteHandler(id) {
    setConfirmDialog({
      ...ConfirmDialog,
      isOpen: false,
    });
    axios
      .delete(
        `https://rwa-webapp.azurewebsites.net/api/notice/deleteNotice/${id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )

      .then((res) => {
        setNotify({
          isOpen: true,
          message: "Announcement Deleted!",
          type: "success",
        });

        setTimeout(window.location.reload.bind(window.location), 1000);
      })

      .catch((err) => {
        setNotify({
          isOpen: true,
          message: "Error Deleting Announcement!",
          type: "error",
        });
      });
  }

  const onPdfGeberate = () => {
    const FileName =
      "Announcements Job Report - " +
      moment(new Date()).format("MMMM Do YYYY - HH.mm.ss");
    const columns = [
      { header: "Announcement Title", key: "title"},
      { header: "Description", key: "description" },
      { header: "Status", key: "noticeStatus" },
      { header: "Posted Date", key: "postedDate" },
      { header: "Expire Date", key: "expDate" },
    ];

    AnnoucementReportGenerate(Announcements, columns, FileName);
  };

  const filterData = (Announcements, searchKey) => {
    const result = Announcements.filter((Announcement) =>
      Announcement.title.toLowerCase().includes(searchKey)
    );
    setAnnouncements(result);
  };

  const onSearch = async (e) => {
    const searchKey = e.currentTarget.value;

    axios
      .get("https://rwa-webapp.azurewebsites.net/api/notice/getNotice", {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        if (res.data.status) {
          var temp = [];

          for (let i = 0; i < res.data.allnotices.length; i++) {
            temp.push({
              id: res.data.allnotices[i]._id,
              title: res.data.allnotices[i].title,
              description: res.data.allnotices[i].description,
              date: res.data.allnotices[i].expDate,
              noticeStatus: res.data.allnotices[i].noticeStatus,
              imageUrlPoster: res.data.allnotices[i].imageUrlPoster,
              imageUrlIcon: res.data.allnotices[i].imageUrlIcon,
              expDate: moment(res.data.allnotices[i].expDate).format(
                "MMMM Do YYYY"
              ),
              postedDate: moment(res.data.allnotices[i].postedDate).format(
                "MMMM Do YYYY"
              ),
            });
          }
        } else {
          console.log("Threre is no data");
        }
        filterData(temp, searchKey.toLowerCase());
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const columns = [
    {
      field: "title",
      headerName: "Announcement Title",
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
                params.row.imageUrlPoster ||
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
            {params.row.title}
          </div>
        );
      },
    },
    { field: "description", headerName: "Description", width: 400 },
    { field: "expDate", headerName: "Expired On", width: 170 },

    {
      field: "noticeStatus",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        return (
          <div>
            {params.row.noticeStatus === "Active" ? (
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
            ) : params.row.noticeStatus === "Pending" ? (
              <div
                className=""
                style={{
                  backgroundColor: "#F3B619",
                  color: "white",
                  padding: "5px",
                  borderRadius: "15px",
                  width: "80px",
                  textAlign: "center",
                }}
              >
                <span className="inactive">Pending</span>
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
      width: 150,
      renderCell: (params) => {
        return (
          <div className="userlist-container">
            <Link to={"/Announcements/update-announcement/" + params.row.id}>
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
                  title: "Delete Announcement!",
                  subTitle:
                    "Are you sure you want to delete this Announcement?",
                  onConfirm: () => {
                    deleteHandler(params.row.id);
                  },
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
            <Header category="Page" title="Announcements 📢" />
          </div>
          <span>
            <Link to="/Announcements/new-announcement">
              <button
                className="btn btn-primary"
                style={{
                  backgroundColor: "#1A97F5",
                  color: "white",
                  borderRadius: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "250px",
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
                <span>New Announcement</span>
              </button>
            </Link>
          </span>
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
              onChange={onSearch}
              style={{
                width: "300px",
                height: "40px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                padding: "0 10px",
                outline: "none",
              }}
            />
            <button
              className="btn btn-primary"
              style={{
                backgroundColor: "#1A97F5",
                color: "white",
                borderRadius: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 10px",
                width: "100px",
                height: "35px",
                borderRadius: "10px",
                marginLeft: "-102px",
              }}
            >
              Search
            </button>
          </div>

          <button
            className="btn btn-primary"
            onClick={onPdfGeberate}
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
            rows={Announcements}
            rowHeight={75}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
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

export default Announcements;
