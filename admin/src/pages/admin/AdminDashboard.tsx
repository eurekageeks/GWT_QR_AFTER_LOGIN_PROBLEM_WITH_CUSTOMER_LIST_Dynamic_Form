'use client';
import * as React from 'react';
import api from '../../../../admin_panel/src/lib/api';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
  MenuItem,
  Chip,
  Stack,
} from '@mui/material';

interface Category { _id: string; name: string; }
interface Food { _id: string; name: string; price: string; category: { _id: string; name: string }; image?: string; }
interface FoodInput { category: string; name: string; price: string; image?: string; file?: File | null; }

export default function FoodCategoryApp() {
  const [tab, setTab] = React.useState(0);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [foodItems, setFoodItems] = React.useState<Food[]>([]);
  const [categoryInputs, setCategoryInputs] = React.useState<string[]>(['']);
  const [foodInputs, setFoodInputs] = React.useState<FoodInput[]>([{ category: '', name: '', price: '', image: '', file: null }]);

  // ------------------- Fetch Data -------------------
  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Fetch categories failed', err);
    }
  };

  const fetchFoods = async () => {
    try {
      const res = await api.get('/foods');
      setFoodItems(res.data);
    } catch (err) {
      console.error('Fetch foods failed', err);
    }
  };

  React.useEffect(() => {
    fetchCategories();
    fetchFoods();
  }, []);

  // ------------------- Category Handlers -------------------
  const handleCategoryChange = (i: number, value: string) => {
    const updated = [...categoryInputs];
    updated[i] = value;
    setCategoryInputs(updated);
  };

  const addCategoryInput = () => {
    if (categoryInputs.length < 10) setCategoryInputs([...categoryInputs, '']);
  };

  const handleAddCategory = async () => {
    const valid = categoryInputs.filter(c => c.trim());
    if (!valid.length) return;
    try {
      await Promise.all(valid.map(name => api.post('/categories', { name })));
      setCategoryInputs(['']);
      fetchCategories();
    } catch (err) {
      console.error('Add category failed', err);
      alert('Failed to add category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
      fetchFoods();
    } catch (err) {
      console.error('Delete category failed', err);
      alert('Delete failed');
    }
  };

  // ------------------- Food Handlers -------------------
  const handleFoodChange = (i: number, field: keyof FoodInput, value: string | File | null) => {
    const updated = [...foodInputs];
    if (field === 'file') updated[i].file = value as File;
    else updated[i][field] = value as string;
    setFoodInputs(updated);
  };

  const addFoodInput = () => {
    if (foodInputs.length < 10) setFoodInputs([...foodInputs, { category: '', name: '', price: '', image: '', file: null }]);
  };

  const handleAddFood = async () => {
    const validFoods = foodInputs.filter(f => f.category && f.name.trim() && f.price.trim());
    if (!validFoods.length) return;

    try {
      // Upload files first
      await Promise.all(validFoods.map(async (food) => {
        if (food.file) {
          const formData = new FormData();
          formData.append('file', food.file);
          const res = await api.post('/upload-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
          food.image = res.data.url;
        }
      }));

      // Add foods to DB
      await Promise.all(validFoods.map(food => api.post('/foods', {
        category: food.category,
        name: food.name,
        price: food.price,
        image: food.image,
      })));

      setFoodInputs([{ category: '', name: '', price: '', image: '', file: null }]);
      fetchFoods();
    } catch (err) {
      console.error('Add food failed', err);
      alert('Failed to add food');
    }
  };

  const handleDeleteFood = async (id: string) => {
    if (!confirm('Delete this food item?')) return;
    try {
      await api.delete(`/foods/${id}`);
      fetchFoods();
    } catch (err) {
      console.error('Delete food failed', err);
      alert('Delete failed');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box mb={5} textAlign="center">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Food Management Dashboard
        </Typography>
        <Typography color="text.secondary" variant="subtitle1">
          Manage categories and food items professionally
        </Typography>
      </Box>

      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} indicatorColor="primary" textColor="primary" centered>
          <Tab label="Add Category" />
          <Tab label="Add Food Item" />
        </Tabs>
      </Card>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              {tab === 0 ? (
                <>
                  <Typography variant="h6" fontWeight="bold" mb={3}>Create Categories</Typography>
                  <Stack spacing={2}>
                    {categoryInputs.map((val, i) => (
                      <Box key={i} display="flex" gap={1}>
                        <TextField label="Category Name" fullWidth value={val} onChange={(e) => handleCategoryChange(i, e.target.value)} />
                        {i === categoryInputs.length - 1 && (
                          <Button
                            sx={{ px: 2, background: 'linear-gradient(45deg, #FF6B6B, #FFD93D)', color: '#fff', fontWeight: 'bold', '&:hover': { background: 'linear-gradient(45deg, #FF4B4B, #FFC93D)' } }}
                            onClick={addCategoryInput}>+</Button>
                        )}
                      </Box>
                    ))}
                  </Stack>
                  <Button fullWidth sx={{ mt: 4, background: 'linear-gradient(45deg, #6A82FB, #FC5C7D)', color: '#fff', fontWeight: 'bold', '&:hover': { background: 'linear-gradient(45deg, #5A6FDB, #FC3C5C)' } }} onClick={handleAddCategory}>Add Category</Button>
                </>
              ) : (
                <>
                  <Typography variant="h6" fontWeight="bold" mb={3}>Add Food Items</Typography>
                  <Stack spacing={3}>
                    {foodInputs.map((food, i) => (
                      <Card key={i} sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
                        <TextField select fullWidth label="Category" value={food.category} onChange={(e) => handleFoodChange(i, 'category', e.target.value)} sx={{ mb: 2 }}>
                          {categories.map((c) => (<MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>))}
                        </TextField>
                        <TextField fullWidth label="Food Name" value={food.name} onChange={(e) => handleFoodChange(i, 'name', e.target.value)} sx={{ mb: 2 }} />
                        <TextField fullWidth label="Price" value={food.price} onChange={(e) => handleFoodChange(i, 'price', e.target.value)} sx={{ mb: 2 }} />
                        <Button variant="contained" component="label" sx={{ mb: 2 }}>
                          Upload Image
                          <input type="file" hidden accept="image/*" onChange={(e) => handleFoodChange(i, 'file', e.target.files?.[0] || null)} />
                        </Button>
                        {food.file && <Typography variant="body2" color="text.secondary">{food.file.name}</Typography>}
                      </Card>
                    ))}
                  </Stack>

                  <Box display="flex" gap={2} mt={3}>
                    <Button sx={{ px: 3, background: 'linear-gradient(45deg, #FFD93D, #FF6B6B)', color: '#fff', fontWeight: 'bold', '&:hover': { background: 'linear-gradient(45deg, #FFC93D, #FF4B4B)' } }} onClick={addFoodInput}>Add More</Button>
                    <Button sx={{ px: 3, background: 'linear-gradient(45deg, #00F260, #0575E6)', color: '#fff', fontWeight: 'bold', '&:hover': { background: 'linear-gradient(45deg, #00E050, #0465D6)' } }} onClick={handleAddFood}>Add Food</Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Preview */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              {tab === 0 ? (
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {categories.map((cat) => (
                    <Chip key={cat._id} label={cat.name} color="primary" onDelete={() => handleDeleteCategory(cat._id)} sx={{ mb: 1 }} />
                  ))}
                </Stack>
              ) : (
                <Stack spacing={2}>
                  {foodItems.map((f) => (
                    <Card key={f._id} sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', borderRadius: 2, boxShadow: 1 }}>
                      {f.image && <img src={f.image} alt={f.name} width={60} height={60} style={{ borderRadius: 8, objectFit: 'cover' }} />}
                      <Box flex={1}>
                        <Typography fontWeight="bold">{f.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{f.category.name} • ₹{f.price}</Typography>
                      </Box>
                      <Button sx={{ px: 2, background: 'linear-gradient(45deg, #FF416C, #FF4B2B)', color: '#fff', fontWeight: 'bold', '&:hover': { background: 'linear-gradient(45deg, #FF214C, #FF2B1B)' } }} onClick={() => handleDeleteFood(f._id)}>Delete</Button>
                    </Card>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
