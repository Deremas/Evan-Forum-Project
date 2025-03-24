import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { UserContext } from "../../Context/UserProvider";
import axiosInstance from "../../API/axios";
import "./QuestionDetail.css";
import { QuestionContext } from "../../Context/QuestionProvider";
import DOMPurify from "dompurify";
import "quill/dist/quill.snow.css";
import Quill from "quill";

function QuestionDetail() {
  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const token = localStorage.getItem("token");
  const [user, setUser] = useContext(UserContext);

  const { questions } = useContext(QuestionContext);
  const { question_id } = useParams();
  const [answer, setAnswer] = useState([]);
  const quillRef = useRef(null);
  const quillInstance = useRef(null);

  console.log(token);
  useEffect(() => {
    (async () => {
      try {
        console.log(token);
        console.log("Question ID:", question_id);
        const answers = await axiosInstance.get(`/answers/${question_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(answers);
        setAnswer(answers.data.answers);
        console.log(question_id);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [question_id, token]);

  const selectedQuestion = questions.find(
    (question) => question.question_id === question_id
  );

  // last commented
  // const handleClick = async (data) => {
  //   try {
  //     // console.log("Detail toke", token)
  //     await axiosInstance.post(
  //       `/answer/create/${question_id}`,
  //       {
  //         answer: data.answer,
  //         question_id: question_id,
  //         user_id: user.user_id,
  //       },
  //       {
  //         headers: {
  //           Authorization: "Bearer " + token,
  //         },
  //       }
  //     );
  //     console.log(user_name)
  //     console.log(user_id)

  //     const ans = await axiosInstance.get(`/answers/${question_id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     // Update the dbAnswer state with the fetched answers
  //     setAnswer(ans.data.data);
  //     setValue("answer", ""); // Clear the textarea after posting
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // console.log(answer.user_name);
  // console.log(answer.user_id);

  // const handleClick = async (data) => {
  //   try {
  //     if (!question_id || !user?.user_id || !data.answer) {
  //       console.error("Missing required data:", { question_id, user, data });
  //       return;
  //     }

  //     await axiosInstance.post(
  //       `/answer/create/${question_id}`,
  //       {
  //         answer: data.answer,
  //         user_id: user.user_id,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     console.log("User Name:", user?.user_name);
  //     console.log("User ID:", user?.user_id);

  //     // Fetch updated answers
  //     const ans = await axiosInstance.get(`/answers/${question_id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     setAnswer(ans.data.data);
  //     setValue("answer", "");
  //   } catch (error) {
  //     console.error(
  //       "Error posting answer:",
  //       error.response?.data || error.message
  //     );
  //   }
  // };

  console.log(user);
  // const handleClick = async (data) => {
  //   try {
  //     if (!question_id || !user?.user_id || !data.answer) {
  //       console.error("Missing required data:", { question_id, user, data });
  //       return;
  //     }

  //     await axiosInstance.post(
  //       `/answer/${question_id}`, // Question ID in the URL
  //       {
  //         answer: data.answer, // Only send answer in the body
  //         user_id: user.user_id,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     console.log(answer);

  //     // Fetch updated answers
  //     const ans = await axiosInstance.get(`/answers/${question_id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     console.log(ans);
  //     setAnswer(ans.data.answers);
  //     setValue("answer", "");
  //     console.log(answer);
  //     console.log(question_id);
  //   } catch (error) {
  //     console.error(
  //       "Error posting answer:",
  //       error.response?.data || error.message
  //     );
  //   }
  // };

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

  //  const clickFunc = async (data) => {
  //    let description = quillInstance.current.root.innerHTML.trim(); // Use quillInstance to get content
  //    if (!description) {
  //      alert("Question description is required.");
  //      return;
  //    }
  //    description = sanitizeContent(description);

  //    setLoading(true);
  //    try {
  //      await axiosInstance.post(
  //        "/answer/:question_id",
  //        {
  //          title: data.title,
  //          question_description: description,
  //          user_id: user.user_id,
  //          tag: data.tag,
  //        },
  //        {
  //          headers: { Authorization: `Bearer ${token}` },
  //        }
  //      );
  //      setSuccessful(true);
  //      reset();
  //      if (quillInstance.current) quillInstance.current.root.innerHTML = "";
  //    } catch (error) {
  //      const errorMessage =
  //        error.response?.data?.message ||
  //        "Failed to post your question. Please try again later.";
  //      setError("server", { type: "manual", message: errorMessage });
  //    } finally {
  //      setLoading(false);
  //    }
  //  };

  const clickFunc = async (data) => {
    try {
      // Get content from Quill Editor
      let description = quillInstance.current?.root.innerHTML.trim();

      if (!description) {
        alert("Answer description is required.");
        return;
      }

      description = sanitizeContent(description); // Ensure safe content

      if (!question_id || !user?.user_id) {
        console.error("Missing required data:", { question_id, user });
        return;
      }

      // Send answer
      await axiosInstance.post(
        `/answer/${question_id}`, // Correct dynamic URL
        {
          answer: description, // Use Quill's content as the answer
          user_id: user.user_id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch updated answers
      const ans = await axiosInstance.get(`/answers/${question_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAnswer(ans.data.answers);
      setValue("answer", ""); // Clear form input

      // Reset Quill editor content
      if (quillInstance.current) {
        quillInstance.current.root.innerHTML = "";
      }
    } catch (error) {
      console.error(
        "Error posting answer:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <>
      <div className="container top">
        <div className="card mb-4">
          <div className="card-body">
            <h4 className="card-title">Question</h4>
            <h5 className="card-subtitle mb-2 text-muted">
              {selectedQuestion?.title}
            </h5>
            <p className="card-text">
              {/* {selectedQuestion?.question_description} */}
            </p>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  selectedQuestion?.question_description
                ),
              }}
            />
          </div>
        </div>
        <div className="card mb-4">
          <div className="card-body">
            <h4 className="card-title">Answers From The Community</h4>
          </div>
        </div>

        {answer?.map((singleAnswer, index) => (
          <div className="card mb-3 info_question" key={index}>
            <div className="card-body row">
              <div className="col-md-4 d-flex flex-column align-items-center">
                <i className="fas fa-user-circle fa-3x user mb-2" />
                <p className="username">{singleAnswer.user_name}</p>
              </div>
              <div className="col-md-8">
                {/* <p className="answer-text">{singleAnswer.answer}</p> */}
                <div ref={quillRef} className=""></div>
              </div>
            </div>
          </div>
        ))}
        <div className="card answer text-center mb-5">
          <div className="card-body">
            <h2 className="pt-3">Answer The Top Question.</h2>
            <Link to="/home" style={{ textDecoration: "none" }}>
              <small style={{ color: "#b7b3b4 ", fontSize: "20px" }}>
                Go to Question Page
              </small>
            </Link>

            <form onSubmit={handleSubmit(clickFunc)}>
              <div className="form-group">
                <textarea
                  className={`form-control w-75 mx-auto ${
                    errors.answer ? "is-invalid" : ""
                  }`}
                  rows="6"
                  placeholder="Your answer..."
                  {...register("answer", {
                    required: "Answer is required",
                    maxLength: {
                      value: 350,
                      message: "Maximum allowed length is 350",
                    },
                  })}
                  onKeyUp={() => {
                    trigger("answer");
                  }}
                />
                {errors.answer && (
                  <div className="Invalid, Please correct your answer">
                    {errors.answer.message}
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-success mt-3">
                Post Your Answer
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default QuestionDetail;
