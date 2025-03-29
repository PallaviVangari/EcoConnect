import axios from 'axios';
import type { User, MarketplaceItem } from '../types';
import { Config } from '../config/config';

const API_URL = 'http://localhost';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Enable sending cookies if needed
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add CORS headers
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    config.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle CORS and other errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.statusText;
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received (CORS issue)
      throw new Error('Unable to connect to the server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error('An error occurred. Please try again.');
    }
  }
);

// Auth API
export const auth = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};

// User API
export const users = {
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch profile';
      throw new Error(message);
    }
  },
  updateProfile: async (userData: Partial<User>) => {
    try {
      const response = await api.put('/users/profile', userData);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile';
      throw new Error(message);
    }
  },
  getUser: async (userId: string) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch user';
      throw new Error(message);
    }
  },
  followUser: async (userId: string) => {
    try {
      const response = await api.post(Config.USER_SERVICE_URL+`/${userId}/follow`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to follow user';
      throw new Error(message);
    }
  },
  unfollowUser: async (userId: string) => {
    try {
      const response = await api.post(Config.USER_SERVICE_URL+`/${userId}/unfollow`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to unfollow user';
      throw new Error(message);
    }
  },
};

// Posts API
export const posts = {
  getPosts: async () => {
    try {
      const response = await api.get(Config.POST_SERVICE_URL+'/getAllPostsposts');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch posts';
      throw new Error(message);
    }
  },
  createPost: async (postData: {
    content: string;
    media?: string[];
    tags?: string[];
  }) => {
    try {
      const response = await api.post(Config.POST_SERVICE_URL+'/createPost', postData);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create post';
      throw new Error(message);
    }
  },
  likePost: async (postId: string) => {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to like post';
      throw new Error(message);
    }
  },
  unlikePost: async (postId: string) => {
    try {
      const response = await api.post(`/posts/${postId}/unlike`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to unlike post';
      throw new Error(message);
    }
  },
  commentOnPost: async (postId: string, content: string) => {
    try {
      const response = await api.post(`/posts/${postId}/comments`, { content });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to comment on post';
      throw new Error(message);
    }
  },
};

// Events API
export const events = {
  getEvents: async () => {
    try {
      const response = await api.get('/events');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch events';
      throw new Error(message);
    }
  },
  createEvent: async (eventData: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: string;
    maxAttendees?: number;
  }) => {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create event';
      throw new Error(message);
    }
  },
  registerForEvent: async (eventId: string) => {
    try {
      const response = await api.post(`/events/${eventId}/register`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to register for event';
      throw new Error(message);
    }
  },
  unregisterFromEvent: async (eventId: string) => {
    try {
      const response = await api.post(`/events/${eventId}/unregister`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to unregister from event';
      throw new Error(message);
    }
  },
};

// Marketplace API
export const marketplace = {
  getItems: async () => {
    try {
      const response = await api.get('/marketplace');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch marketplace items';
      throw new Error(message);
    }
  },
  createItem: async (itemData: {
    title: string;
    description: string;
    price: number;
    category: string;
    condition: string;
    images?: string[];
    tags?: string[];
  }) => {
    try {
      const response = await api.post('/marketplace', itemData);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create marketplace item';
      throw new Error(message);
    }
  },
  updateItem: async (itemId: string, itemData: Partial<MarketplaceItem>) => {
    try {
      const response = await api.put(`/marketplace/${itemId}`, itemData);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update marketplace item';
      throw new Error(message);
    }
  },
  deleteItem: async (itemId: string) => {
    try {
      const response = await api.delete(`/marketplace/${itemId}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete marketplace item';
      throw new Error(message);
    }
  },
};

// Messages API
export const messages = {
  getConversations: async () => {
    try {
      const response = await api.get('/messages');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch conversations';
      throw new Error(message);
    }
  },
  getMessages: async (conversationId: string) => {
    try {
      const response = await api.get(`/messages/${conversationId}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch messages';
      throw new Error(message);
    }
  },
  sendMessage: async (recipientId: string, content: string) => {
    try {
      const response = await api.post('/messages', { recipientId, content });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send message';
      throw new Error(message);
    }
  },
};

export default api;