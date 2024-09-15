import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Button, Grid } from '@mui/material';
import ApiService from '../../api';
import { useNavigate } from 'react-router-dom';
import CategoryCard from './CategoryCard';

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await ApiService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to fetch categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography variant="h5" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>Categories</Typography>
      <Button variant="contained" onClick={() => navigate('/categories/add')}>Add Category</Button>
      <Grid container spacing={2} sx={{ mt: 3 }}>
        {categories.map((category) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={category.id}>
            <CategoryCard category={category}/>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default CategoryList;
