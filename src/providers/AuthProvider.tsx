import { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE_URL } from 'api/config';
import { AdminUser, AuthResponse } from 'types/productTypes';

interface AuthContextType {
  token: string | null;
  user: AdminUser | null;
  isAuthInitialising: boolean;
  isAuthenticated: boolean;
  loginFromResponse: (data: AuthResponse) => void;
  logout: () => void;
}
interface AuthContextProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const AUTH_KEY = 'auth';

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAuthInitialising, setIsAuthInitialising] = useState(true);

  const loginFromResponse = (data: AuthResponse) => {
    setToken(data.token);
    setUser(data.adminUser);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_KEY, JSON.stringify(data.adminUser));
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(AUTH_KEY);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (!res.ok) {
          // no valid refresh token → logged out
          setToken(null);
          setUser(null);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(AUTH_KEY);
          setIsAuthInitialising(false);
          return;
        }

        const data = (await res.json()) as AuthResponse;
        loginFromResponse(data);
      } catch {
        setToken(null);
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(AUTH_KEY);
      } finally {
        setIsAuthInitialising(false);
      }
    };

    void init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthInitialising,
        isAuthenticated: !!token,
        loginFromResponse,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthContextProvider');
  }
  return context;
};

export { AuthContextProvider, useAuth };
