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
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Role = "vendor" | "customer" | "admin";

export default function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [form, setForm] = useState({
    role: "vendor" as Role,
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const result = await signUp(form);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    navigate("/login", { replace: true });
    setLoading(false);
  };

  return (
    <Box className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <Card sx={{ maxWidth: 450, width: "100%", boxShadow: 6 }}>
        <CardContent className="p-4">
          <Box textAlign="center" mb={3}>
            <PersonAddIcon color="success" sx={{ fontSize: 50 }} />
            <Typography variant="h5" fontWeight="bold">
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join us today
            </Typography>
          </Box>

          {error && (
            <div className="alert alert-danger py-2">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              select
              label="Signup As"
              fullWidth
              margin="normal"
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as Role })
              }
            >
              <MenuItem value="vendor">Vendor</MenuItem>
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>

            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="normal"
              onChange={handleChange}
            />

            <TextField
              label="Mobile"
              name="mobile"
              fullWidth
              margin="normal"
              onChange={handleChange}
            />

            <TextField
              label="Password"
              type="password"
              name="password"
              fullWidth
              margin="normal"
              onChange={handleChange}
            />

            <TextField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              fullWidth
              margin="normal"
              onChange={handleChange}
            />

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Sign Up"}
            </Button>
          </form>

          <Typography textAlign="center" mt={3}>
            Already have an account?{" "}
            <Button
              variant="text"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
