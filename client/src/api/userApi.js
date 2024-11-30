import axios from "axios"

const BASE_URL = "/api"

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

export const fetchUserProfile = async ( username ) => {
    try{

        const response = await api.get(`user/${username}`)
        return response.data
    }catch(error){
        throw (error.response?.data?.error || "An error occurred while fetching user data")
    }

}




