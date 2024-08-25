import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Button, Grid } from '@mui/material';
import ApiService from '../../api';
import { useNavigate } from 'react-router-dom';

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
          <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
            <Box sx={{ textAlign: 'center', boxShadow: 4, borderRadius: 3, padding: 1}} mb={5}>
              <img 
                src={category.image_url} 
                alt={category.name} 
                style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }}
              />
              <Typography variant="h6">{category.name}</Typography>
              <Button variant="outlined" onClick={() => navigate(`/categories/edit/${category.id}`)} sx={{ mt: 1 }}>
                Edit
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default CategoryList;
