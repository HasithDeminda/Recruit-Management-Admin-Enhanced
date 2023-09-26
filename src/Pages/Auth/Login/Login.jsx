import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "https://rwa-webapp.azurewebsites.net/api/admin/AdminLogin";
      const { data: res } = await axios.post(url, data);

      localStorage.setItem("Token", res.token);
      window.location = "/";
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
              <h1>Login to Your Account</h1>
              <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
                className={styles.input}
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={data.password}
                required
                className={styles.input}
              />

              <div
                className="forgot_password"
                style={{
                  marginTop: "-20px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    color: "#8c8c8c",
                    marginLeft: "15vw",
                    textAlign: "right",
                  }}
                >
                  <Link to="/forgotpw">Forgot Password?</Link>
                </span>
              </div>
              {error && <div className={styles.error_msg}>{error}</div>}
              <button type="submit" className={styles.green_btn}>
                Sign In
              </button>
            </form>
          </div>
          <div className={styles.right}>
            <h1>Welcome Back!</h1>
            <span
              style={{ fontSize: "16px", marginBottom: "10px", color: "white" }}
            >
              Please Enter Your Credentials for Login
            </span>

            <img
              style={{
                maxWidth: "250px",
                maxHeight: "250px",
              }}
              src="https://res.cloudinary.com/desnqqj6a/image/upload/v1657950148/Mobile_login-bro_1_wi7wee.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
