import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios, { AxiosError } from "axios";

type Role = "vendor" | "customer" | "admin";

interface SignupPayload {
  email: string;
  mobile: string;
  password: string;
  role: Role;
}

// Include extra fields for vendor/admin if needed
interface User {
  email: string;
  role: Role;
  token: string;
  vendor_name?: string;
  vendor_id?: string;

  // ✅ ADD THESE
  category?: string;
  sub_category?: string;
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
 
  
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const restoredUser: User = JSON.parse(savedUser);
      setUser(restoredUser);
      axios.defaults.headers.common["Authorization"] = `Bearer ${restoredUser.token}`;
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

      const token =
        res.data.token ||
        res.data.access_token ||
        res.data.data?.token;

      const backendRole =
        res.data.role ||
        res.data.user?.role ||
        res.data.data?.role;

      const backendEmail =
        res.data.email ||
        res.data.user?.email ||
        res.data.data?.email;
      const backendCategory =
       res.data.category ||
       res.data.user?.category ||
       res.data.data?.category;

      const backendSubCategory =
       res.data.sub_category ||
       res.data.user?.sub_category ||
       res.data.data?.sub_category;
      if (!token || !backendRole || !backendEmail) {
        return { error: "Invalid login response from server" };
      }
     
      // Include additional vendor info if provided by backend
    const loggedInUser: User = {
  email: backendEmail,
  role: backendRole,
  token,

  ...(res.data.vendor_name && { vendor_name: res.data.vendor_name }),
  ...(res.data.vendor_id && { vendor_id: res.data.vendor_id }),

  // ✅ FROM BACKEND (NO HARDCODE)
  category: backendCategory,
  sub_category: backendSubCategory,
};

      setUser(loggedInUser);

localStorage.setItem("user", JSON.stringify(loggedInUser));
localStorage.setItem("token", token);
localStorage.setItem("role", backendRole);

axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
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

  // 🚪 LOGOUT (SAFE)
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
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
