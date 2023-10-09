import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { router } from "expo-router";

const tokenKey = "portal_jwt";
const backendUrl = "http://192.168.12.165:3000";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null); //should we decode the token before putting it?

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync("portal_jwt");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setAuthToken(token);
      }
      loadToken();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};
