import { io } from "socket.io-client";
import { socketUrl } from "./backendUrl";

const socket = io(socketUrl, { autoConnect: false });
export default socket;

// socket.onAny((event, ...args) => {
//   console.log(event, args);
// }); // only for development

socket.on("connect_error", (err) => {
  console.log(err.message);
});
