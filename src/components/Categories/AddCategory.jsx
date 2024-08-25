// src/components/AddCategory.jsx

import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import ApiService from '../../api';
import { useNavigate } from 'react-router-dom';

function AddCategory() {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !image) {
      setError('Name and image are required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);

    try {
      await ApiService.createCategory(formData);
      navigate('/categories');
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category.');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>Add Category</Typography>
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
          Upload Image
          <input
            type="file"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Button>
        <Button type="submit" variant="contained">Add Category</Button>
      </form>
    </Box>
  );
}

export default AddCategory;
