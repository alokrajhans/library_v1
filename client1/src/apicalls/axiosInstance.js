import axios from 'axios';

// Axios instance with interceptor
export const axiosInstance = axios.create({
    headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
    },
});

