import React, { useState } from "react";
import axiosInstance from "../../API/axios";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import topImage from "../../assets/images/top.svg"; // Image for the login page

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Both fields are required!");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/users/login", formData);
      setSuccessMessage(response.data.msg);
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      navigate("/home", { replace: true });
    } catch (error) {
      console.log("Login error:", error);
      setError(
        error.response?.data?.msg || "Something went wrong! Please try again."
      );
    }
    setLoading(false);
  };

  return (
    <section className={styles.loginContainer}>
      <div className={styles.leftWrapper}>
        <div className={styles.formContainer}>
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {successMessage && (
              <div className={styles.success}>{successMessage}</div>
            )}

            <h3 className={styles.forgotPassword}>
              <Link to="/forgot-password">Forgot your password?</Link>
            </h3>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <h3>
            Don't have an account? <Link to="/users/register">Sign up</Link>
          </h3>
        </div>
      </div>

      {/* About and image section */}
      <div className={styles.rightWrapperLogin}>
        <div className={styles.overridephoto}>
          <img src={topImage} alt="Top Courses and Job Training" />
          <div className={styles.textContainer}>
            <h1>
              <span>5 Stage</span> Unique Learning Method
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;

// import React, { useState, useContext } from "react";
// import axios from "../../API/axios";
// import { useNavigate } from "react-router-dom";
// import { UserContext } from "../../Context/UserProvider";
// import styles from "./Login.module.css";

// function Login() {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [responseMsg, setResponseMsg] = useState("");
//   const navigate = useNavigate();
//   const [user, setUser] = useContext(
//     UserContext({
//       user_name: "",
//       user_name: "",
//     })
//   );

//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle login submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post("/users/login", formData, {
//         headers: { "Content-Type": "application/json" },
//       });

//       const data = response.data;
//       if (response.status === 200) {
//         // Save the JWT token
//         localStorage.setItem("token", data.token);

//         // Set the user data in UserContext
//         setUser({ user_id: data.user_id, user_name: data.user_name });
//         console.log(data.user_name);
//         setResponseMsg("Login Successful!");
//         navigate("/home");
//       } else {
//         setResponseMsg(data.msg || "Login failed");
//       }
//     } catch (error) {
//       setResponseMsg(error.message);
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit">Login</button>
//       </form>
//       <p>{responseMsg}</p>

//       {/* Added the SignUp button here */}
//       <button onClick={() => navigate("/users/register")}>
//         Don't have an account? Sign Up
//       </button>
//     </div>
//   );
// }

// export default Login;

// import React, { useState, useContext, useEffect } from "react";
// import axios from "../../API/axios";
// import { useNavigate } from "react-router-dom";
// import { UserContext } from "../../Context/UserProvider";

// function Login() {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [responseMsg, setResponseMsg] = useState("");
//   const navigate = useNavigate();
//   const [user, setUser] = useContext(UserContext);

//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle login submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post("/users/login", formData, {
//         headers: { "Content-Type": "application/json" },
//       });

//       const data = response.data;
//       if (response.status === 200) {
//         // Save the JWT token
//         localStorage.setItem("token", data.token);

//         // Set the user data in UserContext
//         setUser({ user_id: data.user_id, user_name: data.user_name });

//         setResponseMsg("Login Successful!");
//         navigate("/home")
//       } else {
//         setResponseMsg(data.msg || "Login failed");
//       }
//     } catch (error) {
//       setResponseMsg(error.message);
//       console.error("Error:", error);
//     }
//   };

//   // useEffect(() => {
//   //   if (user?.user_name && window.location.pathname !== "/home") {
//   //     navigate("/home", { replace: true });
//   //   }
//   // }, [user, navigate]);

//   // useEffect(() => {
//   //   if (user?.user_name) {
//   //     setTimeout(() => {
//   //       navigate("/home", { replace: true });
//   //     }, 0);
//   //   }
//   // }, [user]);

//   // useEffect(() => {
//   //   if (user?.user_name) {
//   //     const redirectPath =
//   //       localStorage.getItem("redirectAfterLogin") || "/home";
//   //     localStorage.removeItem("redirectAfterLogin"); // Clear stored redirect path

//   //     // Use setTimeout to prevent state update loop
//   //     setTimeout(() => {
//   //       navigate(redirectPath, { replace: true });
//   //     }, 0);
//   //   }
//   // }, [user]); // Only trigger on `user` change, remove `navigate`
//   // // Redirect user after login success
//   // useEffect(() => {
//   //   if (user?.user_name) {
//   //     const redirectPath =
//   //       localStorage.getItem("redirectAfterLogin") || "/home";
//   //     localStorage.removeItem("redirectAfterLogin"); // Clear stored redirect path
//   //     navigate(redirectPath, { replace: true });
//   //   }
//   // }, [user, navigate]);

//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit">Login</button>
//       </form>
//       <p>{responseMsg}</p>
//     </div>
//   );
// }

// export default Login;

// import React, { useState, useContext, useEffect } from "react";
// import axios from "../../API/axios";
// import { useNavigate } from "react-router-dom";
// import { UserContext } from "../../Context/UserProvider"; // Import UserContext

// function Login() {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [responseMsg, setResponseMsg] = useState("");
//   const [redirectToHome, setRedirectToHome] = useState(false);
//   const navigate = useNavigate();

//   // Get the setUser function from UserContext
//   const [user, setUser] = useContext(UserContext);

//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle login submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post("/users/login", formData, {
//         headers: { "Content-Type": "application/json" },
//       });

//       const data = response.data;
//       console.log(data);
//       if (response.status === 200) {
//         // Save the JWT token
//         localStorage.setItem("token", data.token);

//         // Set the user data in UserContext
//         setUser({ user_id: data.user_id, user_name: data.user_name });

//         setResponseMsg("Login Successful!");
//         setRedirectToHome(true); // Trigger redirection after setting user state

//         // navigate("/home", { replace: true }); // Perform navigation after state change to an absolute path
//       } else {
//         setResponseMsg(data.msg || "Login failed");
//       }
//     } catch (error) {
//       setResponseMsg(error.message);
//       console.error("Error:", error);
//     }
//   };

//   // Handle redirect after login success
//   // useEffect(() => {
//   if (redirectToHome) {
//     navigate("/home"); // Perform navigation after state change to an absolute path
//     //   }
//     // }, [redirectToHome, navigate]);

//     return (
//       <div>
//         <h2>Login</h2>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//           <button type="submit">Login</button>
//         </form>
//         <p>{responseMsg}</p>
//       </div>
//     );
//   }
// }
// export default Login;
