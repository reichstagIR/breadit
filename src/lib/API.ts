// Axios
import axios from "axios";

const API = axios.create({
    baseURL: process.env.VERCEL_URL,
});

export default API;
