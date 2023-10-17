import axios from "axios";
import * as SecureStore from "expo-secure-store";

//put in an env file instead
const backendUrl = "http://10.232.156.175:3000";

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
    axios.defaults.headers.common["Authorization"] = result.data.authToken;

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
    return result.data; //change success/failure code that backend returns
  } catch (err) {
    console.log(err);
  }
};

export const selectCategories = async (categories) => {
  try {
    const result = await axios.post(
      `${backendUrl}/selectCategories`,
      categories
    );
    return result.data;
  } catch (err) {
    throw err;
  }
};

export const getUserInformation = async () => {
  try {
    const res = await axios.get(`${backendUrl}/myProfile`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const result = await axios.get(`${backendUrl}/getCategories`);
    return result.data;
  } catch (err) {
    console.log(err);
  }
};

export const setProfile = async ({ name, location, occupation, bio }) => {
  try {
    const profile = await axios.post(`${backendUrl}/setProfileInformation`, {
      name: name,
      location: location,
      occupation: occupation,
      bio: bio,
    });
    console.log(profile.data);
    return profile;
  } catch (err) {
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const profile = await axios.get(`${backendUrl}/getProfileInformation`);
    return profile;
  } catch (err) {
    throw err;
  }
};

export const getCategorySummary = async (name) => {
  try {
    const summary = await axios.get(
      `${backendUrl}/getCategorySummary?name=${name}`
    );
    return summary.data;
  } catch (err) {
    throw err;
  }
};

// will modify to only get for specific categories
export const getPosts = async () => {
  try {
    const posts = await axios.get(`${backendUrl}/getPosts`);
    return posts.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getUser = async (username) => {
  try {
    const user = await axios.get(`${backendUrl}/searchUser?username=${username}`);
    return user
  } catch (err) {
    throw err;
  }
}