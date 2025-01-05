import axios from "axios";
import {SERVER_URL} from "../constants/constants"
const BASE_URL = `${SERVER_URL}/api`;

export const apiClient = axios.create({
    baseURL: BASE_URL,
});