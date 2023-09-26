import React, { useEffect, useState } from "react";
import {
  FaUserTie,
  FaCalendarDay,
  FaPhoneAlt,
  FaEnvelopeOpenText,
  FaMapPin,
} from "react-icons/fa";
import "./CandidateProfile.scss";
import { BsFillFileEarmarkTextFill } from "react-icons/bs";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container } from "react-bootstrap";

const UserDetails = () => {
  const UseParams = useParams();

  const id = UseParams.id;
  //Get the user from local storage
  const Token = window.localStorage.getItem("Token");
  console.log(Token);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    phoneNo: "",
    cv: "",
    imageUrl: "",
    dob: "",
    address: "",
    description: "",
    heading: "",
    createdDate: "",
    fburl: "",
    instaurl: "",
    lnkdinurl: "",
    pturl: "",
    tturl: "",
  });
  useEffect(() => {
    axios
      .get(
        `https://rwa-webapp.azurewebsites.net/api/userMgt/GetOneUser/${id}`,
        {
          headers: {
            Authorization: `${Token}`,
          },
        }
      )
      .then((res) => {
        setData(res.data.user);
        // console.log(res.data.logedUser);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  console.log(data);
  return (
    <Container className="profile-container">
      <div className="header-text-topic">Candidate Profile</div>
      <div className="profile-container__header">
        <div className="profile-container__header-left">
          <div className="profile-container__header-left-image">
            <img
              src={
                data.imageUrl
                  ? data.imageUrl
                  : "https://www.clevelanddentalhc.com/wp-content/uploads/2018/03/sample-avatar.jpg"
              }
              alt=""
            />
          </div>

          <div className="profile-container__header-left-content">
            <div className="profile-container__header-left-content-name">
              <span>{data.fullName}</span>
              <span>{data.heading || "User did not update header"}</span>
            </div>
          </div>
        </div>

        <div className="profile-container__header-right">
          <div className="profile-container__header-right-content"></div>
        </div>
      </div>

      <div className="profile-container__body">
        <div className="profile-container__body-content">
          {
            <div className="profile-container__body-content-about">
              <div className="profile-container__body-content-about-left">
                <div className="profile-container__body-content-about-left-header">
                  <h5>Personal Information</h5>
                </div>
                <div className="profile-container__body-content-about-left-content">
                  <div className="profile-container__body-content-about-left-content-item">
                    <div className="profile-container__body-content-about-left-content-item-icon">
                      <FaUserTie />
                    </div>
                    <div className="profile-container__body-content-about-left-content-item-text">
                      <span>Full Name</span>
                      <span>{data.fullName}</span>
                    </div>
                  </div>

                  <div className="profile-container__body-content-about-left-content-item">
                    <div className="profile-container__body-content-about-left-content-item-icon">
                      <FaCalendarDay />
                    </div>
                    <div className="profile-container__body-content-about-left-content-item-text">
                      <span>Date of Birth</span>
                      <span>{data.dob || "User did not update this data"}</span>
                    </div>
                  </div>

                  <div className="profile-container__body-content-about-left-content-item">
                    <div className="profile-container__body-content-about-left-content-item-icon">
                      <FaPhoneAlt />
                    </div>
                    <div className="profile-container__body-content-about-left-content-item-text">
                      <span>Contact Number</span>
                      <span>
                        {data.phoneNo || "User did not update this data"}
                      </span>
                    </div>
                  </div>

                  <div className="profile-container__body-content-about-left-content-item">
                    <div className="profile-container__body-content-about-left-content-item-icon">
                      <FaEnvelopeOpenText />
                    </div>
                    <div className="profile-container__body-content-about-left-content-item-text">
                      <span>Email</span>
                      <span>{data.email}</span>
                    </div>
                  </div>

                  <div className="profile-container__body-content-about-left-content-item">
                    <div className="profile-container__body-content-about-left-content-item-icon">
                      <FaMapPin />
                    </div>
                    <div className="profile-container__body-content-about-left-content-item-text">
                      <span>Address</span>
                      <span>
                        {data.address || "User did not update this data"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="vl"></div>

              <div className="profile-container__body-content-about-right">
                <div className="profile-container__body-content-about-right-description">
                  <h6>Bio</h6>
                  <span>
                    {data.description || "User did not update this data"}
                  </span>
                </div>

                <div className="profile-container__body-content-about-right-content">
                  <div className="profile-container__body-content-about-right-content-icon">
                    <FaEnvelopeOpenText />
                  </div>
                  <div className="profile-container__body-content-about-right-content-text">
                    <span>Portfolio Link</span>
                    <span>{data.pturl || "User did not update this data"}</span>
                  </div>
                </div>

                <div className="profile-container__body-content-about-right-resume">
                  <div className="profile-container__body-content-about-right-resume-header">
                    <h6>Resume</h6>
                  </div>

                  <div className="profile-container__body-content-about-right-resume-content">
                    <div className="CV">
                      <div className="profile-container__body-content-about-right-resume-content-icon">
                        <BsFillFileEarmarkTextFill
                          onClick={() =>
                            window.open(
                              "http://www.africau.edu/images/default/sample.pdf"
                            )
                          }
                          style={{
                            cursor: "pointer",
                          }}
                        />
                      </div>
                      {/* {data.cv === true ? (
                        <div className="profile-container__body-content-about-right-resume-content-icon">
                          <BsFillFileEarmarkTextFill
                            onClick={() => window.open(data.cv)}
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        </div>
                      ) : (
                        <span>User did not update resum </span>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </Container>
  );
};

export default UserDetails;
