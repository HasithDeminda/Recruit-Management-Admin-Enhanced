import React, { useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import "./AddJobs.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../../firebase";
import {
  FaEnvelope,
  FaFacebookF,
  FaGlobe,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import Notifications from "../../Components/Notifications";

const AddJobs = () => {
  //Get id from local storage
  const userId = localStorage.getItem("Token");

  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setcompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [description, setDescription] = useState("");
  const [about, setAbout] = useState("");
  const [requirement, setRequirements] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [comEmail, setComEmail] = useState("");
  const [webSiteUrl, setWebSiteUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [linkedInUrl, setLinkedinUrl] = useState("");
  const [descImgUrl, setDescImgUrl] = useState(null);
  const [expDate, setExpDate] = useState("");
  // const postedDate = new Date().toDateString();
  const [postedDate, setPostedDate] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [jobUrgency, setjobUrgency] = useState("");

  //Alert Notification
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const navigate = useNavigate();

  const [error, setError] = useState({
    jobTitleError: "",
    companyNameError: "",
    locationError: "",
    jobTypeError: "",
    descriptionError: "",
    aboutError: "",
    requirementError: "",
    postedByError: "",
    comEmailError: "",
    webSiteUrlError: "",
    facebookUrlError: "",
    twitterUrlError: "",
    linkedInUrlError: "",
    descImgUrlError: "",
    expDateError: "",
    postedDateError: "",
    categoryError: "",
    subCategoryError: "",
    jobUrgencyError: "",
  });

  function postJob(e) {
    e.preventDefault();

    try {
      const spetialCharaterRegex = new RegExp("[^A-Za-z\\s]");
      const emailRegex = new RegExp(
        "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
      );

      if (!jobTitle) {
        var jobTitleError = "Job Title is required";
      } else if (spetialCharaterRegex.test(jobTitle)) {
        var jobTitleError = "Job Title cannot contain special characters";
      } else {
        jobTitleError = "";
      }

      if (!companyName) {
        var companyNameError = "Company Name is required";
      } else if (spetialCharaterRegex.test(companyName)) {
        var companyNameError = "Company Name cannot contain special characters";
      } else {
        companyNameError = "";
      }

      if (category === "Select Category") {
        var categoryError = "Job Category is required";
      } else {
        categoryError = "";
      }

      if (subCategory === "Select Sub Category") {
        var subCategoryError = "Sub Category is required";
      } else {
        subCategoryError = "";
      }

      if (!location) {
        var locationError = "Location is required";
      } else if (spetialCharaterRegex.test(location)) {
        var locationError = "Location cannot contain special characters";
      } else {
        locationError = "";
      }

      if (jobType === "Select Job Type") {
        var jobTypeError = "Job Type is required";
      } else {
        jobTypeError = "";
      }

      if (jobUrgency === "Select Job Urgency") {
        var jobUrgencyError = "Job Urgency is required";
      } else {
        jobUrgencyError = "";
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

      if (!descImgUrl) {
        var descImgUrlError = "Poster Image is required";
      } else {
        descImgUrlError = "";
      }

      if (!description) {
        var descriptionError = "Description is required";
      } else {
        descriptionError = "";
      }

      if (!about) {
        var aboutError = "About is required";
      } else {
        aboutError = "";
      }

      if (!requirement) {
        var requirementError = "Requirement is required";
      } else {
        requirementError = "";
      }

      if (!comEmail) {
        var comEmailError = "Email is required";
      } else if (!emailRegex.test(comEmail)) {
        var comEmailError = "Email is invalid";
      } else {
        comEmailError = "";
      }

      if (!webSiteUrl) {
        var webSiteUrlError = "Website Url is required";
      } else {
        webSiteUrlError = "";
      }

      setError({
        jobTitleError,
        companyNameError,
        locationError,
        jobTypeError,
        descriptionError,
        aboutError,
        requirementError,
        comEmailError,
        webSiteUrlError,
        descImgUrlError,
        expDateError,
        postedDateError,
        categoryError,
        subCategoryError,
        jobUrgencyError,
      });

      console.log(error);

      if (
        !jobTitleError &&
        !companyNameError &&
        !locationError &&
        !jobTypeError &&
        !descriptionError &&
        !aboutError &&
        !requirementError &&
        !comEmailError &&
        !webSiteUrlError &&
        !descImgUrlError &&
        !expDateError &&
        !postedDateError &&
        !categoryError &&
        !subCategoryError &&
        !jobUrgencyError
      ) {
        const fileName = new Date().getTime().toString() + descImgUrl.name;
        const storage = getStorage(app);
        const storageRef = ref(storage, fileName);

        const uploadTask = uploadBytesResumable(storageRef, descImgUrl);

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
            getDownloadURL(uploadTask.snapshot.ref).then((descImgUrl) => {
              console.log("File available at :", descImgUrl);

              const jobDetails = {
                jobTitle,
                companyName,
                location,
                jobType,
                description,
                about,
                requirement,
                postedBy,
                comEmail,
                webSiteUrl,
                facebookUrl,
                twitterUrl,
                instagramUrl,
                linkedInUrl,
                descImgUrl,
                postedDate,
                expDate,
                category,
                subCategory,
                jobUrgency,
              };
              console.log(jobDetails);
              axios
                .post(
                  "https://rwa-webapp.azurewebsites.net/api/jobMgt/CreateJob",
                  jobDetails,
                  {
                    headers: {
                      Authorization: `${userId}`,
                    },
                  }
                )
                .then(() => {
                  setNotify({
                    isOpen: true,
                    message: "Job Vacancy Uploaded Successfully !",
                    type: "success",
                  });
                  setTimeout(() => navigate("/Jobs"), 1500);
                })
                .catch((res) => {
                  setNotify({
                    isOpen: true,
                    message: "Error adding new job",
                    type: "error",
                  });
                });
            });
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="post-new-jobs">
      <div class="topic">Post New Job Vacancy</div>
      <div class="personal-info-container">
        <form class="addJobForm">
          <div className="form-left">
            <div class="topic">Personal Information</div>
            <div class="input-box">
              <input
                type="text"
                required
                onChange={(e) => {
                  setJobTitle(e.target.value);
                }}
              />
              <label>Job Title</label>
            </div>

            {error.jobTitleError && (
              <span
                className="error-message"
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "-15px",
                }}
              >
                {error.jobTitleError}
              </span>
            )}

            <div class="input-box">
              <input
                type="text"
                required
                onChange={(e) => {
                  setcompanyName(e.target.value);
                }}
              />
              <label>Company Name</label>
            </div>

            {error.companyNameError && (
              <span
                className="error-message"
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "-15px",
                }}
              >
                {error.companyNameError}
              </span>
            )}

            <div class="input-box">
              <select
                name="jobCat"
                id="jobCat"
                required
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              >
                <option disabled={true} selected={true}>
                  Select Category
                </option>
                <option value="Information Technology">
                  Information Technology
                </option>
                <option value="Business Management">Business Management</option>
                <option value="Engineering">Engineering</option>
                <option value="Medicine">Medicine</option>
                <option value="Architecture">Architecture </option>
              </select>
              <label>Category</label>
            </div>

            {error.categoryError && (
              <span
                className="error-message"
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "-15px",
                }}
              >
                {error.categoryError}
              </span>
            )}
            <div
              class="input-box"
              style={{
                marginLeft: "45px",
                width: "90%",
              }}
            >
              <select
                name="jobCatSub"
                id="jobCatSub"
                required
                onChange={(e) => {
                  setSubCategory(e.target.value);
                }}
              >
                <option disabled={true} selected={true}>
                  Select Sub Category
                </option>
                {category === "Information Technology" ? (
                  <>
                    <option value="Software Engineering">
                      Software Engineering
                    </option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Development">
                      Mobile Development
                    </option>
                    <option value="Database Management">
                      Database Management
                    </option>
                    <option value="Information Security">
                      Information Security
                    </option>
                    <option value="Network Management">
                      Network Management
                    </option>
                    <option value="Data Science">Data Science</option>
                    <option value="Artificial Intelligence">
                      Artificial Intelligence
                    </option>
                    <option value="Information Technology">
                      Information Technology
                    </option>
                  </>
                ) : category === "Business Management" ? (
                  <>
                    <option value="Accounting">Accounting</option>
                    <option value="Business Administration">
                      Business Administration
                    </option>
                    <option value="Business Management">
                      Business Management
                    </option>
                    <option value="Business Studies">Business Studies</option>
                    <option value="Economics">Economics</option>
                    <option value="Finance">Finance</option>
                    <option value="Human Resource Management">
                      Human Resource Management
                    </option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations Management">
                      Operations Management
                    </option>
                  </>
                ) : category === "Engineering" ? (
                  <>
                    <option value="Aeronautical Engineering">
                      Aeronautical Engineering
                    </option>
                    <option value="Agricultural Engineering">
                      Agricultural Engineering
                    </option>
                    <option value="Biomedical Engineering">
                      Biomedical Engineering
                    </option>
                    <option value="Chemical Engineering">
                      Chemical Engineering
                    </option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Computer Engineering">
                      Computer Engineering
                    </option>
                    <option value="Electrical Engineering">
                      Electrical Engineering
                    </option>
                    <option value="Electronic Engineering">
                      Electronic Engineering
                    </option>
                    <option value="Environmental Engineering">
                      Environmental Engineering
                    </option>
                    <option value="Industrial Engineering">
                      Industrial Engineering
                    </option>
                    <option value="Mechanical Engineering">
                      Mechanical Engineering
                    </option>
                    <option value="Metallurgical Engineering">
                      Metallurgical Engineering
                    </option>
                    <option value="Mining Engineering">
                      Mining Engineering
                    </option>
                    <option value="Nuclear Engineering">
                      Nuclear Engineering
                    </option>
                    <option value="Petroleum Engineering">
                      Petroleum Engineering
                    </option>
                  </>
                ) : category === "Medicine" ? (
                  <>
                    <option value="Anatomy">Anatomy</option>
                    <option value="Anesthesiology">Anesthesiology</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Emergency Medicine">
                      Emergency Medicine
                    </option>
                    <option value="Endocrinology">Endocrinology</option>
                    <option value="Family Medicine">Family Medicine</option>
                    <option value="Gastroenterology">Gastroenterology</option>
                    <option value="General Practice">General Practice</option>
                    <option value="Geriatrics">Geriatrics</option>
                    <option value="Hematology">Hematology</option>
                    <option value="Infectious Disease">
                      Infectious Disease
                    </option>
                    <option value="Internal Medicine">Internal Medicine</option>
                    <option value="Nephrology">Nephrology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Obstetrics and Gynecology">
                      Obstetrics and Gynecology
                    </option>
                    <option value="Oncology">Oncology</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Otolaryngology">Otolaryngology</option>
                  </>
                ) : category === "Architecture" ? (
                  <>
                    <option value="Architecture">Architecture</option>
                    <option value="Landscape Architecture">
                      Landscape Architecture
                    </option>
                    <option value="Urban Planning">Urban Planning</option>
                  </>
                ) : (
                  <></>
                )}
              </select>
              <label>Sub Category</label>
            </div>

            {error.subCategoryError && (
              <span
                className="error-message"
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "-15px",
                }}
              >
                {error.subCategoryError}
              </span>
            )}

            <div class="input-box">
              <input
                type="text"
                required
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
              />
              <label>Location</label>
            </div>

            {error.locationError && (
              <span
                className="error-message"
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "-15px",
                }}
              >
                {error.locationError}
              </span>
            )}

            <div
              class="input-box"
              style={{
                width: "100vw",
                maxWidth: "970px",
                height: "150px",
              }}
            >
              <textarea
                type="text"
                required
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
              <label>Job Description</label>
            </div>
            {error.descriptionError && (
              <span
                className="error-message"
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "60px",
                }}
              >
                {error.descriptionError}
              </span>
            )}

            <div
              class="input-box"
              style={{
                width: "100vw",
                maxWidth: "970px",
                height: "150px",
                marginTop: "100px",
              }}
            >
              <textarea
                type="text"
                required
                onChange={(e) => {
                  setAbout(e.target.value);
                }}
              />
              <label>About the Role</label>
            </div>

            {error.aboutError && (
              <span
                className="error-message"
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "60px",
                }}
              >
                {error.aboutError}
              </span>
            )}

            <div
              class="input-box"
              style={{
                width: "100vw",
                maxWidth: "970px",
                height: "150px",
                marginTop: "100px",
              }}
            >
              <textarea
                type="text"
                style={{
                  whiteSpace: "pre-wrap",
                }}
                required
                onChange={(e) => {
                  setRequirements(e.target.value);
                }}
              />
              <label>Requirements</label>
            </div>
            <br />

            <br />
            <br />
            {error.requirementError && (
              <span
                className="error-message"
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "-15px",
                }}
              >
                {error.requirementError}
              </span>
            )}
          </div>

          <div className="form-right">
            <div
              class="topic"
              style={{
                visibility: "hidden",
              }}
            >
              Personal Information
            </div>

            <div class="input-box">
              <select
                name="jobType"
                id="jobType"
                required
                onChange={(e) => {
                  setJobType(e.target.value);
                }}
              >
                <option disabled={true} selected={true}>
                  Select Job Type
                </option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
              </select>
              <label>Job Type</label>
            </div>

            {error.jobTypeError && (
              <span
                className="error-message"
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "-15px",
                }}
              >
                {error.jobTypeError}
              </span>
            )}

            <div class="input-box">
              <select
                name="jobUrgency"
                id="jobUrgency"
                required
                onChange={(e) => {
                  setjobUrgency(e.target.value);
                }}
              >
                <option disabled={true} selected={true}>
                  Select Job Urgency
                </option>
                <option value="Urgent">Urgent</option>
                <option value="Not Urgent">Not Urgent</option>
              </select>
              <label>Job Urgency</label>
            </div>

            {error.jobUrgencyError && (
              <span
                className="error-message"
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "-15px",
                }}
              >
                {error.jobUrgencyError}
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
                onChange={(e) => {
                  setPostedDate(e.target.value);
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
                  marginTop: "-15px",
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
                onChange={(e) => {
                  setExpDate(e.target.value);
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
                  marginTop: "-15px",
                }}
              >
                {error.expDateError}
              </span>
            )}

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
              Upload Poster <MdCloudUpload style={{ color: "red" }} />
            </span>
            <div class="input-box">
              <input
                type="file"
                required
                style={{ padding: "10px 20px", marginTop: "-22px" }}
                autoFocus={true}
                onChange={(e) => {
                  setDescImgUrl(e.target.files[0]);
                }}
              />
            </div>
            {error.descImgUrlError && (
              <span
                className="error-message"
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "-40px",
                }}
              >
                {error.descImgUrlError}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* ----Social Links----- */}
      <div
        className="personal-info-container"
        style={{
          marginTop: "10px",
        }}
      >
        <form class="addJobForm">
          <div className="form-left">
            <div class="topic">Social Links</div>
            <div
              class="input-box"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <FaEnvelope
                style={{
                  color: "#1a97f5",
                }}
              />
              <>
                <input
                  type="text"
                  style={{
                    width: "92%",
                    marginLeft: "40px",
                  }}
                  required
                  onChange={(e) => {
                    setComEmail(e.target.value);
                  }}
                />
                <label
                  style={{
                    marginLeft: "40px",
                  }}
                >
                  Email
                </label>
              </>
            </div>
            {error.comEmailError && (
              <span
                className="error-message"
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "-15px",
                }}
              >
                {error.comEmailError}
              </span>
            )}
            <div
              class="input-box"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <FaLinkedin
                style={{
                  color: "#1a97f5",
                }}
              />
              <>
                <input
                  type="text"
                  style={{
                    width: "92%",
                    marginLeft: "40px",
                  }}
                  required
                  onChange={(e) => {
                    setLinkedinUrl(e.target.value);
                  }}
                />
                <label
                  style={{
                    marginLeft: "40px",
                  }}
                >
                  LinkedIn
                </label>
              </>
            </div>

            <div
              class="input-box"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <FaGlobe
                style={{
                  color: "#1a97f5",
                }}
              />
              <>
                <input
                  type="text"
                  style={{
                    width: "92%",
                    marginLeft: "40px",
                  }}
                  required
                  onChange={(e) => {
                    setWebSiteUrl(e.target.value);
                  }}
                />
                <label
                  style={{
                    marginLeft: "40px",
                  }}
                >
                  Company Website
                </label>
              </>
            </div>
            {error.webSiteUrlError && (
              <span
                className="error-message"
                style={{
                  fontSize: "12px",
                  color: "red",
                  marginTop: "-15px",
                }}
              >
                {error.webSiteUrlError}
              </span>
            )}

            <br />

            <br />
            <br />
          </div>

          <div className="form-right">
            <div
              class="input-box"
              style={{
                marginTop: "65px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <FaFacebookF
                style={{
                  color: "#1a97f5",
                }}
              />
              <>
                <input
                  type="text"
                  style={{
                    width: "92%",
                    marginLeft: "40px",
                  }}
                  onChange={(e) => {
                    setFacebookUrl(e.target.value);
                  }}
                />
                <label
                  style={{
                    marginLeft: "40px",
                  }}
                >
                  Facebook
                </label>
              </>
            </div>

            <div
              class="input-box"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <FaTwitter
                style={{
                  color: "#1a97f5",
                }}
              />
              <>
                <input
                  type="text"
                  style={{
                    width: "92%",
                    marginLeft: "40px",
                  }}
                  onChange={(e) => {
                    setTwitterUrl(e.target.value);
                  }}
                />
                <label
                  style={{
                    marginLeft: "40px",
                  }}
                >
                  Twitter
                </label>
              </>
            </div>
          </div>
        </form>
      </div>
      <div
        className="submit-btn"
        style={{
          width: "25%",
        }}
      >
        <input
          type="submit"
          value="Post Job"
          onClick={postJob}
          style={{
            width: "100%",
            height: "100%",
            cursor: "pointer",
          }}
        />
      </div>
      <Notifications notify={notify} setNotify={setNotify} />
    </div>
  );
};

export default AddJobs;
