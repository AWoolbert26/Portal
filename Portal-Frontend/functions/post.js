import axios, { AxiosHeaders } from "axios";
import { router } from "expo-router";

const backendUrl = "http://172.27.185.107:3000";

export const post = async (body) => {
  try {
    await axios.post(`${backendUrl}/post`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });
    router.replace("/home");
    // await axios.post(`${backendUrl}/post`, formData);
  } catch (error) {
    console.log(error);
  }
};