import React, { createContext, useContext, useReducer, useEffect, useRef } from "react";
import { authLogin, authRegister } from "../api/endpoints/authApi";
import { isTokenExpired, getTimeUntilExpiry } from "../utils/jwt";
import type {
  AuthContextType,
  AuthState,
  LoginCredentials,
  RegisterData,
  User,
} from "../types/auth";

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string; refreshToken: string } }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "REGISTER_START" }
  | { type: "REGISTER_SUCCESS"; payload: { user: User; token: string; refreshToken: string } }
  | { type: "REGISTER_FAILURE" };

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
    case "REGISTER_START":
      return { ...state, isLoading: true };

    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      };

    case "LOGIN_FAILURE":
    case "REGISTER_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Setup automatic logout timer
  const setupLogoutTimer = (token: string) => {
    // Clear existing timer
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    // Check if token is already expired
    if (isTokenExpired(token)) {
      console.log('Token is already expired, logging out');
      logout();
      return;
    }

    // Get time until expiry and set timer
    const timeUntilExpiry = getTimeUntilExpiry(token);
    console.log(`Token expires in ${Math.floor(timeUntilExpiry / 1000)} seconds`);
    
    logoutTimerRef.current = setTimeout(() => {
      console.log('Token expired, automatically logging out');
      logout();
    }, timeUntilExpiry);
  };

  // Kiểm tra localStorage khi component mount
  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    const savedRefreshToken = localStorage.getItem("refreshToken");
    
    if (savedToken) {
      // Check if token is expired
      if (isTokenExpired(savedToken)) {
        console.log('Saved token is expired, clearing storage');
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return;
      }

      // Create minimal user object for restored session
      const user: User = {
        id: 0,
        username: '', // Will be populated when needed
        email: '',
        name: '',
        phone: '',
        role: 'CUSTOMER' as any,
        status: 'ACTIVE',
      };

      dispatch({ 
        type: "LOGIN_SUCCESS", 
        payload: { 
          user, 
          token: savedToken, 
          refreshToken: savedRefreshToken || "" 
        } 
      });

      // Setup automatic logout
      setupLogoutTimer(savedToken);
    }
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: "LOGIN_START" });

    try {
      // Call real API
      const response = await authLogin(credentials);
      
      // Check if token is valid
      if (isTokenExpired(response.accessToken)) {
        throw new Error('Received expired token');
      }

      // Create minimal user object for state
      const user: User = {
        id: 0, // Will be populated later when needed
        username: credentials.username, // Use the username from login credentials
        email: '',
        name: '',
        phone: '',
        role: 'CUSTOMER' as any, // Default role
        status: 'ACTIVE',
      };

      // Store only tokens, no user data
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken || "");

      dispatch({ 
        type: "LOGIN_SUCCESS", 
        payload: { 
          user, 
          token: response.accessToken, 
          refreshToken: response.refreshToken || "" 
        } 
      });

      // Setup automatic logout based on token expiry
      setupLogoutTimer(response.accessToken);
      
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" });
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    dispatch({ type: "REGISTER_START" });

    try {
      // Call real API
      const response = await authRegister(userData);
      
      // Check if token is valid
      if (isTokenExpired(response.accessToken)) {
        throw new Error('Received expired token');
      }
      
      // Create minimal user object
      const user: User = {
        id: 0,
        username: userData.username,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: 'CUSTOMER' as any,
        status: 'ACTIVE',
      };

      // Store only tokens
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken || "");

      dispatch({ 
        type: "REGISTER_SUCCESS", 
        payload: { 
          user, 
          token: response.accessToken, 
          refreshToken: response.refreshToken || "" 
        } 
      });
    } catch (error) {
      dispatch({ type: "REGISTER_FAILURE" });
      throw error;
    }
  };

  const logout = () => {
    // Clear logout timer
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch({ type: "LOGOUT" });
  };

  const refreshAuth = async () => {
    // TODO: Implement token refresh logic
    console.log("Refresh auth called");
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook để sử dụng AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
