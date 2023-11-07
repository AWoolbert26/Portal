import { io } from "socket.io-client";
const backendUrl = "http://192.168.12.165:3001";
const socket = io(backendUrl, { autoConnect: false });
export default socket;

// socket.onAny((event, ...args) => {
//   console.log(event, args);
// }); // only for development

socket.on("connect_error", (err) => {
  console.log(err.message);
});
