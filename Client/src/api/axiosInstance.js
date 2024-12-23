import axios from 'axios';

const  axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/'
});

axiosInstance.interceptors.request.use((config) => {
    const accessToken = sessionStorage.getItem('access-token');
    if(accessToken){
        config.headers.Authorization = `Bearer ${JSON.parse(accessToken)}`
    }

    return config;
}, (err) => Promise.reject(err));

export default axiosInstance;