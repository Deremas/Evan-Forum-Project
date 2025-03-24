import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import styles from "./HomePage.module.css";
import { IoIosArrowDropright } from "react-icons/io";
import axiosInstance from "../../API/axios";
import { QuestionContext } from "../../Context/QuestionProvider";
import { UserContext } from "../../Context/UserProvider";
import DOMPurify from "dompurify";
// import Question from "../Question/Question";

const Home = () => {
  const token = localStorage.getItem("token");
  const { questions, setQuestions } = useContext(QuestionContext);
  const [user] = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  function handleClick() {
    navigate("/ask");
  }
  console.log(user);

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get("/questions/all-questions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuestions(response.data.questions);
        setLoading(false);
        console.log(response.data.questions);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError(
          err.response?.data?.message || "An error occurred. Please try again."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [token, setQuestions]);

  // Filter questions based on the search query
  const filteredQuestions = questions.filter(
    (question) =>
      question.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // function clickHandle() {
  //   navigate(`/questions/${filteredQuestions.question_id}`);
  // } 

  return (
    <div className={styles.homeContainer}>
      <header className={styles.homeHeader}>
        <div className={styles.welcomeUser}>
          <h1>Welcome: {user?.user_name}!</h1>
          <p>Engage, Ask, and Share Knowledge with the Community!</p>
        </div>
        <button className={styles.askQuestionBtn} onClick={handleClick}>
          Ask a Question
        </button>
      </header>

      {/* Search bar */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {loading && <p className={styles.loadingMessage}>Loading questions...</p>}

      {error && <p className={styles.errorMessage}>{error}</p>}

      {!loading && !error && questions.length === 0 && (
        <p className={styles.noQuestionsMessage}>
          No questions available. Be the first to ask!
        </p>
      )}

      {!loading && !error && filteredQuestions.length === 0 && (
        <p className={styles.noQuestionsMessage}>
          No questions match your search criteria.
        </p>
      )}

      {!loading && !error && filteredQuestions.length > 0 && (
        // <Link to={`/questions/${questions.question_id}`}>
        <div className={styles.questionsList}>
          {filteredQuestions.map((question, index) => (
            // <Link to={`/questions/${question.question_id}`}>
            <div className={styles.cardWrapper}>
              <div key={index} className={styles.questionCard}>
                <div className={styles.profileSection}>
                  <FaUserCircle className={styles.profileIcon} />
                  <span className={styles.username}>{question?.user_name}</span>
                </div>
                <div className={styles.questionDetails}>
                  <h3 className={styles.questionTags}>{question.tag} </h3>
                  <h4 className={styles.questionTitle}>{question.title}</h4>
                  <div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          question?.question_description
                        ),
                      }}
                    />
                  </div>
                </div>
              </div>
              <Link to={`/questions/${question.question_id}`}>
                <div className={styles.arrow}>
                  <IoIosArrowDropright className={styles.arrowIcon} />
                </div>
              </Link>
            </div>
            // {/* </Link> */}
          ))}
        </div>
        // </Link>
      )}
    </div>
  );
};

export default Home;

// import React, { useContext, useEffect, useState } from "react";
// import styles from "./HomePage.module.css"; // Import CSS module
// import { useNavigate, Link, replace } from "react-router-dom";
// import { QuestionContext } from "../../Context/QuestionProvider";
// import axiosInstance from "../../API/axios";
// import { UserContext } from "../../Context/UserProvider";
// import { FaUserCircle } from "react-icons/fa"; // Ensure these imports are available
// import { IoIosArrowDropright } from "react-icons/io";

// // latest commented
// const Home = () => {
//   const token = localStorage.getItem("token");
//   const { questions, setQuestions } = useContext(QuestionContext);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const { user } = useContext(UserContext);
//   const navigate = useNavigate();

//   function handleClick() {
//     navigate("/ask");
//   }

