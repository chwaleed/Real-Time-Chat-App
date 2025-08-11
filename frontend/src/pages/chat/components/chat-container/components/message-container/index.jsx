import { useAppStore } from "@/store";
import { useEffect, useRef } from "react";
import { apiClient } from "@/lib/api-client";
import { GET_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import moment from "moment";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";

function MessageContainers() {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
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
            <div className="text-xs text-gray-600">
              {moment(message.timestamp).format("LT")}
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

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
}

export default MessageContainers;
