import { createContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import LandingPage from "./pages/LandingPage/LandingPage";
import SignUp from "./pages/SignUp/SignUp";
import HomePage from "./components/HomePage/HomePage";
import ProtectedRoute from "./Context/ProtectedRoute";
import QuestionDetail from "./components/QuestionDetail/QuestionDetail";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import axiosInstance from "./API/axios";
import AskQuestion from "./components/AskQuestion/AskQuestion";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  async function checkUser() {
    try {
      const { data } = await axiosInstance.get("/users/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data);
    } catch (error) {
      console.log(error.response);
      setError("Failed to authenticate. Please log in again.");
      navigate("/users/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      checkUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <div className="loader">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="questions/:question_id" element={<QuestionDetail />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ask"
          element={
            // <ProtectedRoute>
              <AskQuestion />
            // </ProtectedRoute>
          }
        />
        {/* <Route path="/auth" element={<LogInSignUp />} /> */}
        <Route path="/users/login" element={<Login />} />
        <Route path="/users/register" element={<SignUp />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
