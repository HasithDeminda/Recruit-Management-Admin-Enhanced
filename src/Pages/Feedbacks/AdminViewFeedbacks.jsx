import axios from "axios";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { FaFileInvoice, FaRegStar, FaStar, FaTrash } from "react-icons/fa";
import { Header } from "../../Components";
import ConfirmDialog from "../../Components/ConfirmDialog";
import Notifications from "../../Components/Notifications";
import { FeedbackReportGenerate } from "../../Components/Report/ReportGenarate";
import "./AdminViewFeedbacks.scss";

const AdminViewFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  const token = window.localStorage.getItem("Token");

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
    const GetAllFeedbacks = async () => {
      await axios
        .get("https://rwa-webapp.azurewebsites.net/api/feedbacks/getFeedbacks")
        .then((res) => {
          if (res.data.status) {
            setFeedbacks(res.data.feedbacks);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    GetAllFeedbacks();
  }, []);

  const drawStars = (count) => {
    var x = 5;
    var starArray = [];
    for (let i = 0; i < count; i++) {
      starArray.push(<FaStar />);
      x = x - 1;
    }

    for (let s = 0; s < x; s++) {
      starArray.push(<FaRegStar />);
    }

    return starArray;
  };

  const onReportGeneration = () => {
    const FileName =
      "User Feedback Report - " +
      moment(new Date()).format("MMMM Do YYYY - HH.mm.ss");

    const columns = [
      { header: "Full Name", key: "fullName" },
      { header: "Rating Count", key: "rating" },
      { header: "Comment", key: "comment" },
      { header: "Created Date", key: "date" },
    ];

    FeedbackReportGenerate(feedbacks, columns, FileName);
  };

  const onDelete = (id) => {
    setConfirmDialog({
      ...ConfirmDialog,
      isOpen: false,
    });
    axios
      .delete(
        `https://rwa-webapp.azurewebsites.net/api/feedbacks/adminDeleteFeedback/${id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )

      .then((res) => {
        setNotify({
          isOpen: true,
          message: "Feedback Deleted!",
          type: "success",
        });

        setTimeout(window.location.reload.bind(window.location), 1000);
      })

      .catch((err) => {
        setNotify({
          isOpen: true,
          message: "Error Deleting Feedback !",
          type: "error",
        });
      });
  };
  return (
    <div className="container-feedbacks-content">
      <div className="feedbacks-header">
        <div className="feedbacks-header-topic">
          <div>
            <Header category="Page" title="User Feedbacks 🪶" />
          </div>
        </div>
        <div className="feedbacks-header-newAdmin">
          <button
            className="btn btn-primary"
            onClick={onReportGeneration}
            style={{
              backgroundColor: "#1A97F5",
              color: "white",
              borderRadius: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "200px",
              gap: "0.5rem",
              height: "40px",
              marginTop: "-10px",
            }}
          >
            <FaFileInvoice
              style={{
                fontSize: "1.2rem",
              }}
            />
            <span>Genarate Report</span>
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        {feedbacks.map((feedback) => (
          <div className="feedbacks-body">
            <div className="feedbacks-body-container">
              <div className="feedbacks-body-container-item">
                <div className="feedbacks-body-container-item-header">
                  <>
                    <div className="feedbacks-body-container-item-header-image">
                      <img
                        src={
                          feedback.imageUrl ||
                          "https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101028/112815904-no-image-available-icon-flat-vector-illustration.jpg?ver=6"
                        }
                        alt="user"
                      />
                    </div>
                    <div className="feedbacks-body-container-item-header-content">
                      <div className="feedbacks-body-container-item-header-content-name">
                        <span>{feedback.fullName}</span>
                      </div>
                      <div className="feedbacks-body-container-item-header-content-stars">
                        <div
                          style={{
                            color: "#FABD3B",
                            display: "flex",
                            gap: "0.5rem",
                            fontSize: "20px",
                          }}
                        >
                          {drawStars(feedback.rating)}
                        </div>
                      </div>
                    </div>
                  </>

                  <>
                    <div className="feedbacks-body-container-item-header-content-delete">
                      <span
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: "Delete a Feedback!",
                            subTitle:
                              "Are you sure you want to delete this feddback?",
                            onConfirm: () => {
                              onDelete(feedback._id);
                            },
                          });
                        }}
                      >
                        <FaTrash />
                      </span>
                    </div>
                  </>
                </div>

                <div className="feedbacks-body-container-item-body">
                  <div className="feedbacks-body-container-item-body-content">
                    <span>{feedback.comment}</span>
                  </div>
                </div>

                <div className="given-time mt-2">
                  <span>
                    Feedback given on: <span>{feedback.date}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Notifications notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </div>
  );
};

export default AdminViewFeedbacks;
