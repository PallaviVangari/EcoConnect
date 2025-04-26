import axios from 'axios';
import Config from '../config/config.ts'; // Adjust path if needed

// Create a basic axios instance
export const ApiClient = axios.create({
    baseURL: Config.BASE_API_URL, // Base URL from environment or config
    headers: {
        'Content-Type': 'application/json',
    },
});

