const express=require("express");
const app=express();
const cors=require("cors");
const { urlencoded } = require("express");
const AuthRoutes=require("./routes/auth.js")
const ConnectDB=require("./config/connection.js")
const UserRoutes=require("./routes/user.js")
const MessageRoutes=require("./routes/MessangerRoutes/message.js")
const ConversationRoutes=require("./routes/MessangerRoutes/conversation.js")
var bodyParser = require('body-parser');
// config the .evn file
require("dotenv").config();

// set the app port number
const PORT=process.env.PORT;

// connect to database
ConnectDB();
// set some configuration
app.use(cors());
app.use(express.json());
app.use(urlencoded({extended:true}));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/",(req,res)=>{
  res.send("app is running");
})

app.use("/",AuthRoutes)

app.use("/user",UserRoutes)


app.use("/user/chat",ConversationRoutes)
app.use("/user/chat",MessageRoutes)

const server=app.listen(PORT,()=>{
  console.log(`app is running on ${PORT}`)
})






const io = require("socket.io")(server, {
  maxHttpBufferSize: 1e8,
   
    cors: {
      origin: "http://localhost:3000",
      // credentials: true,
    },
  });


  var users=[];


  const addUser=(userId,socketId)=>{
    !users.some((user)=>user.userId===userId)&&users.push({userId,socketId})
  }

  const removeUser=(socketId)=>{
    users=users.filter((user)=>user.socketId!==socketId);
  }

  const getUser=(userId)=>{
    return users.find((user)=>user.userId===userId);
  }

io.on("connection",(socket)=>{
    console.log("connected to the socket ");

    io.emit("welcome","welcome to socket server")

    // add a new user
    socket.on("add-user",(userId)=>{
        addUser(userId,socket.id);
        console.log(userId)
        io.emit("get-users",users);
    })

    // send and get messages
    socket.on("send-message",({senderId,receiverId,text})=>{
        const user=getUser(senderId);
        io.to(user?.socketId).emit("get-messages",{senderId:senderId,text:text})
    })

    socket.on("disconnect",()=>{
        removeUser(socket.id);
        io.emit("get-users",users);
    })
})


 

