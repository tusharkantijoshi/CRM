/* eslint-disable react-refresh/only-export-components */
import { jwtDecode } from "jwt-decode";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
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
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    if (token && email && role) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        return {
          id: decoded.id,
          email: email,
          role: role,
        };
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
      }
    }
    return null;
  });

  const login = useCallback(
    (token: string, userData: { email: string; role: string }) => {
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
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
  }, []);

  const isAdmin = user?.role === "admin";

  const value = useMemo(
    () => ({ user, login, logout, isAdmin }),
    [user, login, logout, isAdmin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
