import { useState, FormEvent } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  MenuItem,
  CircularProgress,
  Divider,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Role = "vendor" | "customer" | "admin";

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !role) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const result = await signIn(email, password, role);

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (!result?.user) {
        setError("Invalid login response");
        return;
      }

      const loggedInRole = result.user.role;

      // ✅ Role-based redirect (MATCHES App.tsx)
      if (loggedInRole === "admin") {
        navigate("/dashboard/admin", { replace: true });
      } else if (loggedInRole === "vendor") {
       navigate("/dashboard/vendor", { replace: true });
      } else if (loggedInRole === "customer") {
        navigate("/dashboard/customer", { replace: true });
      } else {
        setError("Unauthorized role");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
        px: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 3,
          boxShadow: 10,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* HEADER */}
          <Box textAlign="center" mb={3}>
            <LoginIcon sx={{ fontSize: 48, color: "#2e7d32" }} />
            <Typography variant="h5" fontWeight={600}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Login to your account
            </Typography>
          </Box>

          {error && (
            <Typography
              color="error"
              textAlign="center"
              mb={2}
              fontSize={14}
            >
              {error}
            </Typography>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <TextField
              select
              label="Login As"
              fullWidth
              required
              margin="normal"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="vendor">Service Provider</MenuItem>
              <MenuItem value="customer">Customer</MenuItem>
            </TextField>

            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              size="large"
              sx={{ mt: 3, py: 1.2 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <Divider sx={{ my: 3 }} />

          {/* FOOTER */}
          <Typography textAlign="center" fontSize={14}>
            Don’t have an account?{" "}
            <Button variant="text" onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
