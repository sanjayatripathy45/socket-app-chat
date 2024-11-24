import { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

interface Message {
    sender: string;
    message: string;
}

interface Typing {
    user: string;
    isTyping: boolean;
}

const useChat = (socket: Socket | null, roomId: string, username: string) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [activeUsers, setActiveUsers] = useState<string[]>([]);
    const [otherUserTyping, setOtherUserTyping] = useState<Typing | null>(null);
    const typingTimeout = useRef<NodeJS.Timeout | null>(null);

    const sendMessage = (message: string) => {
        if (socket && message.trim()) {
            const newMessage = { sender: username, message };
            setMessages((prev) => [...prev, newMessage]);
            socket.emit("send-message", { roomId, ...newMessage });
        }
    };

    const startTyping = () => {
        if (socket) {
            socket.emit("typing", { roomId, isTyping: true });
        }
    };

    const stopTyping = () => {
        if (socket) {
            socket.emit("typing", { roomId, isTyping: false });
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on("receive-message", ({ sender, message }: Message) => {
                if (sender !== username) {
                    setMessages((prev) => [...prev, { sender, message }]);
                }
            });

            socket.on("typing", (typingData: Typing) => {
                setOtherUserTyping(typingData);
            });

            socket.on("active-users", (users: string[]) => {
                setActiveUsers(users);
            });
        }

        return () => {
            if (socket) {
                socket.off("receive-message");
                socket.off("typing");
                socket.off("active-users");
            }
        };
    }, [socket, username]);

    return {
        messages,
        activeUsers,
        otherUserTyping,
        sendMessage,
        startTyping,
        stopTyping,
    };
};

export default useChat;
