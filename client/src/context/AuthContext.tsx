import { jwtDecode } from "jwt-decode";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  role: string;
}

interface DecodedToken {
  id: string;
  role: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: { email: string; role: string }) => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    if (token && email && role) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUser({
          id: decoded.id,
          email: email,
          role: role,
        });
      } catch (error) {
        console.error("Failed to decode token:", error);
        // Clear invalid data
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
      }
    }
  }, []);

  const login = (token: string, userData: { email: string; role: string }) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);

      const newUser: User = {
        id: decoded.id,
        email: userData.email,
        role: userData.role,
      };

      setUser(newUser);
      localStorage.setItem("token", token);
      localStorage.setItem("email", userData.email);
      localStorage.setItem("role", userData.role);
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
