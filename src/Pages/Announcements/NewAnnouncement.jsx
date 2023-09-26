import { MdCloudUpload } from "react-icons/md";
import "./NewAnnouncement.scss";
import axios from "axios";

import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../../firebase";
import { useNavigate } from "react-router-dom";
import Notifications from "../../Components/Notifications";

const NewAnnouncement = () => {
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [imageUrlPoster, setimageUrlPoster] = useState("");
  const [imageUrlIcon, setimageUrlIcon] = useState("");
  const [postedDate, setpostedDate] = useState("");
  const [expDate, setexpDate] = useState("");

  const token = localStorage.getItem("Token");

  //Alert Notification
  const [notify, setNotify] = useState({
    isOpen: false,

    message: "",

    type: "",
  });


  const [error, setError] = useState({
        titleError: "",
        descriptionError: "",
        expDateError: "",
        postedDateError: "",
        imageUrlPosterError: "",
  });

  const createNewAnnouncement = async (e) => {
    e.preventDefault();
    try {

      const spetialCharaterRegex = new RegExp("[^A-Za-z\\s]");

      if (!title) {
        var titleError = "Notice Title is required";
      } else if (spetialCharaterRegex.test(title)) {
        var titleError = "Notice Title cannot contain special characters";
      } else {
        titleError = "";
      }

      // if (!description) {
      //   var descriptionError = "Description is required";
      // } else if (spetialCharaterRegex.test(description)) {
      //   var descriptionError = "Description cannot contain special characters";
      // } else {
      //   descriptionError = "";
      // }

      if (!postedDate) {
        var descriptionError = "Description is required";
      } else {
        descriptionError = "";
      }
      
      if (!postedDate) {
        var postedDateError = "Posted Date is required";
      } else {
        postedDateError = "";
      }

      if (!expDate) {
        var expDateError = "Expire Date is required";
      } else {
        expDateError = "";
      }

      if (!imageUrlPoster) {
        var imageUrlPosterError = "Poster Image is required";
      } else {
        imageUrlPosterError = "";
      }

      

      setError({
        titleError,
        descriptionError,
        expDateError,
        postedDateError,
        imageUrlPosterError
      });

      console.log(error);

      if (
        !titleError &&
        !descriptionError &&
        !expDateError &&
        !imageUrlPosterError &&
        !postedDateError
        
      ) {
      const fileName = new Date().getTime().toString() + imageUrlPoster.name;
      const storage = getStorage(app);
      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, imageUrlPoster);
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
          getDownloadURL(uploadTask.snapshot.ref).then((imageUrlPoster) => {
            console.log("File available at :", imageUrlPoster);

            const data = {
              title,
              imageUrlPoster,
              description,
              postedDate,
              expDate,
            };
            console.log(data);
            axios
              .post(
                "https://rwa-webapp.azurewebsites.net/api/notice/createNotice",
                data,
                {
                  headers: {
                    Authorization: `${token}`,
                  },
                }
              )
              .then((res) => {
                console.log(res);
                setNotify({
                  isOpen: true,
                  message: "Announcement Created",
                  type: "success",
                });
                setTimeout(
                  () => (window.location.href = "/Announcements"),
                  1500
                );
              })
              .catch((res) => {
                setNotify({
                  isOpen: true,
                  message: "Error Announcement !",
                  type: "error",
                });
              });
          });
        }
      );
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
    <div className="new-announcemet-container">
      <div className="new-announcemet-container-content">
        <div className="new-announcemet-header">Create New Announcement</div>

        <div className="new-announcemet-body">
          <form onSubmit={createNewAnnouncement}>
            <div className="input-box">
              <input
                type="text"
                
                onChange={(e) => {
                  settitle(e.target.value);
                }}
              />
              <label>Title</label>
            </div>
            {error.titleError && (
              <span
                className="error-message"
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "-10px",
                  marginBottom: "10px",
                  display: "flex",
                  width: "75%",
                  justifyContent: "flex-start"
                }}
              >
                {error.titleError}
              </span>
            )}
          <div
              className="input-box"
              style={{
                width: "65vw",
                maxWidth: "500px",
                height: "50px",
              }}
            >
              <textarea
                type="text"
                
                onChange={(e) => {
                  setdescription(e.target.value);
                }}
              />
              <label>Description</label>
            </div>
            {error.descriptionError && (
              <span
                className="error-message"
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "70px",
                  marginBottom: "-50px",
                  display: "flex",
                  width: "75%",
                  justifyContent: "flex-start"
                }}
              >
                {error.descriptionError}
              </span>
            )}

            <span
              style={{
                width: "100%",
                marginTop: "75px",
                display: "flex",
                alignItems: "left",
                justifyContent: "left",
                gap: "10px",
                fontWeight: "200",
                marginBottom: "10px",
                marginLeft: "180px",
              }}
            >
              Upload Poster{" "}
              <MdCloudUpload style={{ color: "red", marginTop: "5px" }} />
            </span>

            <div className="input-box">
              <input
                type="file"
                
                style={{ padding: "8px 20px", marginTop: "-22px" }}
                autoFocus={true}
                accept="image/*"
                onChange={(e) => {
                  setimageUrlPoster(e.target.files[0]);
                }}
              />
            </div>
            {error.imageUrlPosterError && (
              <span
                className="error-message"
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "-30px",
                  marginBottom: "25px",
                  display: "flex",
                  width: "75%",
                  justifyContent: "flex-start"
                }}
              >
                {error.imageUrlPosterError}
              </span>
            )}
            <div
              class="input-box"
              style={{
                marginTop: "-7px",
              }}
            >
              <input
                type="datetime"
                onFocus={(e) => {
                  e.target.type = "date";
                }}
                
                onChange={(e) => {
                  setpostedDate(e.target.value);
                }}
              />
              <label>Posted Date</label>
            </div>
            {error.postedDateError && (
              <span
                className="error-message"
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "-10px",
                  marginBottom: "25px",
                  display: "flex",
                  width: "75%",
                  justifyContent: "flex-start"
                }}
              >
                {error.postedDateError}
              </span>
            )}
            <div
              class="input-box"
              style={{
                marginTop: "5px",
              }}
            >
              <input
                type="datetime"
                onFocus={(e) => {
                  e.target.type = "date";
                }}
                
                onChange={(e) => {
                  setexpDate(e.target.value);
                }}
              />
              <label>Post Expire Date</label>
            </div>
            {error.expDateError && (
              <span
                className="error-message"
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "-10px",
                  marginBottom: "25px",
                  display: "flex",
                  width: "75%",
                  justifyContent: "flex-start"
                }}
              >
                {error.expDateError}
              </span>
            )}

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
              value="Create"
            />
          </form>
        </div>
      </div>
      <Notifications notify={notify} setNotify={setNotify} />
    </div>
  );
};

export default NewAnnouncement;
