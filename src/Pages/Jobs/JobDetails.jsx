import React, { useEffect, useState } from "react";
import "./JobDetails.scss";
import { FaBuilding, FaCalendarCheck, FaCalendarTimes } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";

import { ImLocation } from "react-icons/im";
import { Container } from "react-bootstrap";

const JobDetails = () => {
  const { id } = useParams();

  const [_id, set_id] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setcompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [description, setDescription] = useState("");
  const [about, setAbout] = useState("");
  const [requirement, setRequirement] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [comEmail, setComEmail] = useState("");
  const [webSiteUrl, setWebSiteUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [descImgUrl, setDescImgUrl] = useState(null);
  const [expDate, setExpDate] = useState("");
  const [postedDate, setPostedDate] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [jobUrgency, setjobUrgency] = useState("");

  console.log(jobUrgency);

  useEffect(() => {
    function getDetails() {
      axios
        .get(
          `https://rwa-webapp.azurewebsites.net/api/jobMgt/GetSpecificJob/${id}`
        )

        .then((res) => {
          set_id(res.data.job._id);
          setJobTitle(res.data.job.jobTitle);
          setcompanyName(res.data.job.companyName);
          setLocation(res.data.job.location);
          setJobType(res.data.job.jobType);
          setDescription(res.data.job.description);
          setAbout(res.data.job.about);
          setRequirement(res.data.job.requirement);
          setPostedBy(res.data.job.postedBy);
          setComEmail(res.data.job.comEmail);
          setWebSiteUrl(res.data.job.webSiteUrl);
          setFacebookUrl(res.data.job.facebookUrl);
          setTwitterUrl(res.data.job.twitterUrl);
          setInstagramUrl(res.data.job.instagramUrl);
          setLinkedinUrl(res.data.job.linkedinUrl);
          setDescImgUrl(res.data.job.descImgUrl);
          setExpDate(res.data.job.expDate);
          setPostedDate(res.data.job.postedDate);
          setCategory(res.data.job.category);
          setSubCategory(res.data.job.subCategory);
          setjobUrgency(res.data.job.jobUrgency);

          console.log(res.data.job);
        })

        .catch((err) => {
          alert(err.message);
        });
    }

    getDetails();
  }, []);
  return (
    <div>
      <Container className="job-details-container">
        <div className="job-details-container__header">
          <div className="job-details-container__header-left">
            <div className="job-details-container__header-left-topic">
              <span>{jobTitle}</span>
            </div>

            <div className="job-details-container__header-left-companydata">
              <div className="job-details-container__header-left-companydata-company">
                <FaBuilding
                  style={{
                    color: "#17bf9e",
                  }}
                />
                <span>{companyName}</span>
              </div>

              <div className="job-details-container__header-left-companydata-location">
                <ImLocation
                  style={{
                    color: "#17bf9e",
                  }}
                />
                <span>{location}</span>
              </div>
            </div>

            <div className="job-details-container__header-left-jobtype">
              <div className="job-details-container__header-left-jobtype-time">
                <button>{jobType}</button>
              </div>

              {/* {jobUrgency === "Urgent" ? ( */}
              <div className="job-details-container__header-left-jobtype-urgency">
                <button>Urgent</button>
              </div>
              {/* ) : null} */}
            </div>
          </div>
          <div className="job-details-container__header-right">
            <div className="job-details-container__header-right-image">
              <img
                src="https://res.cloudinary.com/desnqqj6a/image/upload/v1657546136/Resume_folder-bro_oa6te4.png"
                alt=""
              />
            </div>
          </div>
        </div>

        <div
          className="job-details-container__body"
          style={{
            whiteSpace: "pre-wrap",
            marginTop: "20px",
          }}
        >
          <div className="job-details-container__body-description">
            <div className="job-details-container__body-description-header">
              <h4>
                <strong>Description</strong>
              </h4>
            </div>
            {description}
          </div>

          <div
            className="job-details-container__body-description"
            style={{
              whiteSpace: "pre-wrap",
            }}
          >
            <div className="job-details-container__body-description-header">
              <h4>
                <strong>About the Role</strong>
              </h4>
            </div>
            {about}
          </div>

          <div
            className="job-details-container__body-description"
            style={{
              whiteSpace: "pre-wrap",
            }}
          >
            <div className="job-details-container__body-description-header">
              <h4>
                <strong>Requirements</strong>
              </h4>
            </div>
            {requirement}
          </div>
        </div>

        <div className="job-details-container__footer">
          <div className="job-details-container__footer-content">
            <div className="job-details-container__footer-content-left">
              <img src={descImgUrl} alt="" />
            </div>
            <div className="job-details-container__footer-content-right">
              <div className="job-details-container__footer-content-right-dates">
                <div
                  className="job-details-container__footer-content-right-dates-postedOn"
                  style={{
                    marginLeft: "-20px",
                  }}
                >
                  <div className="job-details-container__footer-content-right-dates-postedOn-icon">
                    <FaCalendarCheck />
                  </div>
                  <div className="job-details-container__footer-content-right-dates-postedOn-content">
                    <div className="job-details-container__footer-content-right-dates-postedOn-content-title">
                      Posted On
                    </div>
                    <div className="job-details-container__footer-content-right-dates-postedOn-content-datetime">
                      {postedDate.slice(0, 10)}
                    </div>
                  </div>
                </div>

                <div className="job-details-container__footer-content-right-dates-experingon">
                  <div className="job-details-container__footer-content-right-dates-experingon-icon">
                    <FaCalendarTimes />
                  </div>
                  <div className="job-details-container__footer-content-right-dates-experingon-content">
                    <div className="job-details-container__footer-content-right-dates-experingon-content-title">
                      Expering On
                    </div>
                    <div className="job-details-container__footer-content-right-dates-experingon-content-datetime">
                      {expDate.slice(0, 10)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default JobDetails;
