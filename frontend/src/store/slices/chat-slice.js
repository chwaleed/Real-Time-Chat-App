 
 
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
    
    // Normalize message format first
    const senderId = selectedChatType === "channel" ? message.sender : message.sender._id;
    const recipientId = selectedChatType === "channel" ? message.recipient : message.recipient._id;
    
    const normalizedMessage = {
      ...message,
      recipient: recipientId,
      sender: senderId,
    };
    
    // Determine which chat this message belongs to
    // For the current user, the chat ID is the other person's ID
    let chatId;
    if (userInfo) {
      if (senderId === userInfo.id) {
        // Current user sent this message, chat ID is the recipient
        chatId = recipientId;
      } else {
        // Someone else sent this message, chat ID is the sender
        chatId = senderId;
      }
    } else {
      // Fallback if userInfo not available
      chatId = senderId;
    }
    
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
    
    // Handle unread count - only increment if message is from someone else and not in current chat
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
  sortContactsByActivity: (contacts) => {
    const { unreadMessages, allMessages } = get();
    return [...contacts].sort((a, b) => {
      // First priority: unread messages count
      const aUnread = unreadMessages[a._id] || 0;
      const bUnread = unreadMessages[b._id] || 0;
      if (aUnread !== bUnread) {
        return bUnread - aUnread; // Contacts with unread messages first
      }
      
      // Second priority: latest message timestamp
      const aMessages = allMessages[a._id] || [];
      const bMessages = allMessages[b._id] || [];
      const aLatest = aMessages.length > 0 ? new Date(aMessages[aMessages.length - 1].timestamp) : new Date(0);
      const bLatest = bMessages.length > 0 ? new Date(bMessages[bMessages.length - 1].timestamp) : new Date(0);
      
      return bLatest - aLatest; // Most recent messages first
    });
  },
});
