import { useState, useEffect, FormEvent } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  MenuItem,
  CircularProgress,
  Alert,
  Container,
  InputAdornment,
} from "@mui/material";
import { 
  EmailOutlined, 
  PhoneIphoneOutlined, 
  LockOutlined, 
  WorkOutline 
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../frontend-api/api";

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
  category_id: "",
  category: "",
  sub_category_id: "",
  sub_category: ""
});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  useEffect(() => {
    api.get("/admin/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

 const handleCategoryChange = async (id: string) => {
  try {
    const res = await api.get(`/admin/sub-categories/${id}`);
    setSubCategories(res.data);
  } catch (err) {
    setSubCategories([]);
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

 const payload = {
  role: form.role,
  email: form.email,
  mobile: form.mobile,
  password: form.password,
  category: form.category,
  sub_category: form.sub_category
};

  const result = await signUp(payload);

  if (result?.error) {
    setError(result.error);
    setLoading(false);
    return;
  }

  navigate("/login", { replace: true });
  setLoading(false);
};
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
        padding: 3,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(15px)",
            WebkitBackdropFilter: "blur(15px)",
            borderRadius: "24px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Box textAlign="center" mb={4}>
              <Typography variant="h4" fontWeight="900" gutterBottom sx={{ color: "#2d3436", letterSpacing: "-0.5px" }}>
                Create Account
              </Typography>
              <Typography variant="body2" sx={{ color: "#636e72", fontWeight: 500 }}>
                Join our professional network today
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                
                <TextField
                  select
                  label="I want to join as"
                  fullWidth
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WorkOutline fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={glassInputStyle}
                >
                  <MenuItem value="vendor">Service Provider</MenuItem>
                  <MenuItem value="customer">Customer</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </TextField>

                <TextField
                  label="Email"
                  name="email"
                  fullWidth
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={glassInputStyle}
                />

                <TextField
                  label="Mobile"
                  name="mobile"
                  fullWidth
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIphoneOutlined fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={glassInputStyle}
                />

{form.role === "vendor" && (
  <>
    <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
      <TextField
        select
        label="Category"
        fullWidth
        value={form.category_id}
      onChange={(e) => {
  const value = e.target.value;

  if (value === "not_in_list") {
    setShowCustomCategory(true);
    return;
  }

  const selected = categories.find((c) => c._id === value);
  if (!selected) return;

  setShowCustomCategory(false);

  setForm((prev) => ({
    ...prev,
    category_id: selected._id,
    category: selected.name,
    sub_category_id: "",
    sub_category: ""
  }));

  handleCategoryChange(selected._id);
}}        sx={glassInputStyle}
      >
        {categories.map((c) => (
          <MenuItem key={c._id} value={c._id}>
            {c.name}
          </MenuItem>
        ))}
        <MenuItem value="not_in_list">Not In List</MenuItem>
      </TextField>

      <TextField
        select
        label="Sub Category"
        fullWidth
        value={form.sub_category_id}
        onChange={(e) => {
  const selected = subCategories.find((s) => s._id === e.target.value);
  if (!selected) return;

  setForm((prev) => ({
    ...prev,
    sub_category_id: selected._id,
    sub_category: selected.name
  }));
}}
        sx={glassInputStyle}
      >
        {subCategories.map((s) => (
          <MenuItem key={s._id} value={s._id}>
            {s.name}
          </MenuItem>
        ))}
      </TextField>
    </Box>

    {showCustomCategory && (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="New Category"
          fullWidth
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          sx={glassInputStyle}
        />

        <TextField
          label="New Sub Category"
          fullWidth
          value={newSubCategory}
          onChange={(e) => setNewSubCategory(e.target.value)}
          sx={glassInputStyle}
        />

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1c9c75",
            "&:hover": { backgroundColor: "#168f6b" }
          }}
          onClick={() => {
            if (!newCategory) return;

            const newCat = {
              _id: Date.now().toString(),
              name: newCategory
            };

            const newSub = {
              _id: Date.now().toString() + "sub",
              name: newSubCategory
            };

            setCategories([...categories, newCat]);
            setSubCategories([...subCategories, newSub]);

            setForm({
              ...form,
              category_id: newCat._id,
              sub_category_id: newSub._id
            });

            setNewCategory("");
            setNewSubCategory("");
            setShowCustomCategory(false);
          }}
        >
          Add Category
        </Button>
      </Box>
    )}
  </>
)}

<TextField
                  label="Password"
                  type="password"
                  name="password"
                  fullWidth
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={glassInputStyle}
                />

                <TextField
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  fullWidth
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={glassInputStyle}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 1,
                    py: 1.8,
                    borderRadius: "14px",
                    backgroundColor: "#ef4f5f", // Tomato Color
                    fontSize: "1rem",
                    fontWeight: "bold",
                    textTransform: "none",
                    boxShadow: "0 8px 16px rgba(239, 79, 95, 0.25)",
                    "&:hover": {
                      backgroundColor: "#e03d4e", // Darker Tomato
                      boxShadow: "0 10px 20px rgba(239, 79, 95, 0.35)",
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Complete Registration"}
                </Button>
              </Box>
            </form>

            <Typography textAlign="center" mt={4} color="#636e72" fontWeight={500}>
              Already a member?{" "}
              <Button
                variant="text"
                onClick={() => navigate("/login")}
                sx={{ 
                  fontWeight: "700", 
                  color: "#1c9c75", // Green Color
                  textTransform: "none",
                  "&:hover": { 
                    background: "rgba(28, 156, 117, 0.05)", 
                    textDecoration: "underline" 
                  }
                }}
              >
                Sign In
              </Button>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

const glassInputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    transition: "0.2s ease-in-out",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.6)",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
    }
  }
};