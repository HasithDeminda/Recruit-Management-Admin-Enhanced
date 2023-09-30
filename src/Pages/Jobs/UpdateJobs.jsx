import React, { useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import "./AddJobs.scss";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
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
import { useEffect } from "react";
import Notifications from "../../Components/Notifications";
import { css } from "@emotion/react";
import { PropagateLoader } from "react-spinners";

const UpdateJobs = () => {
  //Get id from local storage
  const userId = localStorage.getItem("Token");
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const { id } = useParams();

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
  const [descImgUrl, setDescImgUrl] = useState("");
  const [expDate, setExpDate] = useState("");
  const [postedDate, setPostedDate] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [jobUrgency, setjobUrgency] = useState("");

  //Get job post
  useEffect(() => {
    const getJob = async () => {
      setLoading(true);
      const job = await axios
        .get(
          `https://rwa-webapp.azurewebsites.net/api/jobMgt/GetSpecificJob/${id}`
        )
        .then((response) => {
          return response.data.job;
        })
        .catch((error) => {
          console.log(error);
        });

      setJobTitle(job.jobTitle);
      setcompanyName(job.companyName);
      setLocation(job.location);
      setJobType(job.jobType);
      setDescription(job.description);
      setAbout(job.about);
      setRequirements(job.requirement);
      setPostedBy(job.postedBy);
      setComEmail(job.comEmail);
      setWebSiteUrl(job.webSiteUrl);
      setFacebookUrl(job.facebookUrl);
      setTwitterUrl(job.twitterUrl);
      setInstagramUrl(job.instagramUrl);
      setLinkedinUrl(job.linkedInUrl);
      setDescImgUrl(job.descImgUrl);
      setExpDate(job.expDate);
      setPostedDate(job.postedDate);
      setCategory(job.category);
      setSubCategory(job.subCategory);
      setjobUrgency(job.jobUrgency);
      setLoading(false);
    };

    getJob();
  }, []);

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

  function updateJob(e) {
    e.preventDefault();

    try {
      setBtnLoading(true);

      //Regex for validation
      const spetialCharaterRegex = new RegExp("[^A-Za-z\\s\\-\\,\\|]"); //Allowes only - , | and space
      const emailRegex = new RegExp(
        "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
      );
      const maxLengthRegex = /^.{1,50}$/;

      const urlRegex = new RegExp("^(https?|ftp)://[^\\s/$.?#].[^\\s]*$");

      if (!jobTitle) {
        var jobTitleError = "Job Title is required";
      } else if (spetialCharaterRegex.test(jobTitle)) {
        var jobTitleError = "Job Title cannot contain special characters";
      } else if (!maxLengthRegex.test(jobTitle)) {
        var jobTitleError = "Job Title cannot exceed 50 characters";
      } else {
        jobTitleError = "";
      }

      if (!companyName) {
        var companyNameError = "Company Name is required";
      } else if (spetialCharaterRegex.test(companyName)) {
        var companyNameError = "Company Name cannot contain special characters";
      } else if (!maxLengthRegex.test(companyName)) {
        var companyNameError = "Company Name cannot exceed 50 characters";
      } else {
        companyNameError = "";
      }

      if (!category) {
        var categoryError = "Job Category is required";
      } else if (category === "Select Category") {
        var categoryError = "Job Category is required";
      } else {
        categoryError = "";
      }

      if (!subCategory) {
        var subCategoryError = "Sub Category is required";
      } else if (subCategory === "Select Sub Category") {
        var subCategoryError = "Sub Category is required";
      } else {
        subCategoryError = "";
      }

      if (!location) {
        var locationError = "Location is required";
      } else if (spetialCharaterRegex.test(location)) {
        var locationError = "Location cannot contain special characters";
      } else if (!maxLengthRegex.test(location)) {
        var locationError = "Location cannot exceed 50 characters";
      } else {
        locationError = "";
      }

      if (!jobType) {
        var jobTypeError = "Job Type is required";
      } else if (jobType === "Select Job Type") {
        var jobTypeError = "Job Type is required";
      } else {
        jobTypeError = "";
      }

      if (!jobUrgency) {
        var jobUrgencyError = "Job Urgency is required";
      } else if (jobUrgency === "Select Job Urgency") {
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
      } else if (!urlRegex.test(webSiteUrl)) {
        var webSiteUrlError = "Website Url is invalid";
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
            setBtnLoading(false);
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
                .patch(
                  `https://rwa-webapp.azurewebsites.net/api/jobMgt/UpdateJob/${id}`,
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
                    message: "Job Details Updated Successfully !",
                    type: "success",
                  });
                  setTimeout(() => navigate("/Jobs"), 1500);
                })
                .catch((res) => {
                  setNotify({
                    isOpen: true,
                    message: "Error updating job",
                    type: "error",
                  });
                })
                .finally(() => {
                  setBtnLoading(false); // Set loading state to false after request is complete
                });
            });
          }
        );
      } else {
        setBtnLoading(false); // Set loading state to false on validation error
      }
    } catch (error) {
      console.log(error);
      setBtnLoading(false);
    }
  }

  return (
    <>
      {loading ? (
        <div
          className="loader"
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            position: "fixed",
            top: "50%",
            left: "50%",
            width: "100%",
            height: "100%",
            zIndex: 999,
          }}
        >
          <PropagateLoader
            color={"#1A97F5"}
            loading={loading}
            css={override}
            size={20}
          />
        </div>
      ) : (
        <div className="post-new-jobs">
          <div class="topic">Update Job Vacancy</div>
          <div class="personal-info-container">
            <form class="addJobForm">
              <div className="form-left">
                <div class="topic">Personal Information</div>
                <div class="input-box">
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => {
                      setJobTitle(e.target.value);
                    }}
                  />
                  <label>Job Title</label>
                </div>
                <div class="input-box">
                  <input
                    type="text"
                    required
                    value={companyName}
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

                <div className="input-box">
                  <select
                    name="jobCat"
                    id="jobCat"
                    required
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setError({ ...error, categoryError: "" });
                    }}
                  >
                    <option value="default" disabled>
                      Select Category
                    </option>
                    <option value="Information Technology">
                      Information Technology
                    </option>
                    <option value="Business Management">
                      Business Management
                    </option>
                    <option value="Engineering">Engineering</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Architecture">Architecture</option>
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
                    value={subCategory}
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
                        <option value="Business Studies">
                          Business Studies
                        </option>
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
                        <option value="Civil Engineering">
                          Civil Engineering
                        </option>
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
                        <option value="Gastroenterology">
                          Gastroenterology
                        </option>
                        <option value="General Practice">
                          General Practice
                        </option>
                        <option value="Geriatrics">Geriatrics</option>
                        <option value="Hematology">Hematology</option>
                        <option value="Infectious Disease">
                          Infectious Disease
                        </option>
                        <option value="Internal Medicine">
                          Internal Medicine
                        </option>
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
                    value={location}
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
                    value={description}
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
                    value={about}
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
                    required
                    value={requirement}
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
                    value={jobType}
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
                    value={jobUrgency}
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
                    value={postedDate.toString().slice(0, 10)}
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
                    value={expDate.toString().slice(0, 10)}
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
                    // value={descImgUrl.toString()}
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
                      value={comEmail}
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
                      value={linkedInUrl}
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
                      value={webSiteUrl}
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
                      value={facebookUrl}
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
                      value={twitterUrl}
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

          <button
            className="submit-btn"
            type="submit"
            onClick={updateJob}
            disabled={btnLoading}
          >
            {btnLoading ? "Updating..." : "Update Job"}
          </button>

          <Notifications notify={notify} setNotify={setNotify} />
        </div>
      )}
    </>
  );
};

const override = css`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
`;

export default UpdateJobs;
