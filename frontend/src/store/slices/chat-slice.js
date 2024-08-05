/* eslint-disable no-undef */
export const createChatSlice = (set, get)({
  selectedChatType: null,
  selectedChatData: null,
  selectedChatMessages: [],
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),
  closeChat: () =>
    set({
      selectedChatData: null,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),
});
