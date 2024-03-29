// Axios
import axios from "axios";

const  API = axios.create({
    baseURL: "https://breadit-clone.netlify.app/",
});

export default API;