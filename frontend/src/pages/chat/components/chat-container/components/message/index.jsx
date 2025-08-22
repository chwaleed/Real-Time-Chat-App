import { useAppStore } from "@/store";
import { useSocket } from "@/context/socketContext";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { HOST } from "@/utils/constants";
import moment from "moment";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { BsCheck, BsCheckAll } from "react-icons/bs";

function Message({ message }) {
  const socket = useSocket();
  const { userInfo, selectedChatData } = useAppStore();
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView && message.sender === selectedChatData._id && message.status !== "read") {
      socket.current.emit("message-read", {
        messageId: message._id,
        recipientId: userInfo.id,
      });
    }
  }, [inView, message, selectedChatData, userInfo, socket]);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const renderStatus = () => {
    if (message.status === "sent") {
      return <BsCheck className="text-lg" />;
    }
    if (message.status === "delivered") {
      return <BsCheckAll className="text-lg" />;
    }
    if (message.status === "read") {
      return <BsCheckAll className="text-lg text-icon-ack" />;
    }
  };

  return (
    <div ref={ref}>
      {message.sender !== selectedChatData._id ? (
        <div className="flex gap-3 justify-end">
          <div className="flex flex-col gap-1">
            <div className="bg-[#8417ff]/5 text-[#8417ff]/90 border border-[#8417ff]/50 p-4 rounded-3xl max-w-[70%]">
              {checkIfImage(message.fileUrl) ? (
                <div className="cursor-pointer">
                  <img
                    src={`${HOST}/${message.fileUrl}`}
                    height={300}
                    width={300}
                    alt="file"
                  />
                </div>
              ) : (
                <span>{message.content}</span>
              )}
            </div>
            <div className="text-xs text-gray-600 flex items-center gap-2">
              {moment(message.timestamp).format("LT")}
              {renderStatus()}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-3 justify-start">
          <Avatar className="h-8 w-8 rounded-full overflow-hidden">
            {selectedChatData.image ? (
              <AvatarImage
                src={`${HOST}/${selectedChatData.image}`}
                alt="avatar"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-8 w-8 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                  selectedChatData.color
                )}`}
              >
                {selectedChatData.firstName
                  ? selectedChatData.firstName.split("").shift()
                  : selectedChatData.email.split("").shift()}
              </div>
            )}
          </Avatar>
          <div className="flex flex-col gap-1">
            <div className="bg-[#2a2b33]/5 text-white/80 border border-[#ffffff]/20 p-4 rounded-3xl max-w-[70%]">
              {checkIfImage(message.fileUrl) ? (
                <div className="cursor-pointer">
                  <img
                    src={`${HOST}/${message.fileUrl}`}
                    height={300}
                    width={300}
                    alt="file"
                  />
                </div>
              ) : (
                <span>{message.content}</span>
              )}
            </div>
            <div className="text-xs text-gray-600">
              {moment(message.timestamp).format("LT")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Message;
