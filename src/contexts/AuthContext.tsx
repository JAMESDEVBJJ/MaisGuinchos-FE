import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type User = {
  id: string;
  role: string;
  isDriver: boolean;
  isClient: boolean;
};

type AuthContextType = {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  function decodeAndSetUser(token: string) {
    const payload = JSON.parse(atob(token.split(".")[1]));

    const role =
      payload["role"] ||
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    const userData = {
      id: payload.sub,
      role: role,
      isDriver: role === "Motorista",
      isClient: role === "Cliente",
    };

    setUser(userData);
  }

  function login(token: string) {
    localStorage.setItem("token", token);
    decodeAndSetUser(token);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      decodeAndSetUser(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
