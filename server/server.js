import { createServer } from "http";
import { Server } from "socket.io";

const serverHttp = createServer();

const io = new Server(serverHttp, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Store users and their rooms
const users = {};

io.on("connection", (socket) => {
  console.log(socket.id, "connected");

  // Handle user joining a room
  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);
    users[socket.id] = { roomId, username }; 
    console.log(`${username} joined room: ${roomId}`);

    // Broadcast the updated list of active users
    broadcastActiveUsers(roomId);
  });

  // Handle receiving and broadcasting a message with sender's name and timestamp
  socket.on("send-message", ({ roomId, sender, message }) => {
    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    console.log(`Message from ${sender} in room ${roomId}: ${message} at ${timestamp}`);

    io.to(roomId).emit("receive-message", { sender, message, timestamp });
  });

  // Handle typing indicator
  socket.on("typing", ({ roomId, isTyping }) => {
    const user = users[socket.id]?.username || "Anonymous";
    socket.to(roomId).emit("typing", { user, isTyping });
  });

  // Handle user disconnecting
  socket.on("disconnect", () => {
    const { roomId } = users[socket.id] || {};
    delete users[socket.id]; // Remove the user from the list

    console.log(`${socket.id} disconnected`);
    if (roomId) {
      broadcastActiveUsers(roomId); 
    }
  });

  // Helper function to broadcast active users in a room
  const broadcastActiveUsers = (roomId) => {
    const activeUsers = Object.values(users)
      .filter((user) => user.roomId === roomId)
      .map((user) => user.username);
    io.to(roomId).emit("active-users", activeUsers);
  };
});

serverHttp.listen(3002, () => {
  console.log("Server listening on port 3002");
});
