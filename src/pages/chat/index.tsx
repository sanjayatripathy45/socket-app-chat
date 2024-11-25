import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { RootState } from "@/redux-toolkit/store";
import { useRouter } from "next/router";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { usePathname } from "next/navigation";

const socket = io(process.env.NEXT_PUBLIC_LOCAL_URL);

const ChatApp: React.FC = () => {
  const [roomId, setRoomId] = useState("");
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [messages, setMessages] = useState<
    { sender: string; message: string; time: string }[]
  >([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [typeUsername, setTypeUsername] = useState("");
  const [activeUsers, setActiveUsers] = useState<string[]>([]);

  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  useAuthCheck();
  const dispatch = useDispatch();

  const userFromRedux = useSelector((state: RootState) => state.auth.user);
  const [userFromLocalStorage, setUserFromLocalStorage] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("Login-data");
    if (storedUser) {
      setUserFromLocalStorage(JSON.parse(storedUser));
    }
  }, []);

  const user = userFromRedux || userFromLocalStorage;

  const pathName = usePathname();

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    socket.on("receive-message", ({ sender, message, time }) => {
      alert(time)
      if (sender !== user?.displayName) {
        setMessages((prev) => [...prev, { sender, message, time }]);
        if (Notification.permission === "granted") {
          new Notification("New message", {
            body: `${sender}: ${message}`,
          });
        }
      }
    });

    socket.on("typing", ({ user, isTyping }) => {
      setOtherUserTyping(isTyping);
      setTypeUsername(user);
    });

    socket.on("active-users", (users) => setActiveUsers(users));

    return () => {
      socket.off("receive-message");
      socket.off("typing");
      socket.off("active-users");
    };
  }, [user?.displayName]);

  const joinRoom = () => {
    if (roomId.trim()) {
      socket.emit("join-room", { roomId, username: user?.displayName });
      setJoinedRoom(true);
    }
  };

  const sendMessage = () => {
    if (currentMessage.trim()) {
      const currentTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const newMessage = {
        sender: user?.displayName,
        message: currentMessage,
        time: currentTime,
      };
      setMessages((prev) => [...prev, newMessage]);
      socket.emit("send-message", { roomId, ...newMessage });
      setCurrentMessage("");
      setTyping(false);
      socket.emit("typing", { roomId, isTyping: false });
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      socket.emit("typing", { roomId, isTyping: true });
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setTyping(false);
      socket.emit("typing", { roomId, isTyping: false });
    }, 1000);
  };

  return (
    <Box>
      {pathName === "/chat" && <Header />}

      <Box sx={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        {!joinedRoom ? (
          <Box>
            <Typography variant="h5" gutterBottom>
              Join a Chat Room
            </Typography>
            <TextField
              label="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={joinRoom}
              sx={{ marginTop: 2 }}
            >
              Join
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>
              Chat Room: {roomId}
            </Typography>
            <Paper elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
              <Typography variant="subtitle1">Active Users</Typography>
              <List>
                {activeUsers
                  .filter((username: string) => username !== user?.displayName)
                  .map((username, idx) => (
                    <ListItem key={idx}>
                      <ListItemText primary={username} />
                    </ListItem>
                  ))}
              </List>
            </Paper>

            {otherUserTyping && (
              <Typography variant="body2" color="textSecondary">
                {typeUsername} is typing...
              </Typography>
            )}

            <Paper
              elevation={3}
              sx={{
                padding: 2,
                height: "300px",
                overflowY: "scroll",
                marginBottom: 2,
                border: "1px solid #ddd",
              }}
            >
              {messages.map((msg, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: msg.sender === user?.displayName ? "flex-end" : "flex-start",
                    marginBottom: 2,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "70%",
                      backgroundColor: msg.sender === user?.displayName ? "#e3f2fd" : "#f1f1f1",
                      padding: 1,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      {msg.sender === user?.displayName ? "You" : msg.sender}
                    </Typography>
                    <Typography variant="body2">{msg.message}</Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ display: "block", marginTop: "4px" }}
                    >
                      {msg.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Paper>

            <TextField
              label="Type a message"
              value={currentMessage}
              onChange={handleTyping}
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={sendMessage}
              sx={{ marginTop: 1 }}
            >
              Send
            </Button>
          </Box>
        )}
      </Box>
      <Footer />
    </Box>
  );
};

export default ChatApp;
