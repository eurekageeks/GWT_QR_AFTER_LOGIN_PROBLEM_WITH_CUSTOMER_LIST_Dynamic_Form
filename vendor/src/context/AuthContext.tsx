import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios, { AxiosError } from "axios";

type Role = "vendor" | "customer" | "admin";

interface SignupPayload {
  email: string;
  mobile: string;
  password: string;
  role: Role;
}

export interface User {
  email: string;
  role: Role;
  token: string;
  vendor_id?: number;
  vendor_name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (data: SignupPayload) => Promise<{ error?: string }>;
  signIn: (
    email: string,
    password: string,
    role: Role
  ) => Promise<{ error?: string; user?: User }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "http://localhost:8000/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ RESTORE USER ON APP LOAD / ROUTE CHANGE
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // ✅ SIGNUP
  const signUp = async (data: SignupPayload) => {
    try {
      await axios.post(`${API_URL}/signup`, data);
      return {};
    } catch (err) {
      const error = err as AxiosError<any>;
      return {
        error: error.response?.data?.detail || "Signup failed",
      };
    }
  };

  // ✅ SIGNIN (ROLE SAFE)
  const signIn = async (email: string, password: string, role: Role) => {
    try {
      const res = await axios.post(`${API_URL}/login`, {
        email,
        password,
        role,
      });

      const token =
        res.data.token ||
        res.data.access_token ||
        res.data.data?.token;

      const userData =
        res.data.user ||
        res.data.data ||
        {
          email,
          role,
        };

      if (!token) {
        return { error: "Invalid login response from server" };
      }

      const loggedInUser: User = {
        ...userData,
        token,
      };

      // ✅ SINGLE SOURCE OF TRUTH
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);

      return { user: loggedInUser };
    } catch (err: any) {
      return {
        error:
          err.response?.data?.detail ||
          err.response?.data?.message ||
          "Login failed",
      };
    }
  };

  // 🚪 LOGOUT (SAFE)
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, logout }}>
      {!loading && children}
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
