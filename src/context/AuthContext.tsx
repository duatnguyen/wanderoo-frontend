import React, { createContext, useContext, useReducer, useEffect, useRef } from "react";
import { authLogin, authRegister } from "../api/endpoints/authApi";
import { isTokenExpired, getTimeUntilExpiry, getUserFromToken } from "../utils/jwt";
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
  | { type: "REGISTER_FAILURE" }
  | { type: "AUTH_CHECK_COMPLETE" };

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to prevent premature redirects
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

    case "AUTH_CHECK_COMPLETE":
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
};

const USER_STORAGE_KEY = "wanderoo_user";

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
      logout();
      return;
    }

    // Get time until expiry and set timer
    const timeUntilExpiry = getTimeUntilExpiry(token);
    
    logoutTimerRef.current = setTimeout(() => {
      logout();
    }, timeUntilExpiry);
  };

  // Kiểm tra localStorage khi component mount
  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    const savedRefreshToken = localStorage.getItem("refreshToken");
    // Ensure we never persist decoded user info in localStorage
    localStorage.removeItem(USER_STORAGE_KEY);
    
    if (savedToken) {
      // Check if token is expired
      if (isTokenExpired(savedToken)) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch({ type: "AUTH_CHECK_COMPLETE" });
        return;
      }

      // Get user info from token
      const tokenUser = getUserFromToken(savedToken);
      if (!tokenUser) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch({ type: "AUTH_CHECK_COMPLETE" });
        return;
      }

      // Create user object from token data
      const user: User = {
        id: parseInt(tokenUser.id) || 0,
        username: tokenUser.username,
        email: '',
        name: '',
        phone: '',
        role: tokenUser.role as any,
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
    } else {
      // No saved token, auth check complete
      dispatch({ type: "AUTH_CHECK_COMPLETE" });
    }
  }, []);  // Cleanup timer on unmount
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

      // Get user info from token
      const tokenUser = getUserFromToken(response.accessToken);
      if (!tokenUser) {
        throw new Error('Could not decode user from token');
      }

      // Create user object from token data
      const user: User = {
        id: parseInt(tokenUser.id) || 0,
        username: tokenUser.username,
        email: '',
        name: '',
        phone: '',
        role: tokenUser.role as any,
        status: 'ACTIVE',
      };

      // Store only tokens, no user data
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken || "");
      // Explicitly avoid storing decoded user info in localStorage
      localStorage.removeItem(USER_STORAGE_KEY);

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
      
      // Get user info from token
      const tokenUser = getUserFromToken(response.accessToken);
      if (!tokenUser) {
        throw new Error('Could not decode user from token');
      }

      // Create user object from token data
      const user: User = {
        id: parseInt(tokenUser.id) || 0,
        username: tokenUser.username,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: tokenUser.role as any,
        status: 'ACTIVE',
      };

      // Store only tokens
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken || "");
      localStorage.removeItem(USER_STORAGE_KEY);

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
    localStorage.removeItem(USER_STORAGE_KEY);
    dispatch({ type: "LOGOUT" });
  };

  const refreshAuth = async () => {
    // TODO: Implement token refresh logic
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
