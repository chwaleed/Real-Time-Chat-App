import { useAppStore } from "@/store/index.js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Chat() {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.prfileSetup) {
      toast("Please setup profile to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return <div>Chat</div>;
}

export default Chat;
