// import React, { createContext, useState } from "react";

// export const UserContext = createContext(null);

// const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   console.log(user, setUser);
//   return (
//     <UserContext.Provider value={[user, setUser]}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export default UserProvider;

import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user from localStorage on initial load
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]); // Run only when `user` changes
  console.log(user);
  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};
