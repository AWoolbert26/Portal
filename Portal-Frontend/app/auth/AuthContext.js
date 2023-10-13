import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { router } from "expo-router";

const tokenKey = "portal_jwt";
const backendUrl = "http://192.168.12.165:3000";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null); //should we decode the token before putting it?

  // useEffect(() => {
  //   const loadAuthUser = async () => {
  //     // const authUser = await SecureStore.getItemAsync("authUser");

  //     if (authUser) {
  //       setAuthUser(authUser);
  //     }
  //   };
  //   loadAuthUser();
  // }, []);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
