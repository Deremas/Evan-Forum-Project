import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axios";
import styles from "./SignUp.module.css";

import topImage from "../../assets/images/top.svg";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_name: "",
    firs_tname: "",
    last_name: "",
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
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    // Basic validation
    if (
      !formData.user_name ||
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.password
    ) {
      setError("All fields are required!");
      setLoading(false);
      return;
    }

    // Email validation (simple regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/users/register", formData);
      setSuccessMessage(response.data.msg);
      // Reset form after successful registration
      setFormData({
        user_name: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      });
      navigate("/users/login");
      console.log(response);
    } catch (error) {
      setError(
        error.response ? error.response.data.msg : "Something went wrong!"
      );
    }

    setLoading(false);
  };

  return (
    <section className={styles.registerContainer}>
      <div className={styles.leftwrapper}>
        <div className={styles.formContainer}>
          <h1>Join The Network</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>Username</label>
              <input
                type="text"
                name="user_name"
                placeholder="Username"
                value={formData.user_name}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>

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

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Registering..." : "Agree and Join"}
            </button>
          </form>
          <h3 className={styles.terms}>
            I agree to the
            <Link
              className="create"
              to="https://www.evangadi.com/legal/privacy/"
              target="_blank"
            >
              privacy policy
            </Link>
            and{" "}
            <Link
              className="create"
              to="https://www.evangadi.com/legal/terms/"
              target="_blank"
            >
              terms of service.
            </Link>
          </h3>
          <h3>
            Already have an account? <Link to={"users/login"}>Log in</Link>
          </h3>
        </div>
      </div>
      {/* about and image  */}
      <div className={styles.rightWrapper}>
        <img src={topImage} alt="Access top courses and job training" />

        <div className={styles.textContainer}>
          <h1>
            Access To <span>Top Courses And Job Training</span>
          </h1>
        </div>
        <h4>
          Whether you are willing to share your knowledge or looking to meet
          mentors of your own, start by joining the network here.
        </h4>
      </div>
    </section>
  );
}

export default Register;

// import React, { useState } from "react";
// import axiosInstance from "../../API/axios";
// import { Link, useNavigate } from "react-router-dom";
// import styles from "./SignUp.module.css";

// function SignUp({ toggleForm }) {
//   const [passwordVisible, setPasswordVisible] = useState(true);
//   const [signUpData, setSignUpData] = useState({
//     user_name: "",
//     first_name: "",
//     last_name: "",
//     email: "",
//     password: "",
//   });
//   const [responseMsg, setResponseMsg] = useState("");
//   const navigate = useNavigate();
//   // Handle input changes
//   const handleChange = (e) => {
//     setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent default form behavior

//     if (signUpData.password.length < 8) {
//       setResponseMsg("Password must be at least 8 characters");
//       return;
//     }

//     try {
//       const response = await axiosInstance.post("/users/register", signUpData, {
//         headers: { "Content-Type": "application/json" },
//       });

//       if (response.status === 201) {
//         // Use 201 instead of StatusCodes.CREATED
//         setResponseMsg("Registration Successful!");
//         navigate("/users/login");
//       } else {
//         setResponseMsg(response.data.msg || "Registration failed. Try again.");
//       }

//       if (toggleForm) {
//         toggleForm(); // Ensure toggleForm is defined
//       }
//     } catch (error) {
//       setResponseMsg(error.message);
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div className="login__container container col-sm-12 col-md">
//       <h2>Join The Network</h2>
//       <p>
//         Already have an account?
//         <Link className="create" to="/users/login" onClick={toggleForm}>
//           Sign in
//         </Link>
//       </p>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="user_name"
//           placeholder="Username"
//           value={signUpData.user_name}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="first_name"
//           placeholder="First Name"
//           value={signUpData.first_name}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="last_name"
//           placeholder="Last Name"
//           value={signUpData.last_name}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={signUpData.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password (8+ characters)"
//           value={signUpData.password}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit">Register</button>
//       </form>
//       <p>{responseMsg}</p>
//     </div>
//   );
// }

// export default SignUp;

// // import React, { useState } from "react";
// // import axiosInstance from "../../API/axios";

// // function Register() {
// //   const [formData, setFormData] = useState({
// //     user_name: "",
// //     first_name: "",
// //     last_name: "",
// //     email: "",
// //     password: "",
// //   });
// //   const [responseMsg, setResponseMsg] = useState("");

