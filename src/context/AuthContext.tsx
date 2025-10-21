import React, { createContext, useContext, useReducer, useEffect } from "react";
import type {
  AuthContextType,
  AuthState,
  LoginCredentials,
  RegisterData,
  User,
} from "../types/auth";

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "REGISTER_START" }
  | { type: "REGISTER_SUCCESS"; payload: User }
  | { type: "REGISTER_FAILURE" };

const initialState: AuthState = {
  user: null,
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
        user: action.payload,
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

  // Kiểm tra localStorage khi component mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: "LOGIN_START" });

    try {
      // Mock API call - thay thế bằng API thực tế
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data
      const user: User = {
        id: "1",
        email: credentials.email,
        name:
          credentials.email === "admin@example.com"
            ? "Admin User"
            : "Regular User",
        role: credentials.email === "admin@example.com" ? "admin" : "user",
        createdAt: new Date(),
      };

      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" });
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    dispatch({ type: "REGISTER_START" });

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const email = userData.email || `${userData.phone}@wanderoo.vn`;

      const user: User = {
        id: Date.now().toString(),
        email,
        name: userData.name,
        role: "user",
        createdAt: new Date(),
      };

      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "REGISTER_SUCCESS", payload: user });
    } catch (error) {
      dispatch({ type: "REGISTER_FAILURE" });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
