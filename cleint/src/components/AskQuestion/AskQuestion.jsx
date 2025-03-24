import { useForm } from "react-hook-form";
import { IoMdArrowRoundForward } from "react-icons/io";
import DOMPurify from "dompurify";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import styles from "./AskQuestion.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../Context/UserProvider";
import axiosInstance from "../../API/axios";
import { IoIosArrowDropright } from "react-icons/io";

function AskQuestion() {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm();
  const [user] = useContext(UserContext);
  const token = localStorage.getItem("token");

  const [successful, setSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  const quillRef = useRef(null);
  const quillInstance = useRef(null); // Use a ref for Quill instance

useEffect(() => {
  if (quillRef.current && !quillInstance.current) {
    quillInstance.current = new Quill(quillRef.current, {
      theme: "snow",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, false] }], // Headers
          [{ font: [] }], // Font selection
          [{ list: "ordered" }, { list: "bullet" }], // Ordered & Bullet lists
          ["bold", "italic", "underline", "strike"], // Text styling
          [{ color: [] }, { background: [] }], // Text color & highlight
          [{ align: [] }], // Text alignment
          ["blockquote", "code-block"], // Blockquote & Code block
          ["link", "image", "video"], // Links, Images, Video
          [{ script: "sub" }, { script: "super" }], // Subscript & Superscript
          [{ indent: "-1" }, { indent: "+1" }], // Indent
          [{ direction: "rtl" }], // Right-to-left text
          ["clean"], // Remove formatting
        ],
      },
    });

    quillInstance.current.root.style.color = "#000"; // Ensure text is visible
  }
}, []);

  // // Only initialize Quill once, avoid re-initialization
  // useEffect(() => {
  //   if (quillRef.current && !quillInstance.current) {
  //     quillInstance.current = new Quill(quillRef.current, {
  //       theme: "snow",
  //       modules: {
  //         toolbar: [
  //           [{ header: "1" }, { header: "2" }, { font: [] }],
  //           [{ list: "ordered" }, { list: "bullet" }],
  //           ["bold", "italic", "underline", "strike"],
  //           [{ color: [] }, { background: [] }],
  //           [{ align: [] }],
  //           ["link", "image", "blockquote"],
  //           [{ indent: "-1" }, { indent: "+1" }],
  //           [{ script: "sub" }, { script: "super" }],
  //           ["code-block"],
  //         ],
  //       },
  //     });
  //     quillInstance.current.root.style.color = "#000";
  //   }
  // }, []); // Empty dependency array, so it runs only once

