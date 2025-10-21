// src/app/providers/AuthProvider.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { getToken, setToken, clearToken } from "../../utils/storage";
import { authMe } from "../../services/auth.api";

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
    try {
      const me = await authMe(); // trả về { role: 'ADMIN' | 'USER', ... }
      setState({ loading: false, isAuth: true, role: me.role, user: me });
    } catch {
      clearToken();
      setState({ loading: false, isAuth: false });
    }
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
