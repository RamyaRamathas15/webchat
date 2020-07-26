import React, { useEffect, useState } from "react";
import { auth } from "../../src/backend/firebase";
import LoginString from "../backend/LoginStrings";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem(LoginString.Name)
  );

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(localStorage.getItem(LoginString.Name));
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
