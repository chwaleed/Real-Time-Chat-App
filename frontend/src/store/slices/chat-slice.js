/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContacts: [],
  unreadMessages: {}, // Format: { userId: count }
  allMessages: {}, // Format: { chatId: [messages] } - stores all messages by chat
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData) => {
    const { unreadMessages, allMessages } = get();
    set({ 
      selectedChatData,
      // Load messages for the selected chat and clear unread count
      selectedChatMessages: selectedChatData ? (allMessages[selectedChatData._id] || []) : [],
      unreadMessages: selectedChatData 
        ? { ...unreadMessages, [selectedChatData._id]: 0 }
        : unreadMessages
    });
  },
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),
  setDirectMessagesContacts: (directMessagesContacts) =>
    set({ directMessagesContacts }),
  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),
  addMessage: (message) => {
    const { selectedChatMessages, selectedChatType, selectedChatData, unreadMessages, userInfo, allMessages } = get();
    
    // Determine chat ID based on current user
    const senderId = selectedChatType === "channel" ? message.sender : message.sender._id;
    const recipientId = selectedChatType === "channel" ? message.recipient : message.recipient._id;
    const chatId = senderId === userInfo?.id ? recipientId : senderId;
    
    // Normalize message format
    const normalizedMessage = {
      ...message,
      recipient: recipientId,
      sender: senderId,
    };
    
    // Update all messages store
    const chatMessages = allMessages[chatId] || [];
    const updatedAllMessages = {
      ...allMessages,
      [chatId]: [...chatMessages, normalizedMessage]
    };
    
    // Update selected chat messages if this message is for the current chat
    let updatedSelectedMessages = selectedChatMessages;
    if (selectedChatData && selectedChatData._id === chatId) {
      updatedSelectedMessages = [...selectedChatMessages, normalizedMessage];
    }
    
    // Handle unread count
    let updatedUnreadMessages = unreadMessages;
    if (userInfo && senderId !== userInfo.id) {
      if (!selectedChatData || selectedChatData._id !== chatId) {
        updatedUnreadMessages = {
          ...unreadMessages,
          [chatId]: (unreadMessages[chatId] || 0) + 1
        };
      }
    }

    set({
      selectedChatMessages: updatedSelectedMessages,
      unreadMessages: updatedUnreadMessages,
      allMessages: updatedAllMessages,
    });
  },
  updateMessageStatus: (messageId, status) => {
    const { selectedChatMessages, allMessages } = get();
    
    // Update selected messages
    const updatedSelectedMessages = selectedChatMessages.map((message) =>
      message._id === messageId ? { ...message, status } : message
    );
    
    // Update all messages
    const updatedAllMessages = { ...allMessages };
    Object.keys(updatedAllMessages).forEach(chatId => {
      updatedAllMessages[chatId] = updatedAllMessages[chatId].map((message) =>
        message._id === messageId ? { ...message, status } : message
      );
    });

    set({
      selectedChatMessages: updatedSelectedMessages,
      allMessages: updatedAllMessages,
    });
  },
});
