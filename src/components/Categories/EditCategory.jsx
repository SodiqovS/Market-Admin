// src/components/EditCategory.jsx

import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import ApiService from '../../api';
import { useParams, useNavigate } from 'react-router-dom';

function EditCategory() {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await ApiService.getCategory(id);
        setName(data.name);
        // If the image is already present, we might want to show it as a preview
      } catch (err) {
        console.error('Error fetching category:', err);
        setError('Failed to fetch category details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setError('Name is required.');
      return;
    }

    const data = { name };
    if (image) {
      data.image = image;
    }

    try {
      await ApiService.updateCategory(id, data);
      navigate('/categories');
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>Edit Category</Typography>
      {error && <Typography variant="body1" color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          component="label"
          sx={{ mb: 2 }}
        >
          Upload New Image
          <input
            type="file"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Button>
        <Button type="submit" variant="contained">Update Category</Button>
      </form>
    </Box>
  );
}

export default EditCategory;
