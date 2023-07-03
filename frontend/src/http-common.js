import axios from "axios";

export default axios.create({
    baseURL: `${process.env.PUBLIC_URL}/api/`,
    headers: {
        "Content-Type": "application/json"
    }
});