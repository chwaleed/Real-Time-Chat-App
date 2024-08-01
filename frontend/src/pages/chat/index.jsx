import { useAppStore } from "@/store/index.js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactContainer from "./components/contact-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

function Chat() {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();
  // console.log(userInfo);
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please setup profile to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactContainer />
      {/* <EmptyChatContainer /> */}
      <ChatContainer />
    </div>
  );
}

export default Chat;
