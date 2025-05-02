import { useQueryClient } from "@tanstack/react-query";
import { useVerifyAdminUser } from "hooks/AuthHooks/AuthHooks";
import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthResponse } from "types/productTypes";

interface AuthContextType {
  setToken: (token: string | null) => void;
  authData?: AuthResponse;
}
interface AuthContextProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const location = useLocation();
  const queryClient = useQueryClient();

  const [jwt, setJwt] = useState<string | null>(() => localStorage.getItem("jwt"));
  const { authData, isAuthDataLoading } = useVerifyAdminUser({ jwt });

  const setToken = (token: string | null) => {
    setJwt(token);
    if (token) {
      localStorage.setItem("jwt", token);
    }
    else {
      localStorage.removeItem("jwt");
    }
  }

  useEffect(() => {
    if (!jwt) {
      queryClient.removeQueries({ queryKey: ["verifyAdminUser"] });
    }
  }, [jwt])

  if (location.pathname !== "/login" && !authData && !isAuthDataLoading) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if ((location.pathname !== "/" && location.pathname !== "/login") && !authData?.adminUser.verified) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <AuthContext.Provider
      value={{
        setToken,
        authData,
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