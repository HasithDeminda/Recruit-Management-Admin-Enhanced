import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import styles from "../Login/styles.module.scss";
import Notifications from "../../../Components/Notifications";

const ResetPw = () => {
  const [data, setData] = useState({ password: "", cpassword: "" });
  const [error, setError] = useState("");

  const UseParams = useParams();
  const link = UseParams.link;

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (data.password !== data.cpassword) {
        setError("Passwords do not match");
      } else if (data.password.length < 6) {
        setError("Password must be at least 6 characters");
      } else {
        const url = `https://rwa-webapp.azurewebsites.net/api/admin/ForgotPassword/${link}`;
        const { data: res } = await axios.patch(url, data);
        setNotify({
          isOpen: true,
          message: "Password Reset successful",
          type: "success",
        });
        setTimeout(() => (window.location.href = "/login"), 1500);
      }
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
    <div className={styles.admin_login_container + " mt-5"}>
      <div className={styles.login_container}>
        <div className={styles.login_form_container}>
          <div className={styles.left}>
            <form className={styles.form_container} onSubmit={handleSubmit}>
              <h1>Reset Your Password</h1>

              <input
                type="password"
                placeholder="New Password"
                name="password"
                onChange={handleChange}
                value={data.password}
                required
                className={styles.input}
              />
              <input
                type="password"
                placeholder="Re Enter New Password"
                name="cpassword"
                onChange={handleChange}
                value={data.cpassword}
                required
                className={styles.input}
              />
              {error && <div className={styles.error_msg}>{error}</div>}
              <button type="submit" className={styles.green_btn}>
                Reset
              </button>
            </form>
          </div>
          <div className={styles.right}>
            <h1>Reset Password</h1>
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
              Please enter your new password and re-enter your new password to
              reset your password.
            </span>

            <img
              style={{
                maxWidth: "250px",
                maxHeight: "250px",
              }}
              src="https://res.cloudinary.com/desnqqj6a/image/upload/v1658041185/Reset_password-amico_rslddp.png"
              alt=""
            />
          </div>
        </div>
      </div>
      <Notifications notify={notify} setNotify={setNotify} />
    </div>
  );
};

export default ResetPw;
