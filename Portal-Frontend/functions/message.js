import socket from "../utils/socket";
const backendUrl = "http://10.232.205.167:3000";
import axios from "axios";

export const message = (userId, content) => {
  socket.emit("private message", {
    content: content,
    to: userId,
  });
};

export const getMessages = async (receiverId) => {
  //   return [];
  try {
    const response = await axios.get(`${backendUrl}/messages/${receiverId}`);

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getMessagedUsers = async () => {
  try {
    const response = await axios.get(`${backendUrl}/messagedUsers`);

    return response.data;
  } catch (err) {
    console.log(err);
  }
};
