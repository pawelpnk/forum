import axios from "axios";

const BASE_URL: string = 'http://localhost:5000';

const req = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
    // validateStatus: () => true
});

export default req;


