import React, { useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";

const CheckEmail = () => {
  return (
    <>
      <div className="adminRegisterContainer mt-5">
        <div
          className={styles.signup_container}
          style={{
            maxWidth: "500px",
            margin: "0 auto",
            padding: "0px",
            backgroundColor: "white",
          }}
        >
          <div
            className={styles.left}
            style={{
              marginTop: "0px",
              borderRadius: "25px",
              boxShadow:
                "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
              backgroundColor: "white",
            }}
          >
            <h1
              style={{
                marginTop: "25px",
                color: "#17bf9e",
                textAlign: "center",
                fontWeight: "600",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Email Sent Successfully!
              <br />
              <span style={{ textAlign: "center" }}>
                <BsCheckCircleFill />
              </span>
            </h1>
            <span
              style={{
                fontSize: "16px",
                margin: "10px",
                textAlign: "center",
                color: "white",
                color: "#1a97f5",
              }}
            >
              Please check your email for the verification link.
            </span>

            <img
              style={{
                maxWidth: "250px",
                maxHeight: "250px",
              }}
              src="https://res.cloudinary.com/desnqqj6a/image/upload/v1658066448/Confirmed-bro_eh5pv1.png"
              alt=""
            />

            <Link to="/login">
              <button
                type="button"
                className={styles.green_btn}
                style={{
                  margin: "25px",
                  backgroundColor: "#1a97f5",
                  color: "white",
                  border: "none",
                  borderRadius: "25px",
                  padding: "10px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Back to Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckEmail;
