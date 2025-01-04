const BASE_URL = "/api";

const fetchRequest = async (url, options = {}) => {
    const defaultOptions = {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
        const response = await fetch(`${BASE_URL}${url}`, finalOptions);
        if (!response.ok) {
            const errorData = await response.json();
            throw errorData;
        }
        return response.json();
    } catch (error) {
        throw error;
    }
};

export const fetchUserProfile = async (username) => {
    try {
        return await fetchRequest(`/user/${username}/`);
    } catch (error) {
        throw error?.error || "An error occurred while fetching user data";
    }
};

export const signInApi = async (username, password) => {
    try {
        return await fetchRequest("/token/", {
            method: "POST",
            body: JSON.stringify({ username, password }),
        });
    } catch (error) {
        if (error.status === 401) {
            return { success: false, message: "Invalid username or password" };
        }
        throw error;
    }
};

export const signUpApi = async (userData) => {
    try {
        const response = await fetchRequest("/register/", {
            method: "POST",
            body: JSON.stringify(userData),
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const signOutApi = async () => {
    try {
        return await fetchRequest("/logout/");
    } catch (error) {
        throw error?.error || "An error occurred while logging out";
    }
};

export const getAuth = async () => {
    try {
        return await fetchRequest("/auth/status/");
    } catch (error) {
        throw error?.error || "An error occurred while authenticating";
    }
};

export const toggleFollow = async (username) => {
    try {
        return await fetchRequest(`/toggle_follow/${username}/`, {
            method: "POST",
        });
    } catch (error) {
        throw error?.error || `An error occurred while attempting to toggle follow ${username}`;
    }
};

export const toggleLike = async (post_id) => {
    try {
        return await fetchRequest(`/toggle_like_post/${post_id}/`, {
            method: "POST",
        });
    } catch (error) {
        throw error?.error || `An error occurred while attempting to toggle like ${post_id}`;
    }
};

export const getUserPosts = async (username) => {
    try {
        return (await fetchRequest(`/posts/${username}`)).data;
    } catch (error) {
        throw error?.error || `An error occurred while fetching posts for ${username}`;
    }
};

export const createPost = async (postData) => {
    const formData = new FormData();
    formData.append("image", postData.image);
    formData.append("content", postData.content);

    try {
        const response = await fetch(`${BASE_URL}/create_post/`, {
            method: "POST",
            body: formData,
            credentials: "include",
        });
        if (!response.ok) {
            const error = await response.json();
            throw error;
        }
        return response.json();
    } catch (error) {
        throw error?.error || "An error occurred while creating the post";
    }
};

export const fetchFeed = async (val) => {
    try {
        const response = await fetchRequest(`/feed/?page=${val}`);
        return response.results;
    } catch (error) {
        if (error.detail === "Invalid page.") {
            return [];
        }
        throw "An error occurred while fetching feed";
    }
};

export const SearchUserApi = async (query) => {
    try {
        return await fetchRequest(`/search_user/?search=${query}`);
    } catch (error) {
        throw error?.error || `An error occurred while searching for ${query}`;
    }
};

export const updateUserData = async (userData) => {
    const formData = new FormData();
    formData.append("avatar", userData.avatar);
    formData.append("bio", userData.bio);
    formData.append("first_name", userData.first_name);
    formData.append("last_name", userData.last_name);

    try {
        const response = await fetch(`${BASE_URL}/edit_profile/`, {
            method: "PATCH",
            body: formData,
            credentials: "include",
        });
        if (!response.ok) {
            const error = await response.json();
            throw error;
        }
        return response.json();
    } catch (error) {
        throw error?.error || "An error occurred while updating user data";
    }
};

export const singlePost = async (post_id) => {
    try {
        return await fetchRequest(`/post/${post_id}`);
    } catch (error) {
        throw error?.error || "An error occurred while fetching post";
    }
};
