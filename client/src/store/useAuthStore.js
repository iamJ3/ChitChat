import { create } from "zustand";
import { axiosinstance } from "../lib/axios";
import toast from "react-hot-toast";
import io from "socket.io-client";
import { SOCKET_EVENTS } from "../lib/socketEvents";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const CONNECTION_STATUS = {
  IDLE: "idle",
  CONNECTING: "connecting",
  CONNECTED: "connected",
  ERROR: "error",
};

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  socket: null,
  connectionStatus: CONNECTION_STATUS.IDLE,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosinstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.error("[Auth] checkAuth error:", error?.message);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosinstance.post("/auth/signup", data);
      toast.success("Account created successfully");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create account";
      toast.error(message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosinstance.post("/auth/login", data);
      toast.success("Logged in successfully");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to login";
      toast.error(message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    set({ isLoggingIn: true });
    try {
      await axiosinstance.post("/auth/logout");
      get().disconnectSocket();
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("[Auth] logout error:", error?.message);
      toast.error("Failed to logout");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosinstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update profile";
      toast.error(message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser) return;
    if (socket?.connected) return;

    try {
      set({ connectionStatus: CONNECTION_STATUS.CONNECTING });

      const sock = io(BASE_URL, {
        query: { userId: authUser._id },
      });

      sock.on("connect", () => {
        set({ connectionStatus: CONNECTION_STATUS.CONNECTED });
      });

      sock.on("connect_error", (err) => {
        console.error("[Auth] socket connect_error:", err?.message);
        set({ connectionStatus: CONNECTION_STATUS.ERROR });
      });

      sock.on("disconnect", () => {
        set({ connectionStatus: CONNECTION_STATUS.IDLE });
      });

      sock.on(SOCKET_EVENTS.GET_ONLINE_USERS, (userIds) => {
        set({ onlineUsers: Array.isArray(userIds) ? userIds : [] });
      });

      set({ socket: sock });
    } catch (err) {
      console.error("[Auth] connectSocket failed:", err);
      set({ socket: null, connectionStatus: CONNECTION_STATUS.ERROR });
    }
  },

  disconnectSocket: () => {
    const sock = get().socket;
    if (sock?.connected) sock.disconnect();
    set({ socket: null, connectionStatus: CONNECTION_STATUS.IDLE, onlineUsers: [] });
  },
}));
