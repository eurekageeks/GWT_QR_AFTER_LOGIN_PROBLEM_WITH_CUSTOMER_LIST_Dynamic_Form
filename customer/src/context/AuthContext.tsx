import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios, { AxiosError } from "axios";

type Role = "vendor" | "customer" | "admin";

interface SignupPayload {
  email: string;
  mobile: string;
  password: string;
  role: Role;
}

interface User {
  email: string;
  role: Role;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (data: SignupPayload) => Promise<{ error?: string }>;
  signIn: (
    email: string,
    password: string,
    role: Role
  ) => Promise<{ error?: string; token?: string; user?: User }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "http://localhost:8000/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Load user from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role") as Role | null;

    if (token && email && role) {
      setUser({ email, role, token });
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

  // ✅ SIGNIN (ROLE-BASED)
const signIn = async (email: string, password: string, role: Role) => {
  try {
    const res = await axios.post(`${API_URL}/login`, {
      email,
      password,
      role,
    });

    // Accept flexible backend responses
    const token = res.data?.token || res.data?.access_token;
    const backendRole = res.data?.role || res.data?.user?.role;
    const backendEmail = res.data?.email || res.data?.user?.email || email;

    if (!token || !backendRole) {
      console.error("Invalid login response 👉", res.data);
      return { error: "Invalid login response from server" };
    }

    const loggedInUser: User = {
      email: backendEmail,
      role: backendRole,
      token,
    };

    setUser(loggedInUser);
    localStorage.setItem("token", token);
    localStorage.setItem("email", backendEmail);
    localStorage.setItem("role", backendRole);

    return { user: loggedInUser, token };
  } catch (err: any) {
    return {
      error:
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Login failed",
    };
  }
};

  // 🚪 LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, logout }}>
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
