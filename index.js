const express = require("express");
const cors = require("cors");
const env = require("dotenv");
const Router = require("./Router/router");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8001;
const { createServer } = require("http");
const { Server } = require("socket.io");
const chatModel = require("./Models/chatModel");
const MONGODB_URL = process.env.MONGODB_URL;
const DB_NAME = process.env.DB_NAME;
const fileUpload = require("express-fileupload");
const SocketAuthCheck = require("./Middlewere/SocketAuthCheck");
mongoose.connect(MONGODB_URL + DB_NAME).then(() => {
  console.log("MongoDb is Connected to Database : " + DB_NAME);
});

const app = express();

env.config();
app.use(cors());
app.use(express.json());
app.use(Router);
app.use(fileUpload());
app.use(
  express.urlencoded({
    extended: false,
  })
);
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.CLIENT_BASE_URL,
      process.env.SERVER_BASE_URL,
      process.env.AI_BASE_URL,
    ],
    credentials: true,
  },
});
let counter = 0;
io.use(SocketAuthCheck);
io.on("connection", async (socket) => {
  socket.join(["ROOM"]);
  socket.emit("CONNECTED", socket.id);
  counter += 1;
  console.log("user Connected " + socket.id);
  console.log("Total Users Connected : ", counter);
  socket.emit("getOnlineUsersCount", counter);
  
  socket.addListener("Disconnection", () => {
    socket.disconnect(true);
    console.log("user Disconnected " + socket.id);
    counter -= 1;
    console.log("Total Users Connected : ", counter);
    socket.emit("getOnlineUsersCount", counter);

  });
 
  socket.addListener("NEW_MESSAGE", ({ userId, chat }) => {
    const _id = userId?._id;
    console.log(userId);
    socket.to("ROOM").emit("MESSAGE_RESPONSE", { _id, chat });
  });
  socket.addListener("MESSAGE_RESPONSE", ({ userId, chat, res }) => {
    // console.log(res)

    socket.to("ROOM").emit("MESSAGE_RESPONSE_CLIENT", { res, userId });
    // console.log(userId,chat,res)
    new chatModel({
      userId: {
        _id: userId?._id,
      },
      chat: chat,
      response: res,
    }).save();
  });
});

app.listen(8001, () => {
  console.log("App is listning on port " + 8001);
});
server.listen(PORT, () => {
  console.log("SOCKET_SERVER is listning on port " + PORT);
});
