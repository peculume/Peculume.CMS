import { useVerifyAdminUser } from "hooks/AuthHooks/AuthHooks";
import { createContext, useContext, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthResponse } from "types/productTypes";

interface AuthContextType {
  setToken: (token: string) => void;
  authData?: AuthResponse;
}
interface AuthContextProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const location = useLocation();

  const [jwt, setJwt] = useState<string | null>(() => localStorage.getItem("jwt"));
  const { authData, isAuthDataLoading } = useVerifyAdminUser({ jwt });
  console.log(authData);

  const setToken = (token: string) => {
    setJwt(token);
    localStorage.setItem("jwt", token);
  }

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