const sanitizeContent = (content) =>
  DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      "b",
      "i",
      "u",
      "a",
      "img",
      "p",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "code",
      "pre",
      "blockquote",
      "strong",
      "em",
      "hr",
      "br",
      "sub",
      "sup",
      "mark",
      "video",
      "iframe",
      "span",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "style"],
  });


  // const sanitizeContent = (content) =>
  //   DOMPurify.sanitize(content, {
  //     ALLOWED_TAGS: [
  //       "b",
  //       "i",
  //       "u",
  //       "a",
  //       "img",
  //       "p",
  //       "ul",
  //       "ol",
  //       "li",
  //       "h1",
  //       "h2",
  //       "h3",
  //       "h4",
  //       "h5",
  //       "h6",
  //       "code",
  //       "pre",
  //       "blockquote",
  //       "strong",
  //       "em",
  //       "hr",
  //       "br",
  //       "sub",
  //       "sup",
  //       "mark",
  //     ],
  //   });

  const handleClick = async (data) => {
    let description = quillInstance.current.root.innerHTML.trim(); // Use quillInstance to get content
    if (!description) {
      alert("Question description is required.");
      return;
    }
    description = sanitizeContent(description);

    setLoading(true);
    try {
      await axiosInstance.post(
        "/questions/post-question",
        {
          title: data.title,
          question_description: description,
          user_id: user.user_id,
          tag: data.tag,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessful(true);
      reset();
      if (quillInstance.current) quillInstance.current.root.innerHTML = "";
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to post your question. Please try again later.";
      setError("server", { type: "manual", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    "Summarize your problem in a one-line title.",
    "Describe your problem in more detail.",
    "Describe what you tried and what you expected to happen.",
    "Review your question and post it to the site.",
  ];

  return (
    <div className={styles.container}>
      <div className={styles.steps}>
        <h2 className={styles.heading}>Steps to write a good question</h2>
        <ul className={styles.stepList}>
          {steps.map((step, index) => (
            <li key={index} className={styles.stepItem}>
              <IoMdArrowRoundForward /> {step}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.askQuestion}>
        <h2 className={styles.heading}>Ask a public question</h2>
        {successful && (
          <a href="/home">
            <div className={styles.successMessage}>
              <small className={styles.successText}>
                Question posted successfully. Click Here to redirect to Question
                Page...
              </small>
              <IoIosArrowDropright color="green" size={25} />
            </div>
          </a>
        )}

        <form onSubmit={handleSubmit(handleClick)} className={styles.form}>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Tag"
              className={`${styles.input} ${errors.tag ? styles.invalid : ""}`}
              {...register("tag")}
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              className={`${styles.input} ${
                errors.title ? styles.invalid : ""
              }`}
              placeholder="Title"
              {...register("title", { required: "Title is required" })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Question Description</label>
            <div className={styles.editorContainer}>
              <div className={styles.toolbar}></div>
              <div ref={quillRef} className={styles.editor}></div>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Posting..." : "Post Your Question"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AskQuestion;

// import { useForm } from "react-hook-form";
// import { IoMdArrowRoundForward } from "react-icons/io";
// import DOMPurify from "dompurify";
// import "quill/dist/quill.snow.css";
// import Quill from "quill";
// import styles from "./AskQuestion.module.css";
// import { useContext, useEffect, useRef, useState } from "react";
// import { UserContext } from "../../Context/UserProvider";
// import axiosInstance from "../../API/axios";
// import { IoIosArrowDropright } from "react-icons/io";
// function AskQuestion() {
//   const {
//     register,
//     handleSubmit,
//     setError,
//     reset,
//     formState: { errors },
//   } = useForm();
//   const [user] = useContext(UserContext);
//   const token = localStorage.getItem("token");

//   const [successful, setSuccessful] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const quillRef = useRef(null);
//   const [quill, setQuill] = useState(null);

//   useEffect(() => {
//     if (quillRef.current && !quill) {
//       const quillInstance = new Quill(quillRef.current, {
//         theme: "snow",
//         modules: {
//           toolbar: [
//             [{ header: "1" }, { header: "2" }, { font: [] }],
//             [{ list: "ordered" }, { list: "bullet" }],
//             ["bold", "italic", "underline"],
//             [{ color: [] }, { background: [] }],
//             [{ align: [] }],
//             ["link", "image"],
//           ],
//         },
//       });
//       setQuill(quillInstance);
//     }
//   }, []);

//   // const applyColor = (color) => {
//   //   if (color && quill) {
//   //     const range = quill.getSelection();
//   //     if (range) quill.format('color', color);
//   //   }
//   // };

//   const sanitizeContent = (content) =>
//     DOMPurify.sanitize(content, {
//       ALLOWED_TAGS: [
//         "b",
//         "i",
//         "u",
//         "a",
//         "img",
//         "p",
//         "ul",
//         "ol",
//         "li",
//         "h1",
//         "h2",
//         "h3",
//         "code",
//         "pre",
//         "blockquote",
//         "strong",
//         "em",
//         "hr",
//         "br",
//         "sub",
//         "sup",
//         "mark",
//       ],
//     });

//   // const handlePost = async (data) => {
//   //   let description = quill.root.innerHTML.trim();
//   //   if (!description) {
//   //     alert("Question description is required.");
//   //     return;
//   //   }
//   //   description = sanitizeContent(description);

//   //   setLoading(true);

//   //   try {
//   //     await axiosInstance.post(
//   //       "/questions/post-question",
//   //       {
//   //         title: data.title,
//   //         question_description: description,
//   //         user_id: user.user_id,
//   //         tag: data.tag,
//   //       },
//   //       {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       }
//   //     );

//   //     setSuccessful(true);
//   //     reset();
//   //     if (quill) quill.root.innerHTML = "";
//   //   } catch (error) {
//   //     const errorMessage =
//   //       error.response?.data?.message ||
//   //       "Failed to post your question. Please try again later.";
//   //     setError("server", { type: "manual", message: errorMessage });
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleClick = async (data) => {
//     let description = quill.root.innerHTML.trim(); // Get HTML content from Quill editor
//     if (!description) {
//       alert("Question description is required.");
//       return;
//     }

//     description = sanitizeContent(description); // Sanitize HTML before saving
//     // console.log(description)
//     setLoading(true);
//     try {
//       await axiosInstance.post(
//         "/questions/post-question",
//         {
//           title: data.title,
//           question_description: description,
//           user_id: user.user_id,
//           tag: data.tag,
//         },
//         {
//           headers: { Authorization: ` Bearer ${token}` },
//         }
//       );
//       console.log(user.user_name);

//       setSuccessful(true);
//       reset();
//       if (quill) quill.root.innerHTML = ""; // Clear editor after posting
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message ||
//         "Failed to post your question. Please try again later.";
//       setError("server", { type: "manual", message: errorMessage });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const steps = [
//     "Summarize your problem in a one-line title.",
//     "Describe your problem in more detail.",
//     "Describe what you tried and what you expected to happen.",
//     "Review your question and post it to the site.",
//   ];

//   return (
//     <div className={styles.container}>
//       <div className={styles.steps}>
//         <h2 className={styles.heading}>Steps to write a good question</h2>
//         <ul className={styles.stepList}>
//           {steps.map((step, index) => (
//             <li key={index} className={styles.stepItem}>
//               <IoMdArrowRoundForward /> {step}
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div className={styles.askQuestion}>
//         <h2 className={styles.heading}>Ask a public question</h2>
//         {successful && (
//           <a href="/home">
//             <div className={styles.successMessage}>
//               <small className={styles.successText}>
//                 Question posted successfully. Click Here to redirect to Question
//                 Page...
//               </small>
//               <IoIosArrowDropright color="green" size={25} />
//             </div>
//           </a>
//         )}

//         <form onSubmit={handleSubmit(handleClick)} className={styles.form}>
//           <div className={styles.formGroup}>
//             <input
//               type="text"
//               placeholder="Tag"
//               className={`${styles.input} ${errors.tag ? styles.invalid : ""}`}
//               {...register("tag")}
//             />
//           </div>

//           <div className={styles.formGroup}>
//             <input
//               type="text"
//               className={`${styles.input} ${
//                 errors.title ? styles.invalid : ""
//               }`}
//               placeholder="Title"
//               {...register("title", { required: "Title is required" })}
//             />
//           </div>

//           <div className={styles.formGroup}>
//             <label>Question Description</label>
//             <div className={styles.editorContainer}>
//               <div className={styles.toolbar}></div>
//               <div ref={quillRef} className={styles.editor}></div>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className={styles.submitButton}
//             disabled={loading}
//           >
//             {loading ? "Posting..." : "Post Your Question"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AskQuestion;

// import React, { useContext, useState } from "react";
// import { v4 as uuidv4 } from "uuid";
// import { useForm } from "react-hook-form";
// import "./AskQuestion.css";
// import { Link } from "react-router-dom";
// import { UserContext } from "../../Context/UserProvider";
// import axiosInstance from "../../API/axios";

// function AskQuestion() {
//   const {
//     register,
//     trigger,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm();

//   const [user, setUser] = useContext(UserContext);
//   const token = localStorage.getItem("token");
//   const [successful, setSuccessful] = useState(false);

//   async function handlePost(data) {
//     const question_id = uuidv4();
//     try {
//       await axiosInstance.post(
//         "/questions/post-question",
//         {
//           tag: data.tag,
//           title: data.title,
//           question_description: data.question_description,
//           question_id: question_id,
//           user_id: user.user_id,
//         },
//         {
//           headers: {
//             Authorization: "Bearer " + token,
//           },
//         }
//       );
//       setSuccessful(true);

//       reset();
//     } catch (error) {
//       console.error("Error posting question:", error.response || error);
//     }
//   }

//   return (
//     <div className="top container text-center">
//       <div className="py-5">
//         <h2>Steps to Write a Good Question</h2>
//         <ul className="text-start mx-auto" style={{ maxWidth: "450px" }}>
//           <li>Summarize your problem in a one-line title.</li>
//           <li>Describe your problem in more detail.</li>
//           <li>Describe what you tried and what you expected to happen.</li>
//           <li>Review your question and post it to the site.</li>
//         </ul>
//       </div>
//       <div>
//         <h2 className="pb-2">Ask a Public Question</h2>
//         {successful && (
//           <div>
//             <Link to="/home" style={{ textDecoration: "none" }}>
//               <small
//                 style={{
//                   display: "block",
//                   color: "lightgreen",
//                   fontSize: "20px",
//                 }}
//               >
//                 Question posted successfully. Redirecting to home page...
//               </small>
//             </Link>
//           </div>
//         )}
//         <form onSubmit={handleSubmit(handlePost)}>
//           <div>
//             <textarea
//               placeholder="Tag"
//               className={`w-75 ${errors.tag ? "invalid" : ""}`}
//               rows="2"
//               {...register("tag", {
//                 required: "Tag is required.",
//                 minLength: {
//                   value: 3,
//                   message: "Minimum tag length is 3",
//                 },
//               })}
//               onKeyUp={() => trigger("tag")}
//             />
//             {errors.tag && (
//               <small className="text-danger">{errors.tag.message}</small>
//             )}
//           </div>
//           <div>
//             <textarea
//               className={`w-75 ${errors.title ? "invalid" : ""}`}
//               rows="2"
//               placeholder="Title"
//               {...register("title", {
//                 required: "Title is required",
//                 maxLength: {
//                   value: 200,
//                   message: "Maximum length is 200",
//                 },
//               })}
//               onKeyUp={() => trigger("title")}
//             />
//             {errors.title && (
//               <small className="text-danger">{errors.title.message}</small>
//             )}
//           </div>
//           <div>
//             <textarea
//               className={`w-75 ${errors.question ? "invalid" : ""}`}
//               rows="6"
//               placeholder="Question Description..."
//               {...register("question_description", {
//                 required: "Question Detail is required",
//                 maxLength: {
//                   value: 300,
//                   message: "Maximum allowed length is 300",
//                 },
//               })}
//               onKeyUp={() => trigger("question")}
//             />
//             {errors.question && (
//               <small className="text-danger">{errors.question.message}</small>
//             )}
//           </div>
//           <div>
//             <button type="submit" className="btn btn-success mb-5 mt-3">
//               Post Your Question
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AskQuestion;
