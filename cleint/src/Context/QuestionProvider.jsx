import React, { createContext, useState } from "react";

export const QuestionContext = createContext();

const QuestionProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  return (
    <QuestionContext.Provider value={{ questions, setQuestions }}>
      {children}
    </QuestionContext.Provider>
  );
};

export default QuestionProvider;
