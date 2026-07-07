import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { setAuthToken } from "@/services/api/client";
import { login as apiLogin, signup as apiSignup } from "@/services/api/auth";
import { clearSession, getToken, getUser, saveToken, saveUser } from "@/utils/storage";

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

type AuthContextValue = AuthState & AuthActions;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    (async () => {
      try {
        const [savedToken, savedUser] = await Promise.all([
          getToken(),
          getUser<AuthUser>(),
        ]);
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(savedUser);
          setAuthToken(savedToken);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    await Promise.all([saveToken(data.token), saveUser(data.user)]);
    setToken(data.token);
    setUser(data.user);
    setAuthToken(data.token);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const data = await apiSignup(name, email, password);
    await Promise.all([saveToken(data.token), saveUser(data.user)]);
    setToken(data.token);
    setUser(data.user);
    setAuthToken(data.token);
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setToken(null);
    setUser(null);
    setAuthToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
