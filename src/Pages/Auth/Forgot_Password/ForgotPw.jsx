import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "../Signup/styles.module.scss";

const ForgotPw = () => {
  const res = "";
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "https://rwa-webapp.azurewebsites.net/api/admin/EmailCheck";
      const { data: res } = await axios.post(url, data);
      navigate("/notice");
      console.log(res.message);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="adminRegisterContainer mt-5">
      <div className={styles.signup_container}>
        <div className={styles.signup_form_container}>
          <div className={styles.left}>
            <h1>Forgot Password</h1>
            <span
              style={{
                fontSize: "16px",
                marginBottom: "10px",
                color: "white",
                textAlign: "center",
                marginLeft: "10px",
                marginRight: "10px",
              }}
            >
              Enter your email address and we'll send you a link to reset your
              password.
            </span>

            <img
              style={{
                maxWidth: "250px",
                maxHeight: "250px",
              }}
              src="https://res.cloudinary.com/desnqqj6a/image/upload/v1658040973/Forgot_password-cuate_1_rpyxak.png"
              alt=""
            />
          </div>
          <div className={styles.right}>
            <form className={styles.form_container} onSubmit={handleSubmit}>
              <h1 style={{ textAlign: "center" }}>Please Enter Your Email</h1>
              <input
                type="text"
                style={{ maxWidth: "400px", margin: "20px 0px" }}
                placeholder="Email"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
                className={styles.input}
              />

              {error && <div className={styles.error_msg}>{error}</div>}
              <button type="submit" className={styles.green_btn}>
                Send
              </button>

              {res && res === "success" ? (
                <div className={styles.success_msg}>
                  <h1
                    style={{
                      fontSize: "1.5rem",
                    }}
                  >
                    Password Reset Link Sent
                  </h1>
                  <p>Please check your email for the password reset link.</p>
                  <Link to="/login">
                    <button
                      style={{
                        marginTop: "1rem",
                        backgroundColor: "#1a97f5",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        fontSize: "1rem",
                        borderRadius: "20px",
                      }}
                    >
                      Back To Login
                    </button>
                  </Link>
                </div>
              ) : res && res === "error" ? (
                <div className={styles.error_msg}>
                  <h1
                    style={{
                      fontSize: "1.5rem",
                    }}
                  >
                    Error
                  </h1>
                  <p>There was an error sending your password reset link.</p>
                  <Link to="/login">
                    <button
                      style={{
                        marginTop: "1rem",
                        backgroundColor: "#1a97f5",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        fontSize: "1rem",
                        borderRadius: "20px",
                      }}
                    >
                      Back To Login
                    </button>
                  </Link>
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPw;
