// import React, { useState } from "react";
// import axiosInstance from "../../API/axios";

// function PostQuestion() {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     tag: "",
//   });
//   const [responseMsg, setResponseMsg] = useState("");

//   // Handle Input Changes
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle Form Submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Retrieve the user ID and token from localStorage
//     const userId = localStorage.getItem("user_id"); // Assuming user_id is stored in localStorage
//     const token = localStorage.getItem("token"); // Assuming the JWT token is stored in localStorage

//     if (!token) {
//       setResponseMsg("❌ Please log in first.");
//       return;
//     }

//     // Add user_id to formData
//     const questionData = { ...formData, user_id: userId };

//     try {
//       const response = await axiosInstance.post(
//         "/questions/post-question",
//         questionData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, // Include the token in the headers
//           },
//         }
//       );

//       // Assuming response contains { question_id } if successful
//       const data = response.data;

//       if (response.status === 200) {
//         setResponseMsg(`✅ Question Posted! Question ID: ${data.question_id}`);
//       } else {
//         setResponseMsg(`❌ Error: ${data.msg || "Something went wrong"}`);
//       }
//     } catch (error) {
//       setResponseMsg("❌ Failed to connect to the server");
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <>
//       <h2>Ask a Question</h2>
//       <form id="questionForm" onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="title"
//           placeholder="Title"
//           value={formData.title}
//           onChange={handleChange}
//           required
//         />
//         <textarea
//           name="description"
//           placeholder="Describe your question"
//           value={formData.description}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="user_id"
//           placeholder="User ID"
//           value={formData.user_id}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="tag"
//           placeholder="Tags (optional)"
//           value={formData.tag}
//           onChange={handleChange}
//         />
//         <button type="submit">Post Question</button>
//       </form>

//       <div id="response"></div>
//     </>
//   );
// }

// export default PostQuestion;

// import React, { useState } from "react";
// import axiosInstance from "../../API/axios";

// function PostQuestion() {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     tag: "",
//   });
//   const [responseMsg, setResponseMsg] = useState("");

//   // Handle Input Changes
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle Form Submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Retrieve the user ID and token from localStorage
//     const userId = localStorage.getItem("user_id"); // Assuming user_id is stored in localStorage
//     const token = localStorage.getItem("token"); // Assuming the JWT token is stored in localStorage

//     if (!token) {
//       setResponseMsg("❌ Please log in first.");
//       return;
//     }

//     // Add user_id to formData
//     const questionData = { ...formData, user_id: userId };

//     try {
//       const response = await axiosInstance.post(
//         "/questions/post-question",
//         questionData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, // Include the token in the headers
//           },
//         }
//       );

//       // Assuming response contains { question_id } if successful
//       const data = response.data;

//       if (response.status === 200) {
//         setResponseMsg(`✅ Question Posted! Question ID: ${data.question_id}`);
//       } else {
//         setResponseMsg(`❌ Error: ${data.msg || "Something went wrong"}`);
//       }
//     } catch (error) {
//       setResponseMsg("❌ Failed to connect to the server");
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <>
//       <h2>Ask a Question</h2>
//       <form id="questionForm" onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="title"
//           placeholder="Title"
//           value={formData.title}
//           onChange={handleChange}
//           required
//         />
//         <textarea
//           name="description"
//           placeholder="Describe your question"
//           value={formData.description}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="tag"
//           placeholder="Tags (optional)"
//           value={formData.tag}
//           onChange={handleChange}
//         />
//         <button type="submit">Post Question</button>
//       </form>

//       <div id="response">{responseMsg}</div>
//     </>
//   );
// }

// export default PostQuestion;

import React, { useState } from "react";
import axiosInstance from "../../API/axios";

function PostQuestion() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tag: "",
  });
  const [responseMsg, setResponseMsg] = useState("");

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve the user ID and token from localStorage
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    if (!token) {
      setResponseMsg("❌ Please log in first.");
      return;
    }

    // Add user_id to formData
    const questionData = { ...formData, user_id: userId };

    try {
      const response = await axiosInstance.post(
        "/questions/post-question",
        questionData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );

      if (response.status === 200) {
        setResponseMsg(
          `✅ Question Posted! Question ID: ${response.data.question_id}`
        );
      } else {
        setResponseMsg(
          `❌ Error: ${response.data.msg || "Something went wrong"}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        // Log response error details for debugging
        console.error("Response data:", error.response.data);
        setResponseMsg(
          `❌ Failed to post question: ${
            error.response.data.message || "Unknown error"
          }`
        );
      } else {
        setResponseMsg("❌ Failed to connect to the server");
      }
    }
  };

  return (
    <>
      <h2>Ask a Question</h2>
      <form id="questionForm" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Describe your question"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="tag"
          placeholder="Tags (optional)"
          value={formData.tag}
          onChange={handleChange}
        />
        <button type="submit">Post Question</button>
      </form>

      <div id="response">{responseMsg}</div>
    </>
  );
}

export default PostQuestion;
