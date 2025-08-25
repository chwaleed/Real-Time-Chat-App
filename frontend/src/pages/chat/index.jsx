/* eslint-disable no-unused-vars */
import { useAppStore } from "@/store/index.js";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import ContactContainer from "./components/contact-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

function Chat() {
  const { selectedChatType } = useAppStore();

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
}

export default Chat;
