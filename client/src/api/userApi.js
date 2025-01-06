
import { getAccessToken, getRefreshToken, saveTokens, removeTokens } from "./tokenHelpers";
import { apiClient } from "./axiosConfig";

apiClient.interceptors.request.use((config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = getRefreshToken();

            try {
                const response = await apiClient.post(`/token/refresh/`, { refresh: refreshToken });
                const { access_token } = response.data;
                saveTokens(access_token, refreshToken);

                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                removeTokens();
                return Promise.reject(refreshError);
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
        const response = await apiClient.post("token/", { username, password });
        const { access_token, refresh_token } = response.data;
        saveTokens(access_token, refresh_token);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            return { success: false, message: "Invalid username or password" };
        }
        console.error("Error while logging in:", error);
        throw error;
    }
};

export const signOutApi = async () => {
    try {
        removeTokens();
    } catch (error) {
        throw (
            error.response?.data?.error || "An error occurred while logging out"
        );
    }
};


export const signUpApi = async (userData) => {
    try {
        const response = await apiClient.post("register/", userData);
        if (response.status === 201) {
            return response.data;
        }
        throw new Error("Signup failed");
    } catch (error) {
        console.error(
            "Signup Error:",
            error.response ? error.response.data : error.message
        );
        throw error;
    }
};


export const getAuth = async () => {
    try {
        const response = await apiClient.get(`/auth/status/`);
        return response.data;
    } catch (error) {
        throw (
            error.response?.data?.error || "An error occurred while authenticating"
        );
    }
};

export const toggleFollow = async (username) => {
    try {
        const response = await apiClient.post(`toggle_follow/${username}/`);
        return response.data;
    } catch (error) {
        throw (
            error.response?.data?.error ||
            `An error occurred while attempting to toggle follow ${username}`
        );
    }
};

export const toggleLike = async (post_id) => {
    try {
        const response = await apiClient.post(`toggle_like_post/${post_id}/`);
        return response.data;
    } catch (error) {
        throw (
            error.response?.data?.error ||
            `An error occurred while attempting to toggle like ${post_id}`
        );
    }
};

export const getUserPosts = async (username) => {
    try {
        const response = await apiClient.get(`posts/${username}`);
        return response.data.data;
    } catch (error) {
        throw (
            error.response?.data?.error ||
            `An error occurred while attempting to toggle follow ${username}`
        );
    }
};

export const createPost = async (postData) => {
    const formData = new FormData();
    formData.append("image", postData.image);
    formData.append("content", postData.content);
    try {
        const response = await apiClient.post("create_post/", formData, {
            headers: {
                "Content-Type": "multipart/form-data", 
            },
        });
        return response.data;
    } catch (error) {
        throw (
            error.response?.data?.error ||
            `An error occurred while attempting to post`
        );
    }
};

export const fetchFeed = async (val) => {
    try{
        
        const response  = await apiClient.get(`feed/?page=${val}`)
        return response.data.results
    }catch(error){
        if (error.response.data.detail === "Invalid page."){
            return []
        }
        throw(
            "An error occurred while fetching feed"
        )
    }
}

export const SearchUserApi = async (query) => {
    try {
        const response = await apiClient.get(`search_user/?search=${query}`);
        return response.data;
    } catch (error) {
        throw (
            error.response?.data?.error ||
            `An error occurred while searching for ${query}`
        );
    }
};

export const updateUserData = async (userData) => {
    const formData = new FormData();
    formData.append("avatar", userData.avatar);
    formData.append("bio", userData.bio);
    formData.append("first_name", userData.first_name);
    formData.append("last_name", userData.last_name);

    try{
        const response = await apiClient.patch("edit_profile/", formData, {
            headers: {
                "Content-Type": "multipart/form-data", 
            },
        });
        return response.data
    }catch(error){
        throw (
            error.response?.data?.error ||
            "An error occurred while updating user data"
        );
    }
}


export const getPostById = async (post_id) => {
    try {
        const response = await apiClient.get(`post/${post_id}/`)
        return response.data
    } catch(error){
        throw (
            error.response?.data?.error ||
            "An error occurred while fetching post"
        )
    }
}