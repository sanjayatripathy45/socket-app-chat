import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

interface JoinRoomProps {
    onJoin: (roomId: string, username: string) => void;
}

const JoinRoom: React.FC<JoinRoomProps> = ({ onJoin }) => {
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");

    const handleJoin = () => {
        if (roomId.trim() && username.trim()) {
            onJoin(roomId, username);
        }
    };

    return (
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
                onClick={handleJoin}
                sx={{ marginTop: 2 }}
            >
                Join
            </Button>
        </Box>
    );
};

export default JoinRoom;