// //   // Handle input changes
// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   // Handle registration submission
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     try {
// //       const response = await axiosInstance("/users/register", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(formData),
// //       });

// //       const data = await response.json();

// //       if (response.ok) {
// //         setResponseMsg(`✅ Registration Successful!`);
// //       } else {
// //         setResponseMsg(`❌ ${data.msg}`);
// //       }
// //     } catch (error) {
// //       setResponseMsg("❌ Failed to connect to the server");
// //       console.error("Error:", error);
// //     }
// //   };

// //   return (
// //     <div>
// //       <h2>Register</h2>
// //       <form onSubmit={handleSubmit}>
// //         <input
// //           type="text"
// //           name="user_name"
// //           placeholder="Username"
// //           value={formData.user_name}
// //           onChange={handleChange}
// //           required
// //         />
// //         <input
// //           type="text"
// //           name="first_name"
// //           placeholder="First Name"
// //           value={formData.first_name}
// //           onChange={handleChange}
// //           required
// //         />
// //         <input
// //           type="text"
// //           name="last_name"
// //           placeholder="Last Name"
// //           value={formData.last_name}
// //           onChange={handleChange}
// //           required
// //         />
// //         <input
// //           type="email"
// //           name="email"
// //           placeholder="Email"
// //           value={formData.email}
// //           onChange={handleChange}
// //           required
// //         />
// //         <input
// //           type="password"
// //           name="password"
// //           placeholder="Password (8+ characters)"
// //           value={formData.password}
// //           onChange={handleChange}
// //           required
// //         />
// //         <button type="submit">Register</button>
// //       </form>
// //       <p>{responseMsg}</p>
// //     </div>
// //   );
// // }

// // export default Register;

// // import React, { useState } from "react";
// // import axiosInstance from "../../API/axios";
// // import { useForm } from "react-hook-form";
// // import { StatusCodes } from "http-status-codes";
// // import { Link } from "react-router-dom";

// // function SignUp({ toggleForm }) {
// //   const [passwordVisible, setPasswordVisible] = useState(true);

// //   // const {
// //   //   register,
// //   //   trigger,
// //   //   handleSubmit,
// //   //   formState: { errors },
// //   //   reset,
// //   // } = useForm();

// //   const [signUpData, setSignUpData] = useState({
// //     user_name: "",
// //     first_name: "",
// //     last_name: "",
// //     email: "",
// //     password: "",
// //   });
// //   const [responseMsg, setResponseMsg] = useState("");

// //   // Handle input changes
// //   const handleChange = (e) => {
// //     setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
// //   };

// //   // Handle registration submission
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     // Ensure password is at least 8 characters
// //     if (signUpData.password.length < 8) {
// //       setResponseMsg("Password must be at least 8 characters");
// //       return;
// //     }

// //     try {
// //       const response = await axiosInstance.post("/users/register", signUpData, {
// //         headers: { "Content-Type": "application/json" },
// //       });

// //       if (response.status === StatusCodes.CREATED) {
// //         setResponseMsg("Registration Successful!");
// //       } else {
// //         setResponseMsg(
// //           `${response.data.msg || "Registration failed. Please try again."}`
// //         );
// //       }
// //       toggleForm();
// //     } catch (error) {
// //       setResponseMsg(error.message);
// //       console.error("Error:", error);
// //     }
// //   };

// //   const togglePasswordVisibility = () => {
// //     setPasswordVisible(!passwordVisible);
// //   };

// //   return (
// //     <div className="login__container container col-sm-12 col-md">
// //       <h2>Join The Network</h2>
// //       <p>
// //         Already have an account?
// //         <Link className="create" onClick={toggleForm}>
// //           Sign in
// //         </Link>
// //       </p>
// //       <form onSubmit={handleSubmit(onsubmit)}>
// //         <input
// //           type="text"
// //           name="user_name"
// //           // className={errors.email && "invalid"}
// //           placeholder="Username"
// //           value={signUpData.user_name}
// //           onChange={handleChange}
// //           required
// //         />
// //         <input
// //           type="text"
// //           name="first_name"
// //           placeholder="First Name"
// //           value={signUpData.first_name}
// //           onChange={handleChange}
// //           required
// //         />
// //         <input
// //           type="text"
// //           name="last_name"
// //           placeholder="Last Name"
// //           value={signUpData.last_name}
// //           onChange={handleChange}
// //           required
// //         />
// //         <input
// //           type="email"
// //           name="email"
// //           placeholder="Email"
// //           value={signUpData.email}
// //           onChange={handleChange}
// //           required
// //         />
// //         <input
// //           type="password"
// //           name="password"
// //           placeholder="Password (8+ characters)"
// //           value={signUpData.password}
// //           onChange={handleChange}
// //           required
// //         />
// //         <button type="submit">Register</button>
// //       </form>
// //       <p>{responseMsg}</p>
// //     </div>
// //   );
// // }

// // export default SignUp;
