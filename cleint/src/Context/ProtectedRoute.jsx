import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserProvider"; // Import UserContext

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [user] = useContext(UserContext); // Get the user from context

  useEffect(() => {
    if (!user) {
      // If the user is not authenticated, navigate to the login page
      navigate("/users/login");
    }
  }, [user, navigate]); // Only re-run the effect if `user` changes

  return user ? children : null; // Render children if user is authenticated, otherwise null
};

export default ProtectedRoute;
