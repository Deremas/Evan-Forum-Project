import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import {UserProvider} from "./Context/UserProvider.jsx";
import QuestionProvider from "./Context/QuestionProvider.jsx";

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <QuestionProvider>
      <BrowserRouter>
        <StrictMode>
          <App />
        </StrictMode>
      </BrowserRouter>
    </QuestionProvider>
  </UserProvider>
);
