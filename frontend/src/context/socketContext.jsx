/* eslint-disable react/prop-types */
 
/* eslint-disable no-unused-vars */
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();
  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });
      socket.current.on("connect", () => {
        console.log("Connected to socket server.");
      });

      const handleReciveMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage, userInfo } =
          useAppStore.getState();
        
        // Always add the message to the store - let addMessage handle unread counts
        addMessage(message);

        // Mark message as delivered if we're the recipient
        if (message.recipient._id === userInfo.id) {
          socket.current.emit("message-delivered", {
            messageId: message._id,
            recipientId: userInfo.id,
          });
        }
      };
      socket.current.on("receiveMessage", handleReciveMessage);

      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);
  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
