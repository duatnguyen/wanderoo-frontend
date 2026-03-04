// src/app/providers/AuthProvider.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { getToken, setToken, clearToken } from "../../utils/storage";
import { getUserFromToken, isTokenExpired } from "../../utils/jwt";

type Role = "USER" | "ADMIN";
type AuthState = { loading: boolean; isAuth: boolean; role?: Role; user?: any };

const AuthCtx = createContext<{
  state: AuthState;
  login: (token: string) => Promise<void>;
  logout: () => void;
}>({
  state: { loading: true, isAuth: false },
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    loading: true,
    isAuth: false,
  });

  const bootstrap = async () => {
    const token = getToken();
    if (!token) return setState({ loading: false, isAuth: false });

    // Check if token is expired
    if (isTokenExpired(token)) {
      clearToken();
      return setState({ loading: false, isAuth: false });
    }

    // Decode token to get user info
    const userFromToken = getUserFromToken(token);
    if (!userFromToken) {
      clearToken();
      return setState({ loading: false, isAuth: false });
    }

    // Set user info from token
    setState({
      loading: false,
      isAuth: true,
      role: userFromToken.role as Role,
      user: {
        id: parseInt(userFromToken.id) || 0,
        username: userFromToken.username,
        role: userFromToken.role as Role,
      },
    });
  };

  useEffect(() => {
    bootstrap();
  }, []);

  const login = async (token: string) => {
    setToken(token);
    await bootstrap();
  };

  const logout = () => {
    clearToken();
    setState({ loading: false, isAuth: false });
  };

  return (
    <AuthCtx.Provider value={{ state, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuthCtx = () => useContext(AuthCtx);
