import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ApiService from '../../api';

function ProductEditForm({ productId, onSave }) {
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    category_id: '',
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await ApiService.getProduct(productId);
        setProductData(product);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const categoriesData = await ApiService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await ApiService.updateProduct(productId, productData);
      onSave(); // callback function to close the form and refresh the data
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <form>
      <TextField
        label="Name"
        name="name"
        value={productData.name}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Price"
        name="price"
        value={productData.price}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Quantity"
        name="quantity"
        value={productData.quantity}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        name="description"
        value={productData.description}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Select
        label="Category"
        name="category_id"
        value={productData.category_id}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        margin="normal"
      >
        {categories.map(category => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        style={{ marginTop: '20px' }}
      >
        Save
      </Button>
    </form>
  );
}

export default ProductEditForm;
