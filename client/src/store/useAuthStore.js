import {create} from 'zustand'
import { axiosinstance } from '../lib/axios';

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIng :false,
    IsUpdatingProfile:false,
    IsCheckingAuth:true,

    checkAuth:async ()=>{
        try {
            const res = await axiosinstance.get('/auth/check');
            set({authUser:res.data});
            
        } catch (error) {
            console.log(error.message);
            
        } finally{
            set({IsCheckingAuth:false});
        };
    },

    signup:async(data)=>{
        
    }


}))