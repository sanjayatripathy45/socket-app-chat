import React, { useState } from "react";
import useSocket from "@/hooks/useScocket";
import useChat from "../hooks/useChat";
import JoinRoom from "@/components/JoinRooms";
import ChatRoom from "../components/ChatRoom";
import ChatApp from "./chat";
import { AppBar, Avatar, Box, Button, Toolbar, Typography } from "@mui/material";
import {auth} from "@/config/firebase";
import { signOut } from "firebase/auth";
import Header from "@/components/Header/Header";

const ChatApps = () => {


    // const [roomId, setRoomId] = useState("");
    // const [username, setUsername] = useState("");
    // const socket = useSocket(process.env.NEXT_PUBLIC_LOCAL_URL!);
    // const { messages, activeUsers, otherUserTyping, sendMessage, startTyping, stopTyping } =
    //     useChat(socket, roomId, username);

    return (
        <div>
    <Header />
            {/* {roomId && username ? (
                <ChatRoom
                    roomId={roomId}
                    username={username}
                    messages={messages}
                    activeUsers={activeUsers}
                    otherUserTyping={otherUserTyping}
                    sendMessage={sendMessage}
                    handleTyping={(isTyping) => (isTyping ? startTyping() : stopTyping())}
                />
            ) : (
                <JoinRoom onJoin={(room, user) => {
                    setRoomId(room);
                    setUsername(user);
                }} />
            )} */}

            <ChatApp />
        </div>
    );
};

export default ChatApps;
