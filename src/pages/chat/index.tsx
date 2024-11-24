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

const socket = io(process.env.NEXT_PUBLIC_LOCAL_URL);

const ChatApp: React.FC = () => {
    const [roomId, setRoomId] = useState("");
    const [joinedRoom, setJoinedRoom] = useState(false);
    const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [typing, setTyping] = useState(false);
    const [otherUserTyping, setOtherUserTyping] = useState(false);
    const [typeUsername, setTypeUsername] = useState("");
    const [username, setUsername] = useState("");
    const [activeUsers, setActiveUsers] = useState<string[]>([]);

    const typingTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }

        socket.on("receive-message", ({ sender, message }) => {
            if (sender !== username) {
                setMessages((prev) => [...prev, { sender, message }]);
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
    }, [username]);

    const joinRoom = () => {
        if (roomId.trim() && username.trim()) {
            socket.emit("join-room", { roomId, username });
            setJoinedRoom(true);
        }
    };

    const sendMessage = () => {
        if (currentMessage.trim()) {
            const newMessage = { sender: username, message: currentMessage };
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
                    <TextField
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                                .filter((user) => user !== username)
                                .map((user, idx) => (
                                    <ListItem key={idx}>
                                        <ListItemText primary={user} />
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
                                    justifyContent: msg.sender === username ? "flex-end" : "flex-start",
                                    marginBottom: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        padding: "10px",
                                        borderRadius: "10px",
                                        backgroundColor: msg.sender === username ? "#d1e7dd" : "#f8d7da",
                                    }}
                                >
                                    <Typography variant="body2" fontWeight="bold">
                                        {msg.sender === username ? "You" : msg.sender}
                                    </Typography>
                                    <Typography variant="body2">{msg.message}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Paper>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TextField
                            value={currentMessage}
                            onChange={handleTyping}
                            placeholder="Type a message"
                            fullWidth
                            margin="normal"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={sendMessage}
                            sx={{ marginLeft: 1 }}
                        >
                            Send
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default ChatApp;
