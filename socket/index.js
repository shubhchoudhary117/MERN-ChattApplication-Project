
const io = require("socket.io")(8900, {
  maxHttpBufferSize: 1e8,
    pingTimeout: 6000,
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

