import { useAppStore } from "@/store";
import { useEffect, useRef } from "react";
import { apiClient } from "@/lib/api-client";
import { GET_MESSAGES_ROUTE } from "@/utils/constants";
import moment from "moment";
import Message from "./message";

function MessageContainers() {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
    allMessages,
  } = useAppStore();

  useEffect(() => {
    const getMessages = async () => {
      try {
        // First check if we have cached messages
        if (allMessages[selectedChatData._id]) {
          setSelectedChatMessages(allMessages[selectedChatData._id]);
          return;
        }
        
        // If no cached messages, fetch from server
        const response = await apiClient.post(
          GET_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
          // Store in allMessages for future use
          const { allMessages: currentAllMessages } = useAppStore.getState();
          useAppStore.setState({
            allMessages: {
              ...currentAllMessages,
              [selectedChatData._id]: response.data.messages
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedChatData?._id) {
      if (selectedChatType === "contact") getMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages, allMessages]);

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
          {selectedChatType === "contact" && <Message message={message} />}
        </div>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
}

export default MessageContainers;