//   // useEffect(() => {
//   //   if (!user?.username && window.location.pathname !== "/users/login") {
//   //     localStorage.setItem("redirectAfterLogin", "/home");
//   //     navigate("/users/login", { replace: true });
//   //   }
//   // }, [user, navigate]);

//   // useEffect(() => {
//   //   if (!user?.username) {
//   //     localStorage.setItem("redirectAfterLogin", "/home");
//   //     navigate("/users/login", { replace: true });
//   //   }
//   // }, [user, navigate]);

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const response = await axiosInstance.get("/questions/all-questions", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setQuestions(response.data.questions);
//         // console.log(response.data.questions.data.user_name);
//         setLoading(false);
//         console.log(response.data.questions);
//       } catch (err) {
//         console.error("Error fetching questions:", err);
//         setError(
//           err.response?.data?.message || "An error occurred. Please try again."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, []);

//   // Filter questions based on the search query
//   const filteredQuestions = questions.filter(
//     (question) =>
//       question.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       question.description?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   console.log(user)
//   return (
//     <div className={styles.container}>
//       <header className={styles.homeHeaderwrapper}>
//         <div className={styles.welcome}>
//           <h1>Welcome: {user?.user_name}!</h1>
//           <p>Engage, Ask, and Share Knowledge with the Community!</p>
//         </div>
//         <button className={styles.askQuestion} onClick={handleClick}>
//           Ask a Question
//         </button>
//       </header>
//       {/* Search bar */}
//       <div className={styles.load}>
//         <input
//           type="text"
//           placeholder="Search questions..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className={styles.searchInput}
//         />
//       </div>
//       {loading && <p className={styles.loading}>Loading questions...</p>}
//       {error && <p className={styles.errorMessage}>{error}</p>}
//       {!loading && !error && questions.length === 0 && (
//         <p className={styles.questionItem}>
//           No questions available. Be the first to ask!
//         </p>
//       )}
//       {!loading && !error && filteredQuestions.length === 0 && (
//         <p className={styles.questionItem}>
//           No questions match your search criteria.
//         </p>
//       )}
//       {!loading && !error && filteredQuestions.length > 0 && (
//         <div className={styles.homePage}>
//           {filteredQuestions.map((question, index) => (
//             <div key={index} className={styles.questionItem}>
//               <div className={styles.profileSection}>
//                 <FaUserCircle className={styles.profileIcon} />
//                 <span className={styles.username}>{user?.username}</span>
//               </div>

//               {/* Question Details */}
//               <div className={styles.questionDetails}>
//                 <h2 className={styles.title}>{question.tags}</h2>
//                 <h4 className={styles.title}>{question.title}</h4>
//                 <h3>{question?.user_name}</h3>
//                 <p className={styles.questionDescription}>
//                   {question.question_description}
//                 </p>
//                 <Link
//                   to={`/questions/${question.question_id}`}
//                   className={styles.viewDetails}
//                 >
//                   View Details{" "}
//                   <IoIosArrowDropright className={styles.arrowIcon} />
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;

// yekoye
// import React, { useContext, useEffect, useState } from "react";
// import styles from "./HomePage.module.css";
// import Question from "../Question/Question";
// import { useNavigate } from "react-router-dom";
// import { QuestionContext } from "../../Context/QuestionProvider";
// import axiosInstance from "../../API/axios";
// import { UserContext } from "../../Context/UserProvider";

// const Home = () => {
//   const token = localStorage.getItem("token");
//   const { questions, setQuestions } = useContext(QuestionContext);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const { user } = useContext(UserContext);
//   const navigate = useNavigate();

//   function handleClick() {
//     navigate("/ask");
//   }

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const response = await axiosInstance.get("/questions/all-questions", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setQuestions(response.data.questions);
//         setLoading(false);
//         console.log(response.data.questions);
//       } catch (err) {
//         console.error("Error fetching questions:", err);
//         setError(
//           err.response?.data?.message || "An error occurred. Please try again."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, []);

//   // Filter questions based on the search query
//   const filteredQuestions = questions.filter(
//     (question) =>
//       question.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       question.description?.toLowerCase().includes(searchQuery.toLowerCase())
//   );
//   return (
//     <div className="container">
//       <header className="homeHeaderwrapper">
//         <div className="welcome">
//           <h1>Welcome: {user?.username}!</h1>
//           <p>Engage, Ask, and Share Knowledge with the Community!</p>
//         </div>
//         <button className="askQuestion" onClick={handleClick}>
//           Ask a Question
//         </button>
//       </header>

//       {/* Search bar */}
//       <div className="load">
//         <input
//           type="text"
//           placeholder="Search questions..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="searchInput"
//         />
//       </div>

//       {loading && <p className="loading">Loading questions...</p>}

//       {error && <p className="errorMessage">{error}</p>}

//       {!loading && !error && questions.length === 0 && (
//         <p className="question-item">
//           No questions available. Be the first to ask!
//         </p>
//       )}

//       {!loading && !error && filteredQuestions.length === 0 && (
//         <p className="question-item">
//           No questions match your search criteria.
//         </p>
//       )}

//       {!loading && !error && filteredQuestions.length > 0 && (
//         <div className="homePage">
//           {filteredQuestions.map((question, index) => (
//             <div key={index} className="question-item">
//               <div className="profileSection">
//                 <FaUserCircle className="profileIcon" />
//                 <span className="username">{user?.username}</span>
//               </div>

//               {/* Question Details */}
//               <div className="questionDetails">
//                 {" "}
//                 <h2 className="title">{question.tags}</h2>
//                 <h4 className="title">{question.title}</h4>
//                 <h3>{question?.username}</h3>
//                 <p className="questionDescription">{question.description}</p>
//                 <Link
//                   to={`/question/${question.question_id}`}
//                   className="viewDetails"
//                 >
//                   View Details <IoIosArrowDropright className="arrowIcon" />
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;

// function HomePage() {
//   const navigate = useNavigate();
//   const [user, setUser] = useContext(UserContext);
//   console.log(user, setUser);
//   //   || [
//   //     { user_id: "", user_name: "" },
//   //     () => {},
//   //   ];
//   const [questions, setQuestions] = useContext(QuestionContext);
//   const token = localStorage.getItem("token");
//   const [loading, setLoading] = useState(true);

//   console.log(questions)
//   function handleClick() {
//     navigate("/ask");
//   }

//   useEffect(() => {
//     (async () => {
//       if (!user?.user_name) {
//         navigate("users/login");
//       }
//       try {
//         const response = await axiosInstance.get("/questions/all-questions", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         console.log(response);
//         setQuestions(response.data.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching questions:", error);
//         setLoading(false);
//       }
//     })();
//   }, [token, setQuestions]);
//   console.log(questions);

//   return (
//     <>
//       <div className="container">
//         <div className={styles.homePage}>
//           <div className={`row mb-5 ${styles.homeHeaderwrapper}`}>
//             <div className="col-md-6 d-flex justify-content-center justify-content-md-start">
//               <button onClick={handleClick} className={styles.askQuestion}>
//                 Ask Question
//               </button>
//             </div>
//             <div className="col-md-6 d-flex justify-content-center justify-content-md-end">
//               <h4 className={styles.welcome}>Welcome : {user.user_name}</h4>
//             </div>
//           </div>
//           <h3 className={styles.title}>Questions</h3>
//         </div>
//         <div className={styles.load}>
//           {loading ? (
//             <div className={styles.loading}>Loading...</div>
//           ) : (
//             questions.map((question, index) => (
//               <div key={index} className={styles["question-item"]}>
//                 <Question
//                   title={question.title}
//                   username={question.user_name}
//                   questionid={question.question_id}
//                 />
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// export default HomePage;
