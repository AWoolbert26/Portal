import axios from "axios";
import * as SecureStore from "expo-secure-store";

//put in an env file instead
const backendUrl = "http://192.168.12.165:3000";

export const login = async (email, password) => {
  try {
    const result = await axios.post(`${backendUrl}/login`, {
      email: email,
      password: password,
    });

    await SecureStore.setItemAsync("authToken", result.data.authToken);

    axios.defaults.headers.common["Authorization"] = result.data.authToken;

    return result.data.user; //returns user object
  } catch (err) {
    throw err;
  }
};

export const deleteAuthUser = async () => {
  try {
    await SecureStore.deleteItemAsync("authToken");
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
    const result = await axios.post(`${backendUrl}/register`, {
      email: email,
      password: password,
      username: username,
    });

    await SecureStore.setItemAsync("authToken", result.data.authToken);

    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${result.data.authToken}`;

    return result.data.user;
  } catch (err) {
    console.log(err);
    return { err: "User couldn't be created." };
  }
};

export const updateUserType = async (typeNum) => {
  try {
    const result = await axios.patch(`${backendUrl}/updateUserType`, {
      type: typeNum,
    });

    console.log(result.data);
    return result.data; //change success/failure code that backend returns
  } catch (err) {
    console.log(err);
  }
};

export const selectInterests = async (interests) => {
  try {
    const result = await axios.post(`${backendUrl}/selectInterests`, interests);

    return result.data;
  } catch (err) {
    throw err;
  }
};

export const getInterests = async () => {
  try {
    const result = await axios.get(`${backendUrl}/getInterests`);
    return result.data;
  } catch (err) {
    console.log(err);
  }
};
