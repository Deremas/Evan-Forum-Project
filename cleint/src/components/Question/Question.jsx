import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Question.module.css";

function Question({ title, user_name, question_id }) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/questions/${question_id}`);
  } 

  return (
    <>
      <div
        className={`border-top row ${styles.question}`}
        onClick={handleClick}
      >
        <div className="col-md-1 d-flex flex-column align-items-md-center my-md-auto">
          <i className={`fas fa-user-circle fa-3x ${styles.user}`} />
          <p className="mb-0">{user_name}</p>
        </div>
        <div className="col-md-3  my-md-auto ">
          <p className=" ">{title}</p>
        </div>
        <div className=" col-md text-md-end   my-md-auto">
          <i className="fas fa-angle-right fa-lg    " />
        </div>
      </div>
    </>
  );
}

export default Question;
