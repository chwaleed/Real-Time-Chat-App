import ChatHeader from "./components/chat-header";
import MessageBar from "./components/message-bar";
import MessageContainers from "./components/message-container";
import { useSocket } from "@/context/socketContext";
import { useAppStore } from "@/store";
import { useEffect } from "react";

function ChatContainer() {
  const socket = useSocket();
  const { userInfo, selectedChatType, addMessage, setMessages } = useAppStore();

  useEffect(() => {
    if (socket.current && userInfo) {
      socket.current.on("receiveMessage", (message) => {
        addMessage(message);
        socket.current.emit("message-delivered", {
          messageId: message._id,
          recipientId: userInfo.id,
        });
      });

      socket.current.on("message-status-changed", ({ messageId, status }) => {
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message._id === messageId ? { ...message, status } : message
          )
        );
      });

      return () => {
        socket.current.off("receiveMessage");
        socket.current.off("message-status-changed");
      };
    }
  }, [socket, userInfo, addMessage, setMessages]);

  return (
    <div className="fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1">
      <ChatHeader />
      <MessageContainers />
      <MessageBar />
    </div>
  );
}

export default ChatContainer;
