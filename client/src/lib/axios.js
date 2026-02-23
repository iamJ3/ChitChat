import axios from 'axios';

export const axiosinstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api',
    withCredentials: true,
});