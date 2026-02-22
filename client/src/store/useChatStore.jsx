import { create } from "zustand";
import { axiosinstance } from "../lib/axios";
import toast from "react-hot-toast";

const useChatStore = create((set) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers:async()=>{
        set({isUsersLoading:true});
        try {
            const res = await axiosinstance.get('/messages/users');
            set({ users: res.data });
        } catch (error) {
            console.log(error.message);
            toast.error("Failed to load users");
        } finally {
            set({isUsersLoading:false});
        }
    },

    getMessages: async(userId)=>{
        set({isMessagesLoading:true});
        try{
            const res = await axiosinstance.get(`/messages/${userId}`);
            set({messages: res.data, selectedUser: userId});    
        } catch(error){
            console.log(error.message);
            toast.error("Failed to load messages");
        } finally {
            set({isMessagesLoading:false});
        }


}));

export default useChatStore;