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
mongoose.connect(MONGODB_URL + DB_NAME).then(() => {
  console.log("MongoDb is Connected to Database : " + DB_NAME);
});

const app = express();
env.config();
app.use(cors());
app.use(express.json());
app.use(Router);
app.use(fileUpload())
app.use(express.urlencoded({
    extended:false
}))
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:8000"],
    credentials: true,
  },
});

io.on("connection", async (socket) => {
  socket.join(["ROOM"]);
  socket.emit("CONNECTED", socket.id);

  console.log("user Connected " + socket.id);

  socket.addListener("Disconnection", () => {
    socket.disconnect(true);
    console.log("user Disconnected " + socket.id);
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

app.get("/", (req, res) => {
  res?.sendFile(__dirname + "/Public/index.html");
});
app.listen(8001, () => {
  console.log("App is listning on port " + 8001);
});
server.listen(PORT, () => {
  console.log("AI is listning on port " + PORT);
});
