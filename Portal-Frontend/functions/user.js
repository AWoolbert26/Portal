import axios from "axios";
import * as SecureStore from "expo-secure-store";
import socket from "../utils/socket";
import { backendUrl } from "../utils/backendUrl";

export const login = async (email, password) => {
  try {
    const result = await axios.post(`${backendUrl}/login`, {
      email: email,
      password: password,
    });
    console.log(result.data.user.verified);
    if (!result.data.user.verified) {
      return result.data.user;
    }
    await SecureStore.setItemAsync("authToken", result.data.authToken);
    axios.defaults.headers.common["Authorization"] = result.data.authToken;

    const id = result.data.user.id;
    socket.auth = { id };
    socket.connect();
    console.log("socket connected");

    return result.data.user; //returns user object
  } catch (err) {
    throw err;
  }
};

export const deleteAuthUser = async () => {
  try {
    socket.disconnect();
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

export const register = async ({ email, password, username, redirectUrl }) => {
  try {
    const result = await axios.post(`${backendUrl}/register`, {
      email: email,
      password: password,
      username: username,
      redirectUrl: redirectUrl,
    });
    console.log(result.data);
    return result.data.userId;
  } catch (err) {
    console.log(err);
    return { err: "User couldn't be created." };
  }
};

export const resendVerificationEmail = async (userId, redirectUrl) => {
  try {
    const result = await axios.get(`${backendUrl}/resendVerificationEmail`, {
      params: {
        id: userId,
        redirectUrl: redirectUrl,
      },
    });
    return "Success";
  } catch (err) {
    console.log(err);
    return { err: "Resend unsuccessful." };
  }
};

export const sendReportEmail = async (reporter, reportedUser, reportedPost) => {
  try {
    const result = await axios.get(`${backendUrl}/sendReportEmail`, {
      params: {
        reporter: reporter,
        reportedUser: reportedUser,
        reportedPost, reportedPost
      },
    });
    return "Success";
  } catch (err) {
    console.log(err);
    return { err: "Resend unsuccessful." };
  }
};

export const authenticate = async (id) => {
  try {
    console.log(id);
    const result = await axios.get(`${backendUrl}/authenticate/${id}`);

    await SecureStore.setItemAsync("authToken", result.data.authToken);
    axios.defaults.headers.common["Authorization"] = result.data.authToken;

    socket.auth = { id };
    socket.connect();
    console.log("socket connected");

    return result.data.user;
  } catch (err) {
    throw err;
  }
};

export const updateUserType = async (typeNum) => {
  try {
    const result = await axios.patch(`${backendUrl}/updateUserType`, {
      type: typeNum,
    });
    await SecureStore.setItemAsync("authToken", result.data.authToken);
    axios.defaults.headers.common["Authorization"] = result.data.authToken;

    return result.data.user; //change success/failure code that backend returns
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

export const getOtherProfile = async (userId) => {
  const profile = await axios.get(`${backendUrl}/getOtherProfile/${userId}`);
  return profile.data;
};

export const getCategories = async () => {
  try {
    const result = await axios.get(`${backendUrl}/getCategories`);
    console.log(result.data)
    return result.data;
  } catch (err) {
    console.log(err);
  }
};

export const setProfile = async ({ name, location, occupation, bio }) => {
  try {
    console.log(name, location, occupation, bio);
    const profile = await axios.post(`${backendUrl}/setProfileInformation`, {
      name: name,
      location: location,
      occupation: occupation,
      bio: bio,
    });
    console.log(profile.data);
    return profile;
  } catch (err) {
    throw err;
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
export const getPosts = async (category) => {
  try {
    const posts = await axios.get(
      `${backendUrl}/getPosts?category=${category}`
    );
    return posts.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getUserPosts = async () => {
  try {
    const posts = await axios.get(`${backendUrl}/getUserPosts`);
    return posts.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getUsers = async (username) => {
  try {
    const user = await axios.get(
      `${backendUrl}/searchUsers?username=${username}`
    );
    return user;
  } catch (err) {
    throw err;
  }
};

export const toggleFollow = async (userId) => {
  try {
    const response = await axios.get(`${backendUrl}/toggleFollow/${userId}`);
    return response.data.follows;
  } catch (err) {
    console.log(err);
  }
};

export const checkFollowing = async (userId) => {
  try {
    const response = await axios.get(`${backendUrl}/checkFollowing/${userId}`);
    print("Data: " + response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getPostInfo = async (postId) => {
  try {
    const postInfo = await axios.get(`${backendUrl}/getPostInfo/${postId}`);
    return postInfo.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const likePost = async (postId) => {
  try {
    const response = await axios.post(`${backendUrl}/likePost/${postId}`);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const unlikePost = async (postId) => {
  try {
    const response = await axios.delete(`${backendUrl}/unlikePost/${postId}`);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const comment = async ({ newComment, postId }) => {
  try {
    const response = await axios.post(`${backendUrl}/comment/`, {
      newComment: newComment,
      postId: parseInt(postId),
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getComments = async (postId) => {
  try {
    const response = await axios.post(`${backendUrl}/getComments/${postId}`);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const likeComment = async (commentId) => {
  try {
    const response = await axios.post(`${backendUrl}/likeComment/${commentId}`);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const unlikeComment = async (commentId) => {
  try {
    const response = await axios.delete(
      `${backendUrl}/unlikeComment/${commentId}`
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getProfilePicture = async () => {
  try {
    const res = await axios.get(`${backendUrl}/getProfilePicture`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getOtherProfilePicture = async (userId) => {
  try {
    const res = await axios.get(
      `${backendUrl}/getOtherProfilePicture/${userId}`
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getTopUsers = async () => {
  try {
    const res = await axios.get(`${backendUrl}/getTopUsers`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
export const getUserWithPosts = async (userId) => {
  try {
    const res = await axios.get(`${backendUrl}/getUserWithPosts/${userId}`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
export const rateCategory = async (category, rating) => {
  try {
    const res = await axios.post(`${backendUrl}/rateCategory`, {
      category: category,
      rating: rating,
    });
    console.log(res.data);
  } catch (err) {
    console.log(err);
  }
};

export const getAverageCategoryRating = async (category) => {
  try {
    const res = await axios.get(
      `${backendUrl}/getAverageCategoryRating/${category}`
    );
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
export const getUserRating = async (category) => {
  try {
    const res = await axios.get(`${backendUrl}/getUserRating/${category}`);
    return res.data.rating;
  } catch (error) {
    console.log(error);
    return 0;
  }
};
