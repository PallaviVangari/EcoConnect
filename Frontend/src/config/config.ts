const Config = {
    BASE_API_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8088', //  fallback to localhost for dev
    CHATBOT_API_URL: import.meta.env.VITE_CHATBOT_API_URL || 'http://127.0.0.1:5000', // chatbot separate
};

export default Config;
