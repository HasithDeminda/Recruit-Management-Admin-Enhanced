import React from "react";
import { Link } from "react-router-dom";
import "./Landing.scss";

const Landing = () => {
  return (
    <div className="home-container">
      <section>
        <header>
          <h2>
            <a href="" className="logo">
              <img
                style={{ width: "50%", height: "50%" }}
                src="https://res.cloudinary.com/desnqqj6a/image/upload/v1657948633/The_Eagle-removebg-preview_lip2mv.png"
                alt=""
              />
            </a>
          </h2>
        </header>
        <div className="content">
          <div className="info">
            <h2 style={{ fontSize: "52px" }}>
              R E C R U I T M E N T <br />
              <span>Job Seekers Website</span>
            </h2>
            <p style={{ color: "white" }}>
              RECRUITMENT Websie is a website that helps you to find the best
              job for you. This is the Admin & Maintainer portal for the
              website.
            </p>
            <Link to="/login" className="info-btn">
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
