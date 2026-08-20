"use client";

import { createContext, useContext, useEffect, useState, type ReactNode, type ContextType } from "react";
import { api, apiEndpoints } from "@/lib/api/axios";
import { config } from "@/lib/config";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "owner" | "admin" | "member" | "viewer";
  workspaceId: string;
  workspaceName: string;
  permissions: string[];
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  register: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string, confirmPassword: string) => Promise<void>;
  verifyOtp: (email: string, otp: string, type: "email_verification" | "password_reset" | "2fa") => Promise<void>;
  resendOtp: (email: string, type: "email_verification" | "password_reset" | "2fa") => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

export interface SignupData {
  email: string;
  password: string;
  confirmPassword?: string;
  name: string;
  workspaceName: string;
  termsAccepted?: boolean;
}

export type RegisterData = SignupData;

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const clearError = () => setState((prev) => ({ ...prev, error: null }));

  const setAuth = (user: User | null) => {
    setState({
      user,
      isLoading: false,
      isAuthenticated: !!user,
      error: null,
    });
  };

  const refreshUser = async () => {
    try {
      const response = await api.get(apiEndpoints.auth.me);
      if (response.data.success && response.data.data) {
        setAuth(response.data.data);
        localStorage.setItem(config.auth.userKey, JSON.stringify(response.data.data));
      } else {
        setAuth(null);
      }
    } catch {
      setAuth(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(config.auth.tokenKey);
      const storedUser = localStorage.getItem(config.auth.userKey);

      if (token && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setAuth(user);
          await refreshUser();
        } catch {
          localStorage.removeItem(config.auth.tokenKey);
          localStorage.removeItem(config.auth.refreshTokenKey);
          localStorage.removeItem(config.auth.userKey);
          setAuth(null);
        }
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await api.post(apiEndpoints.auth.login, { email, password, rememberMe });
      if (response.data.success && response.data.data) {
        const { user, accessToken, refreshToken } = response.data.data;
        localStorage.setItem(config.auth.tokenKey, accessToken);
        localStorage.setItem(config.auth.refreshTokenKey, refreshToken);
        localStorage.setItem(config.auth.userKey, JSON.stringify(user));
        setAuth(user);
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await api.post(apiEndpoints.auth.signup, data);
      if (response.data.success && response.data.data) {
        const { user, accessToken, refreshToken } = response.data.data;
        localStorage.setItem(config.auth.tokenKey, accessToken);
        localStorage.setItem(config.auth.refreshTokenKey, refreshToken);
        localStorage.setItem(config.auth.userKey, JSON.stringify(user));
        setAuth(user);
      } else {
        throw new Error(response.data.message || "Signup failed");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed";
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw error;
    }
  };

  const logout = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await api.post(apiEndpoints.auth.logout);
    } catch {
    } finally {
      localStorage.removeItem(config.auth.tokenKey);
      localStorage.removeItem(config.auth.refreshTokenKey);
      localStorage.removeItem(config.auth.userKey);
      setAuth(null);
    }
  };

  const forgotPassword = async (email: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await api.post(apiEndpoints.auth.forgotPassword, { email });
      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send reset email";
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string, confirmPassword: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await api.post(apiEndpoints.auth.resetPassword, { token, password, confirmPassword });
      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Password reset failed";
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw error;
    }
  };

  const verifyOtp = async (email: string, otp: string, type: "email_verification" | "password_reset" | "2fa") => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await api.post(apiEndpoints.auth.verifyOtp, { email, otp, type });
      if (response.data.success && response.data.data) {
        const { user, accessToken, refreshToken } = response.data.data;
        localStorage.setItem(config.auth.tokenKey, accessToken);
        localStorage.setItem(config.auth.refreshTokenKey, refreshToken);
        localStorage.setItem(config.auth.userKey, JSON.stringify(user));
        setAuth(user);
      } else {
        throw new Error(response.data.message || "OTP verification failed");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "OTP verification failed";
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw error;
    }
  };

  const resendOtp = async (email: string, type: "email_verification" | "password_reset" | "2fa") => {
    try {
      await api.post(apiEndpoints.auth.resendOtp, { email, type });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to resend OTP";
      setState((prev) => ({ ...prev, error: message }));
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await api.put(apiEndpoints.user.update, data);
      if (response.data.success && response.data.data) {
        const updatedUser = { ...state.user, ...response.data.data } as User;
        localStorage.setItem(config.auth.userKey, JSON.stringify(updatedUser));
        setAuth(updatedUser);
      } else {
        throw new Error(response.data.message || "Profile update failed");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Profile update failed";
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        register: signup,
        logout,
        forgotPassword,
        resetPassword,
        verifyOtp,
        resendOtp,
        updateProfile,
        clearError,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}