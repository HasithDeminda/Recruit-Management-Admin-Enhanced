import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../Pages/Announcements/Announcements.scss";
import { BiPlusCircle } from "react-icons/bi";
import { Header } from "../../Components";
import { FaEdit } from "react-icons/fa";
import ConfirmDialog from "../../Components/ConfirmDialog";
import Notifications from "../../Components/Notifications";
import { TbReportAnalytics } from "react-icons/tb";
import { GiClick } from "react-icons/gi";
import moment from "moment";
import { FeaturedJobsReportGenerate } from "../../Components/Report/ReportGenarate";

const FeaturedJobs = () => {
  //Get id from local storage
  const userId = localStorage.getItem("Token");

  const [fjobs, setFjobs] = useState([
    {
      id: "",
      jobTitle: "",
      companyName: "",
      description: "",
      descImgUrl: "",
      jobStatus: "",
      jobType: "",
      postedDate: "",
      expDate: "",
      createdAt: "",
      comEmail: "",
    },
  ]);

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
    const featuredJ = async () => {
      const allJobs = await axios
        .get("https://rwa-webapp.azurewebsites.net/api/jobMgt/GetALLJobs", {
          headers: {
            Authorization: `${userId}`,
          },
        })
        .then((response) => {
          return response.data.allJobs;
        })
        .catch((error) => {
          console.log(error);
        });

      let temp = [];

      //console.log(allJobs);

      for (let i = 0; i < allJobs.length; i++) {
        temp.push({
          id: allJobs[i]._id,
          jobTitle: allJobs[i].jobTitle,
          category: allJobs[i].category,
          jobStatus: allJobs[i].jobStatus,
          jobType: allJobs[i].jobType,
          descImgUrl: allJobs[i].descImgUrl,
          postedDate: moment(allJobs[i].postedDate).format("MMMM Do YYYY"),
          expDate: moment(allJobs[i].expDate).format("MMMM Do YYYY"),
          createdAt: moment(allJobs[i].createdAt).format("MMMM Do YYYY"),
          comEmail: allJobs[i].comEmail,
        });
      }
      setFjobs(temp);
    };
    featuredJ();
  }, []);

  //console.log(fjobs);

  // Delete a job
  function deleteHandler(id) {
    setConfirmDialog({
      ...ConfirmDialog,
      isOpen: false,
    });
    axios
      .delete(
        `https://rwa-webapp.azurewebsites.net/api/jobMgt/DeleteJob/${id}`,
        {
          headers: {
            Authorization: `${userId}`,
          },
        }
      )

      .then((res) => {
        setNotify({
          isOpen: true,
          message: "Job Post Deleted!",
          type: "success",
        });

        setTimeout(window.location.reload.bind(window.location), 1000);
      })

      .catch((err) => {
        setNotify({
          isOpen: true,
          message: "Error Deleting Post!",
          type: "error",
        });
      });
  }

  //Job PDF Genarate
  const onPdfGeberate = () => {
    const FileName =
      "Featured Job Report - " +
      moment(new Date()).format("MMMM Do YYYY - HH.mm.ss");
    const columns = [
      { header: "Title", key: "jobTitle" },
      { header: "Category", key: "category" },
      { header: "Job Type", key: "jobType" },
      { header: "Company Email", key: "comEmail" },
      { header: "Status", key: "jobStatus" },
      { header: "Job Posted Date", key: "postedDate" },
      { header: "Job Expired Date", key: "expDate" },
      { header: "Job Created Date", key: "createdAt" },
    ];

    FeaturedJobsReportGenerate(fjobs, columns, FileName);
  };

  const filterData = (fjobs, searchKey) => {
    const result = fjobs.filter(
      (fjobs) =>
        fjobs.jobTitle.toLowerCase().includes(searchKey) ||
        fjobs.category.toLowerCase().includes(searchKey) ||
        fjobs.jobStatus.toLowerCase().includes(searchKey)
    );
    setFjobs(result);
  };

  const onSearch = async (e) => {
    const searchKey = e.currentTarget.value;

    axios
      .get("https://rwa-webapp.azurewebsites.net/api/jobMgt/GetALLJobs", {
        headers: {
          Authorization: `${userId}`,
        },
      })
      .then((response) => {
        if (response.data.status) {
          var temp = [];

          //console.log(allJobs);

          for (let i = 0; i < response.data.allJobs.length; i++) {
            temp.push({
              id: response.data.allJobs[i]._id,
              jobTitle: response.data.allJobs[i].jobTitle,
              category: response.data.allJobs[i].category,
              jobStatus: response.data.allJobs[i].jobStatus,
              jobType: response.data.allJobs[i].jobType,
              descImgUrl: response.data.allJobs[i].descImgUrl,
              postedDate: moment(response.data.allJobs[i].postedDate).format(
                "MMMM Do YYYY"
              ),
              expDate: moment(response.data.allJobs[i].expDate).format(
                "MMMM Do YYYY"
              ),
              createdAt: moment(response.data.allJobs[i].createdAt).format(
                "MMMM Do YYYY"
              ),
              comEmail: response.data.allJobs[i].comEmail,
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

  const columns = [
    {
      field: "jobTitle",
      headerName: "Title",
      width: 350,
      renderCell: (params) => {
        return (
          <div
            className="userlist-container"
            style={{ width: "50px", height: "50px" }}
          >
            <img
              className="userlist-img"
              src={
                params.row.descImgUrl ||
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
            {params.row.jobTitle}
          </div>
        );
      },
    },
    { field: "category", headerName: "Category", width: 220 },
    { field: "jobType", headerName: "Type", width: 150 },
    {
      field: "jobStatus",
      headerName: "Status",
      width: 175,
      renderCell: (params) => {
        return (
          <div>
            {params.row.jobStatus === "Active" ? (
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
            ) : params.row.jobStatus === "Pending" ? (
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
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userlist-container">
            <Link to={"/Jobs/View/" + params.row.id}>
              <GiClick
                title="View Job"
                className="userlist-delete-btn"
                style={{
                  color: "#4caf50",
                  marginRight: "10px",
                }}
              />
            </Link>

            <Link to={"/jobs/update-jobs/" + params.row.id}>
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
              title="Delete Job"
              onClick={() => {
                setConfirmDialog({
                  isOpen: true,
                  title: "Delete Job Vacancy!",
                  subTitle: "Are you sure you want to delete this job?",
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
            <Header category="Page" title="Featured Jobs 🧑‍💻" />
          </div>
          <span>
            <Link to="/Jobs/new-job">
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
                <span>Post New Job</span>
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
            rows={fjobs}
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

export default FeaturedJobs;
