import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";


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
        // Request notification permission
        if (Notification.permission !== "granted") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    console.log("Notification permission granted");
                }
            });
        }

        // Listen for received messages
        socket.on("receive-message", ({ sender, message }) => {
            if (sender !== username) {
                setMessages((prev) => [...prev, { sender, message }]);

                // Trigger notification when a new message is received
                if (Notification.permission === "granted") {
                    new Notification("New message", {
                        body: `${sender}: ${message}`,
                        icon: "https://www.google.com/imgres?q=rohit&imgurl=https%3A%2F%2Fstatic.toiimg.com%2Fthumb%2Fmsid-113209976%2Cwidth-1280%2Cheight-720%2Cresizemode-4%2F113209976.jpg&imgrefurl=https%3A%2F%2Ftimesofindia.indiatimes.com%2Fsports%2Fcricket%2Fnews%2Fwho-will-be-indias-next-all-format-captain-after-rohit-sharma%2Farticleshow%2F113209968.cms&docid=EjNhY2Rtx6nRlM&tbnid=8aFo34lfM8Ui5M&vet=12ahUKEwiUt83XjvOJAxV8afUHHREMB_4QM3oECBcQAA..i&w=1280&h=720&hcb=2&ved=2ahUKEwiUt83XjvOJAxV8afUHHREMB_4QM3oECBcQAA", // Correct path to the image in the public folder
                    });
                }
            }
        });


        // Listen for typing indicator
        socket.on("typing", ({ user, isTyping }) => {
            setOtherUserTyping(isTyping);
            setTypeUsername(user);
        });

        // Listen for active users
        socket.on("active-users", (users) => {
            setActiveUsers(users);
        });

        // socket.on("server-notification", (data) => {
        //     console.log(data.message);
        // });

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

        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }

        typingTimeout.current = setTimeout(() => {
            setTyping(false);
            socket.emit("typing", { roomId, isTyping: false });
        }, 1000);
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            {!joinedRoom ? (
                <div>
                    <h2>Join a Chat Room</h2>
                    <input
                        type="text"
                        placeholder="Enter Room ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        style={{ padding: "10px", marginRight: "10px", width: "70%" }}
                    />
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ padding: "10px", marginRight: "10px", width: "70%" }}
                    />
                    <button onClick={joinRoom} style={{ padding: "10px 20px" }}>
                        Join
                    </button>
                </div>
            ) : (
                <div>
                    <h2>Chat Room: {roomId}</h2>
                    <div style={{ marginBottom: "20px" }}>
                        <h3>Active Users</h3>
                        <ul>
                            {activeUsers
                                .filter((user) => user !== username) 
                                .map((user, idx) => (
                                    <li key={idx}>{user}</li>
                                ))}
                        </ul>
                    </div>

                    {otherUserTyping && (
                        <p style={{ color: "gray", textAlign: "left" }}>
                            {typeUsername} is typing...
                        </p>
                    )}

                    <div
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "5px",
                            padding: "10px",
                            height: "300px",
                            overflowY: "scroll",
                            marginBottom: "10px",
                        }}
                    >
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: "flex",
                                    justifyContent: msg.sender === username ? "flex-end" : "flex-start",
                                    marginBottom: "10px",
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: "70%",
                                        padding: "10px",
                                        borderRadius: "10px",
                                        backgroundColor: msg.sender === username ? "#d1e7dd" : "#f8d7da",
                                        color: "#000",
                                        textAlign: "left",
                                    }}
                                >
                                    <strong>{msg.sender === username ? "You" : msg.sender}:</strong>
                                    <p style={{ margin: 0 }}>{msg.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                            type="text"
                            value={currentMessage}
                            onChange={handleTyping}
                            placeholder="Type a message"
                            style={{ flex: 1, padding: "10px", marginRight: "10px" }}
                        />
                        <button onClick={sendMessage} style={{ padding: "10px 20px" }}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatApp;
