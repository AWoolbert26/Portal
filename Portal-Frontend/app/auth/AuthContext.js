import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { router } from "expo-router";

const tokenKey = "portal_jwt";
const backendUrl = "mysql://portal_admin:mypassword@portal.cdyqkcggul2d.us-east-2.rds.amazonaws.com:3306/portal";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null); //should we decode the token before putting it?

  useEffect(() => {
    if (authUser) {
      setAuthUser(authUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
