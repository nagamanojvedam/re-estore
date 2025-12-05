'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import authService from '@/lib/services/authService';

// Types
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

export interface Tokens {
  access: { token: string };
  refresh: { token: string };
}

export interface AuthResponse {
  user: AuthUser;
  tokens: Tokens;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Context State
interface AuthContextState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string>;
  updateUser: (user: AuthUser) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextState | null>(null);

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Reducer Actions
type Action =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: AuthResponse }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: AuthUser };

function authReducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.tokens.access.token,
        refreshToken: action.payload.tokens.refresh.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'UPDATE_USER':
      return { ...state, user: action.payload };

    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Auto-login if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        dispatch({ type: 'AUTH_START' });
        const user = await authService.getCurrentUser();

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user,
            tokens: {
              access: { token },
              refresh: { token: refreshToken || '' },
            },
          },
        });
      } catch (err: unknown) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        dispatch({
          type: 'AUTH_ERROR',
          payload: err instanceof Error ? err.message : 'Auth failed',
        });
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.login(credentials);

      localStorage.setItem('token', response.tokens.access.token);
      localStorage.setItem('refreshToken', response.tokens.refresh.token);

      dispatch({ type: 'AUTH_SUCCESS', payload: response });

      toast.success(`Welcome back, ${response.user.name}!`);
      return response;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: msg });
      toast.error(msg);
      throw err;
    }
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.register(data);

      localStorage.setItem('token', response.tokens.access.token);
      localStorage.setItem('refreshToken', response.tokens.refresh.token);

      dispatch({ type: 'AUTH_SUCCESS', payload: response });

      toast.success(`Welcome, ${response.user.name}!`);
      return response;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Register failed';
      dispatch({ type: 'AUTH_ERROR', payload: msg });
      toast.error(msg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) await authService.logout({ refreshToken });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
    }
  };

  const refreshAccessToken = async (): Promise<string> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await authService.refreshToken({ refreshToken });

      localStorage.setItem('token', response.tokens.access.token);
      localStorage.setItem('refreshToken', response.tokens.refresh.token);

      return response.tokens.access.token;
    } catch (err) {
      logout();
      throw err;
    }
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  const updateUser = (user: AuthUser) => dispatch({ type: 'UPDATE_USER', payload: user });

  const value: AuthContextState = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    refreshAccessToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
