import { create } from 'zustand';
import { auth } from '../lib/api';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = await auth.login(email, password);
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      set({ token, user: decoded, isAuthenticated: true, isLoading: false, error: null });
    } catch (error: any) {
      set({ 
        error: error.message,
        isLoading: false,
        token: null,
        user: null,
        isAuthenticated: false
      });
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = await auth.register({ name, email, password });
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      set({ token, user: decoded, isAuthenticated: true, isLoading: false, error: null });
    } catch (error: any) {
      set({ 
        error: error.message,
        isLoading: false,
        token: null,
        user: null,
        isAuthenticated: false
      });
    }
  },

  logout: () => {
    auth.logout();
    set({ token: null, user: null, isAuthenticated: false, error: null });
  },
}));