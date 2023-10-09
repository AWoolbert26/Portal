import axios from "axios";
import * as SecureStore from "expo-secure-store";

//put in an env file instead
const backendUrl = "http://192.168.12.165:3000";

export const login = async (email, password) => {
  try {
    const token = await axios.post(`${backendUrl}/login`, {
      email: email,
      password: password,
    });

    await SecureStore.setItemAsync("portal_jwt", token.data);

    return token.data; //returns jwt token
  } catch (err) {
    throw err;
  }
};

export const checkUniqueEmail = async (email) => {
  try {
    const response = await axios.post(`${backendUrl}/checkUniqueEmail`, {
      email: email,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return "Unknown error";
  }
};

export const checkUniqueUsername = async (username) => {
  try {
    const response = await axios.post(`${backendUrl}/checkUniqueUsername`, {
      username: username,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return "Unknown error";
  }
};

export const register = async ({ email, password, username }) => {
  try {
    const token = await axios.post(`${backendUrl}/register`, {
      email: email,
      password: password,
      username: username,
    });
    return token;
  } catch (err) {
    console.log(err);
    return { err: "User couldn't be created." };
  }
};
