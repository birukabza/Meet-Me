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
                 await apiClient.post("/token/refresh")
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
        const response = await apiClient.get(`/user/${username}`);
        return response.data;
    } catch (error) {
        throw (
            error.response?.data?.error ||
            "An error occurred while fetching user data"
        );
    }
};


export const login = async (username, password) => {
    try {
        const response = await apiClient.post(`/token`, {
            username,
            password,
        });
        return response.data;
    } catch (error) {
        console.log(error, "Error while logging in");
        throw error;
    }
};

