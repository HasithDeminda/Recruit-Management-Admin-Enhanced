import React, { useState, useEffect } from "react";
import { MdCloudUpload } from "react-icons/md";
import "./NewAnnouncement.scss";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../../firebase";
import { useNavigate } from "react-router-dom";
import Notifications from "../../Components/Notifications";

const EditAnnouncement = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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

  useEffect(() => {
    const getAnnouncement = async () => {
      const notice = await axios
        .get(`https://rwa-webapp.azurewebsites.net/api/notice/specNotice/${id}`)
        .then((response) => {
          return response.data.notice;
        })
        .catch((error) => {
          console.log(error);
        });

      settitle(notice.title);
      setdescription(notice.description);
      setimageUrlPoster(notice.imageUrlPoster);
      setpostedDate(notice.postedDate);
      setexpDate(notice.expDate);
    };

    getAnnouncement();
  }, []);


  const [error, setError] = useState({
    titleError: "",
    descriptionError: "",
    expDateError: "",
    postedDateError: "",
    imageUrlPosterError: "",
});

  //Update user data to backend and firebase
  const announcementUpdate = async (e) => {
    e.preventDefault();
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

      if (!description) {
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
        getDownloadURL(uploadTask.snapshot.ref).then((imageUrlPoster, cv) => {
          console.log("File available at :", imageUrlPoster);

          const updateAnnouncement = {
            title,
            imageUrlPoster,
            description,
            postedDate,
            expDate,
          };
          console.log(updateAnnouncement);
          axios
            .put(
              `https://rwa-webapp.azurewebsites.net/api/notice/upNotice/${id}`,
              updateAnnouncement,
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
                message: "Announcement Updated Successfully",
                type: "success",
              });

              setTimeout(() => (window.location.href = "/Announcements"), 1500);
            })
            .catch((res) => {
              setNotify({
                isOpen: true,
                message: "Error updating Announcement !",
                type: "error",
              });
            });
        });
      }
    );
      }
  };

  return (
    <div className="new-announcemet-container">
      <div className="new-announcemet-container-content">
        <div className="new-announcemet-header">Update Announcement</div>

        <div className="new-announcemet-body">
          <form>
            <div className="input-box">
              <input
                type="text"
                required
                onChange={(e) => {
                  settitle(e.target.value);
                }}
                value={title}
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
                  marginBottom: "30px",
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
                marginTop: "-10px",
              }}
            >
              <textarea
                type="text"
                required
                onChange={(e) => {
                  setdescription(e.target.value);
                }}
                value={description}
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
                required
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
                value={postedDate.toString().slice(0, 10)}
                required
                onChange={(e) => {
                  setpostedDate(e.target.value);
                }}
              />
              <label>Updating Date</label>
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
                marginTop: "20px",
              }}
            >
              <input
                type="datetime"
                onFocus={(e) => {
                  e.target.type = "date";
                }}
                required
                value={expDate.toString().slice(0, 10)}
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
              onClick={announcementUpdate}
            />
          </form>
        </div>
      </div>
      <Notifications notify={notify} setNotify={setNotify} />
    </div>
  );
};

export default EditAnnouncement;
