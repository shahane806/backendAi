const express = require("express")
const env = require("dotenv")
env.config();
const cors = require('cors')
const http = require("http")
const app =  express()
const socketIoClient = require('socket.io-client');
const server = http.createServer(app);
app.use(cors)
app.use(express.json())
const socket = socketIoClient(process.env.SERVER_BASE_URL,{
    auth:{
      _id : process.env.AI_TOKEN
    }
  });

const AI_PORT = process.env.AI_PORT || 8003
socket.on("connect", (socket) => {
    console.log("ai connected");

    
  });
  socket.on("disconnect", () => {
    console.log("ai disconnected");
  });
  socket.on("MESSAGE_RESPONSE", ({ _id, chat }) => {
    console.log(_id, chat);
    socket.emit("MESSAGE_RESPONSE", {
      userId: {
        _id: _id,
      },
      chat: chat,
      res: "hello from ai",
    });
  });
  server.listen(AI_PORT, () => {
    console.log('AI IS RUNNING ON PORT 8003');
  });