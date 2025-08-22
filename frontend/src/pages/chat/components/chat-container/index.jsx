import ChatHeader from "./components/chat-header";
import MessageBar from "./components/message-bar";
import MessageContainers from "./components/message-container";
import { useSocket } from "@/context/socketContext";
import { useAppStore } from "@/store";
import { useEffect } from "react";

function ChatContainer() {
  const socket = useSocket();
  const { userInfo, selectedChatType, updateMessageStatus } = useAppStore();

  useEffect(() => {
    if (socket && userInfo) {
      const handleMessageStatusChanged = ({ messageId, status }) => {
        updateMessageStatus(messageId, status);
      };

      socket.on("message-status-changed", handleMessageStatusChanged);

      return () => {
        socket.off("message-status-changed", handleMessageStatusChanged);
      };
    }
  }, [socket, userInfo, updateMessageStatus]);

  return (
    <div className="fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1">
      <ChatHeader />
      <MessageContainers />
      <MessageBar />
    </div>
  );
}

export default ChatContainer;
