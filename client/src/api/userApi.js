import axios from "axios";

const BASE_URL = "/api";

const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

apiClient.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;

            try {
                 await apiClient.post("/token/refresh/")
                 return apiClient(originalRequest)
            }catch(refreshError){
                 return Promise.reject(refreshError)
            }
        }

         return Promise.reject(error);
    }
);

export const fetchUserProfile = async (username) => {
    try {
        const response = await apiClient.get(`/user/${username}/`);
        return response.data;
    } catch (error) {
        throw (
            error.response?.data?.error ||
            "An error occurred while fetching user data"
        );
    }
};


export const signInApi = async (username, password) => {
    try { 
        const response = await apiClient.post("token/", {
            username,
            password,
        });
        return response.data; 
    } catch (error) {
        if (error.response && error.response.status === 401) {
            return { success: false, message: "Invalid username or password" };
        }
        console.log(error, "Error while logging in");
        throw error; 
    }
};

export const signUpApi = async (userData) => {
    try { 
        const response = await apiClient.post("register/", userData);
    if (response.status === 201) {
        return response.data; 
      }
      throw new Error('Signup failed');
    } catch (error) {
      console.error('Signup Error:', error.response ? error.response.data : error.message);
      throw error; 
    }
};

export const getAuth = async () => {
    try {
        const response = await apiClient.get(`/auth/status/`);
        return response.data;
    } catch (error) {
        throw (
            error.response?.data?.error ||
            "An error occurred while authenticating"
        );
    }
}

export const toggleFollow = async (username) => {
    try{
        const response = await apiClient.post(`toggle_follow/${username}/`);
        return response.data;
    }catch(error){
        throw (
            error.response?.data?.error ||
            `An error occurred while attempting to toggle follow ${username}`
        );
    }
}

export const getUserPosts= async (username) => {
    try{
        const response = await apiClient.get(`posts/${username}`)
        return response.data.data
    }catch(error){
        throw(
            error.response?.data?.error ||
            `An error occurred while attempting to toggle follow ${username}`
        );
    }
}