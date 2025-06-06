const express = require("express");
const env = require("dotenv");
env.config();
const cors = require("cors");
const http = require("http");
const app = express();
const socketIoClient = require("socket.io-client");
const server = http.createServer(app);
app.use(cors);
app.use(express.json());
const socket = socketIoClient(process.env.SERVER_BASE_URL, {
  auth: {
    _id: process.env.AI_TOKEN,
  },
});

const AI_PORT = process.env.AI_PORT || 8003;
socket.on("connect", (socket) => {
  console.log("ai connected");
});
socket.emit("userOnline", "AI");

socket.on("disconnect", () => {
  console.log("ai disconnected");
});
socket.on("AI_MESSAGE_RESPONSE", async (props) => {
  try {
    const response = await fetch(
      `${process.env.DJANGO_SERVER_API}?query=${encodeURIComponent(
        props?.chat
      )}&name=${props?.chatBotName}`,
      {
        method: "GET",
      }
    );
    
    if (await response.headers.get("content-type").includes("application/json")) {
      // console.log('JSON response:', await response.json());
      socket.emit("MESSAGE_RESPONSE", {
        userId: {
          _id: props?._id,
        },
        chat: props?.chat,
        res: await response.json(), // Assuming 'prediction' is the key in the Django JSON response
      });
    } else if (await response.headers.get("content-type").includes("text/html")) {
      // console.log('HTML response:', await response.text() );
      socket.emit("MESSAGE_RESPONSE", {
        userId: {
          _id: props?._id,
        },
        chat: props?.chat,
        res: await response.text(), // Assuming 'prediction' is the key in the Django JSON response
      });
    }
        // const data = await response.json();
    // Emit the response back to the socket with the received data
    // socket.emit("MESSAGE_RESPONSE", {
    //   userId: {
    //     _id: props?._id,
    //   },
    //   chat: props?.chat,
    //   res: data.prediction, // Assuming 'prediction' is the key in the Django JSON response
    // });
  } catch (error) {
    console.error("Error fetching from Django server:", error);

    // Emit an error response if the fetch fails
    socket.emit("MESSAGE_RESPONSE", {
      userId: {
        _id: props?._id,
      },
      chat: props?.chat,
      res: "Error occurred while fetching the response", // or any other error message
    });
  }
});
server.listen(AI_PORT, () => {
  console.log("AI IS RUNNING ON PORT 8003");
});
