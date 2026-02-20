import { create } from 'zustand'
import { axiosinstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIng: false,
    IsUpdatingProfile: false,
    IsCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosinstance.get('/auth/check');
            set({ authUser: res.data });

        } catch (error) {
            console.log(error.message);

        } finally {
            set({ IsCheckingAuth: false });
        };
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosinstance.post('/auth/signup', data);
            toast.success("Account created successfully");
            set({ authUser: res.data });
        } catch (error) {
            console.log(error.message);
            const errorMessage = error.response?.data?.message || "Failed to create account";
            toast.error(errorMessage);
        } finally {
            set({ isSigningUp: false });
        }
    },

    logout: async () => {
        set({ isLoggingIng: true });
        try {
            await axiosinstance.post('/auth/logout');
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error) {
            console.log(error.message);
            toast.error("Failed to logout");
        } finally {
            set({ isLoggingIng: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIng: true });
        try {
            const res = await axiosinstance.post('/auth/login', data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
        } catch (error) {
            console.log(error.message);
            const errorMessage = error.response?.data?.message || "Failed to login";
            toast.error(errorMessage);
        } finally {
            set({ isLoggingIng: false });
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosinstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },


}))