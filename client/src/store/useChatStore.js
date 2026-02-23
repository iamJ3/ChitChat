import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosinstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { SOCKET_EVENTS } from "../lib/socketEvents";

/** Normalize ID for comparison (ObjectId vs string). */
function normalizeId(id) {
  if (id == null) return "";
  return String(id);
}

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosinstance.get("/messages/users");
      set({ users: res.data ?? [] });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load users";
      toast.error(message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosinstance.get(`/messages/${userId}`);
      set({ messages: res.data ?? [] });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load messages";
      toast.error(message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) {
      toast.error("No conversation selected");
      return;
    }
    try {
      const res = await axiosinstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...(messages ?? []), res.data] });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send message";
      toast.error(message);
    }
  },

  /**
   * Idempotent subscription: guards socket, removes existing listener then adds.
   * Call only when socket is non-null and connected.
   */
  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    const { selectedUser } = get();
    if (!selectedUser) return;

    const selectedId = normalizeId(selectedUser._id);

    socket.off(SOCKET_EVENTS.NEW_MESSAGE);
    socket.on(SOCKET_EVENTS.NEW_MESSAGE, (newMessage) => {
      const senderId = normalizeId(newMessage?.senderId);
      if (senderId !== selectedId) return;

      set((state) => ({
        messages: [...(state.messages ?? []), newMessage],
      }));
    });
  },

  /**
   * Safe unsubscribe: guard before .off to avoid runtime crash.
   */
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.off(SOCKET_EVENTS.NEW_MESSAGE);
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
