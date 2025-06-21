import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://lmsbackend-zkny.onrender.com' || "http://localhost:5000",
});

axiosInstance.interceptors.request.use((config) => {
    console.log("Request config:", config);
    const token = JSON.parse(sessionStorage.getItem('accessToken')) || "";
    console.log("Token:", token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;