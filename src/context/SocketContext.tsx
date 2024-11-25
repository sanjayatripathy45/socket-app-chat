import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

type MessageType = { sender: string; message: string };

type SocketContextType = {
  socket: Socket | null;
  messages: MessageType[];
  activeUsers: string[];
  otherUserTyping: boolean;
  typeUsername: string;
  roomId: string; // Add roomId here
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  setRoomId: React.Dispatch<React.SetStateAction<string>>; // Setters for roomId
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [typeUsername, setTypeUsername] = useState("");
  const [roomId, setRoomId] = useState(""); // State to manage roomId
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_LOCAL_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    socketInstance.on("connect_error", () => {
      console.error("Socket connection failed.");
    });

    socket.current = socketInstance;

    socket.current.on("receive-message", ({ sender, message }) => {
      setMessages((prev) => [...prev, { sender, message }]);
    });

    socket.current.on("typing", ({ user, isTyping }) => {
      setOtherUserTyping(isTyping);
      setTypeUsername(user);
    });

    socket.current.on("active-users", (users: string[]) => setActiveUsers(users));

    return () => {
      socket.current?.off("receive-message");
      socket.current?.off("typing");
      socket.current?.off("active-users");
      socket.current?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socket.current,
        messages,
        activeUsers,
        otherUserTyping,
        typeUsername,
        roomId, // Provide roomId here
        setMessages,
        setRoomId, // Provide setter for roomId
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export default SocketProvider;
