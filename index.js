const express = require("express");
const cors = require("cors");
const env = require("dotenv");
const Router = require("./Router/router");
const mongoose = require("mongoose");
 
const PORT = process.env.PORT || 8001;
const {createServer} = require("http");
const { Server } = require("socket.io");
const app = express();
env.config();
app.use(cors());
app.use(express.json());
app.use(Router);
const server = createServer(app);
const io = new Server(server, {cors:{
    origin:["http://localhost:3000",
        "http://localhost:8000"
    ],
    credentials:true,
}});

io.on("connection",async (socket )=>{
    socket.join(['room']);
    console.log("user Connected "+socket.id)
    let allSocketsInRoom = await io.in('room').fetchSockets();
    allSocketsInRoom.map((value)=>{return console.log(value?.id)})
    socket.addListener("Disconnection",() =>{
       socket.disconnect(true);
       console.log("user Disconnected "+socket.id)
    })
    socket.addListener("NEW_MESSAGE",(msg) =>{
        console.log(msg[0])
        socket.to('room').emit("MESSAGE_RESPONSE",msg[0]+" from "+socket.id)
        // socket.emit("MESSAGE_RESPONSE",msg+" from "+socket.id);
    })
    socket.addListener("MESSAGE_RESPONSE",(msg)=>{
        socket.to('room').emit("MESSAGE_RESPONSE",msg);
    })
})

app.get("/",(req,res)=>{res?.sendFile(__dirname+"/Public/index.html")})
app.listen(8001,()=>{
    console.log("App is listning on port "+PORT)
})
server.listen(PORT,()=>{
    console.log("server is listning on port "+PORT)
})
const MONGODB_URL = process.env.MONGODB_URL;
const DB_NAME = process.env.DB_NAME;
mongoose.connect(MONGODB_URL+DB_NAME).then(()=>{
    console.log("MongoDb is Connected to Database : "+DB_NAME);
})

