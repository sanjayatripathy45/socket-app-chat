import React from "react";
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";

interface ChatRoomProps {
    roomId: string;
    username: string;
    messages: { sender: string; message: string }[];
    activeUsers: string[];
    otherUserTyping: { user: string; isTyping: boolean } | null;
    sendMessage: (message: string) => void;
    handleTyping: (isTyping: boolean) => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
    roomId,
    username,
    messages,
    activeUsers,
    otherUserTyping,
    sendMessage,
    handleTyping,
}) => {
    const [currentMessage, setCurrentMessage] = React.useState("");

    const handleSend = () => {
        sendMessage(currentMessage);
        setCurrentMessage("");
        handleTyping(false);
    };

    return (
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

            {otherUserTyping?.isTyping && (
                <Typography variant="body2" color="textSecondary">
                    {otherUserTyping.user} is typing...
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
                    onChange={(e) => {
                        setCurrentMessage(e.target.value);
                        handleTyping(true);
                    }}
                    placeholder="Type a message"
                    fullWidth
                    margin="normal"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSend}
                    sx={{ marginLeft: 1 }}
                >
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default ChatRoom;
