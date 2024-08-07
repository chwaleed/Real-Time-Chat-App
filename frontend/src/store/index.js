import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slice.js";
import { createChatSlice } from "./slices/chat-slice.js";

export const useAppStore = create((a) => ({
  ...createAuthSlice(a),
  ...createChatSlice(a),
}));
