import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {

}
interface AuthContextProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [jwt, setJwt] = useState<string | null>(null);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    setJwt(jwt);
  }, [])
  return (
    <AuthContext.Provider
      value={{}}
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