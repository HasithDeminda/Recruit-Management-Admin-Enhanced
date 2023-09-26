import React, { useEffect, useState } from "react";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../Pages/Announcements/Announcements.scss";
import { Header } from "../../Components";
import { TbReportAnalytics } from "react-icons/tb";
import { AppliedJobReportGenerate } from "../../Components/Report/ReportGenarate";

const Applications = () => {
  //Get id from local storage
  const userId = localStorage.getItem("Token");

  const [applications, setApplications] = useState([]);

  console.log(applications.jobId);
  useEffect(() => {
    const Users = async () => {
      const appliedjobs = await axios
        .get(
          "https://rwa-webapp.azurewebsites.net/api/applyJob/getAllAppliedJobs",
          {
            headers: {
              Authorization: `${userId}`,
            },
          }
        )
        .then((response) => {
          return response.data.appliedjobs;
        })
        .catch((error) => {
          console.log(error);
        });

      let temp = [];

      for (let i = 0; i < appliedjobs.length; i++) {
        console.log(appliedjobs[i].jobId);

        const jobData = await axios
          .get(
            `https://rwa-webapp.azurewebsites.net/api/jobMgt/GetSpecificJob/${appliedjobs[i].jobId}`
          )
          .then((response) => {
            return response.data.job;
          });

        var isInDatabase = "Active";

        if (!jobData) {
          isInDatabase = "Deleted";
        } else {
          isInDatabase = jobData.jobStatus;
        }

        temp.push({
          id: appliedjobs[i]._id,
          userId: appliedjobs[i].userId,
          jobId: appliedjobs[i].jobId,
          userResumeUrl: appliedjobs[i].userResumeUrl,
          appliedJobTitle: appliedjobs[i].appliedJobTitle,
          appliedJobImageUrl: appliedjobs[i]?.appliedJobImageUrl,
          appliedCompanyName: appliedjobs[i].appliedCompanyName,
          appliedCompanyLocation: appliedjobs[i].appliedCompanyLocation,
          appliedCompanyEmail: appliedjobs[i].appliedCompanyEmail,
          createdAt: moment(appliedjobs[i].createdAt).format("MMMM Do YYYY"),
          appliedJobStatus: isInDatabase,
          appliedUserEmail: appliedjobs[i].appliedUser.email,
        });
      }
      setApplications(temp);
      console.log("====================================");
      console.log(temp);
      console.log("====================================");
    };
    Users();
  }, []);

  const onReportGenarate = () => {
    const FileName =
      "User Applied Jobs - " +
      moment(new Date()).format("MMMM Do YYYY - HH.mm.ss");

    const columns = [
      { header: "Job Title", key: "appliedJobTitle" },
      { header: "Comapany Name", key: "appliedCompanyName" },
      { header: "COmpany Email", key: "appliedCompanyEmail" },
      { header: "Applied User Name", key: "appliedUserName" },
      { header: "Applied User Email", key: "appliedUserEmail" },
      { header: "Applied Date", key: "createdAt" },
    ];
    AppliedJobReportGenerate(applications, columns, FileName);
  };

  const filterData = (applications, searchKey) => {
    const result = applications.filter(
      (applications) =>
        applications.appliedJobTitle.toLowerCase().includes(searchKey) ||
        applications.appliedCompanyName.toLowerCase().includes(searchKey) ||
        applications.appliedUserEmail.toLowerCase().includes(searchKey)
    );
    setApplications(result);
  };

  const onSearch = async (e) => {
    const searchKey = e.currentTarget.value;
    axios
      .get(
        "https://rwa-webapp.azurewebsites.net/api/applyJob/getAllAppliedJobs",
        {
          headers: {
            Authorization: `${userId}`,
          },
        }
      )
      .then((response) => {
        if (response.data.appliedjobs) {
          var temp = [];

          for (let i = 0; i < response.data.appliedjobs.length; i++) {
            temp.push({
              id: response.data.appliedjobs[i]._id,
              userId: response.data.appliedjobs[i].userId,
              jobId: response.data.appliedjobs[i].jobId,
              userResumeUrl: response.data.appliedjobs[i].userResumeUrl,
              appliedJobTitle: response.data.appliedjobs[i].appliedJobTitle,
              appliedJobImageUrl:
                response.data.appliedjobs[i]?.appliedJobImageUrl,
              appliedCompanyName:
                response.data.appliedjobs[i].appliedCompanyName,
              appliedCompanyLocation:
                response.data.appliedjobs[i].appliedCompanyLocation,
              appliedCompanyEmail:
                response.data.appliedjobs[i].appliedCompanyEmail,
              createdAt: moment(response.data.appliedjobs[i].createdAt).format(
                "MMMM Do YYYY"
              ),
              appliedJobStatus: response.data.appliedjobs[i].appliedJobStatus,
              appliedUserName:
                response.data.appliedjobs[i].appliedUser.fullName,
              appliedUserEmail: response.data.appliedjobs[i].appliedUser.email,
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
      field: "appliedJobTitle",
      headerName: "Job Title",
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
                params.row.appliedJobImageUrl ||
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
            {params.row.appliedJobTitle}
          </div>
        );
      },
    },
    { field: "appliedCompanyName", headerName: "Comapany Name", width: 220 },
    { field: "appliedUserEmail", headerName: "Applied User Email", width: 250 },
    { field: "createdAt", headerName: "Applied Date", width: 190 },
    {
      field: "jobStatus",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
        return (
          <div>
            {params.row.appliedJobStatus === "Active" ? (
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
                <span className="inactive">Expired</span>
              </div>
            )}
          </div>
        );
      },
    },

    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="userlist-container">
            {params.row.appliedJobStatus === "Active" ? (
              <Link to={"/Applications/view/" + params.row.jobId}>
                <button
                  className="userlist-edit-btn"
                  style={{
                    display: "flex",
                    gap: "5px",
                  }}
                >
                  View
                </button>
              </Link>
            ) : (
              <button
                className="userlist-edit-btn"
                style={{
                  display: "flex",
                  gap: "5px",
                  cursor: "not-allowed",
                }}
                disabled
              >
                View
              </button>
            )}
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
            <Header category="Page" title="Applied Jobs 🧑‍💻" />
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
            onClick={onReportGenarate}
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
            rows={applications}
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
    </div>
  );
};

export default Applications;
