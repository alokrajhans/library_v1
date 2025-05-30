import { axiosInstance } from './axiosInstance';

// Register a user
export const RegisterUser = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/users/register', payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Login a user
export const LoginUser = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/users/login', payload);
        if (response.data.success) {
            localStorage.setItem('token', response.data.accessToken);
            
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get logged-in user details
export const GetLoggedInUserDetails = async () => {
    try {
        const response = await axiosInstance.get('/api/users/get-logged-in-user');
        return response.data;
    } catch (error) {
        throw error;
    }
};

//get all users
export const GetAllUsers = async(role) => {
    try {
        const response = await axiosInstance.get(`/api/users/get-all-users/${role}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


//get user by id
export const GetUserById = async (id) => {
    try {
        const response = await axiosInstance.get(`api/users/get-user-by-id/${id}`);
        return response.data;
    } catch (error) {
        
    }
}