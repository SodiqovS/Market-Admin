import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ApiService from '../../api';
import Pagination from '@mui/material/Pagination';
import ProductCard from './ProductCard'; 
import { Box, CircularProgress, Select, Typography } from '@mui/material';

function ProductsGrid() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState({});
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState('desc');
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [open, setOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        quantity: '',
        description: '',
        price: '',
        category_id: '',
        images: []
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const params = {
                    s: search,
                    categories: category.id ? [category.id] : [],
                    sort_by: sortBy,
                    sort_order: sortOrder,
                    page: page,
                    size: size,
                };

                const data = await ApiService.getProducts(params);
                setProducts(data.items);
                setTotalPages(data.pages);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to fetch products');
            }
             finally {
                setLoading(false);
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

        fetchProducts();
        fetchCategories();
    }, [search, category.id, sortBy, sortOrder, page, size]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddProduct = async () => {
        try {
            await ApiService.addProduct(newProduct);
            handleClose();
            setPage(1);
        } catch (error) {
            console.error('Error adding product:', error);
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
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid container spacing={1} sx={{ maxWidth: '1200px' }}>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        marginBottom: '20px',
                        gap: '10px' // add gap for spacing between elements on mobile
                    }}
                >
                    <TextField
                        label="Search"
                        variant="outlined"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ flex: '1 1 200px' }} // responsive width
                    />
                    <Autocomplete
                        options={categories}
                        getOptionLabel={(option) => option.name}
                        autoHighlight
                        onChange={(event, newValue) => setCategory(newValue ? newValue : {})}
                        renderInput={(params) => <TextField {...params} label="Category" variant="outlined" />}
                        renderOption={(props, option) => {
                            const { key, ...optionProps } = props;
                            return (
                              <Box
                                key={key}
                                component="li"
                                sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                {...optionProps}
                              >
                                <img
                                  loading="lazy"
                                  width="20"
                                  src={option.image_url}
                                  alt="pic"
                                />
                                {option.name}
                              </Box>
                            );
                          }}
                        sx={{ flex: '1 1 200px' }} // responsive width
                    />
                    <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        displayEmpty
                        variant="outlined"
                        sx={{ flex: '1 1 150px' }} // responsive width
                    >
                        <MenuItem value="id">ID</MenuItem>
                        <MenuItem value="name">Name</MenuItem>
                        <MenuItem value="price">Price</MenuItem>
                    </Select>
                    <Select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        displayEmpty
                        variant="outlined"
                        sx={{ flex: '1 1 150px' }} // responsive width
                    >
                        <MenuItem value="asc">O'sish</MenuItem>
                        <MenuItem value="desc">Kamayish</MenuItem>
                    </Select>
                    <Select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        displayEmpty
                        variant="outlined"
                        sx={{ flex: '1 1 50px' }} // responsive width
                    >
                        <MenuItem value={6}>6</MenuItem>
                        <MenuItem value={12}>12</MenuItem>
                        <MenuItem value={18}>18</MenuItem>
                        <MenuItem value={24}>24</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                        <MenuItem value={36}>36</MenuItem>
                    </Select>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpen}
                        sx={{ flex: '1 1 auto' }} // responsive width
                    >
                        Add Product
                    </Button>
                </div>
                <Grid
                    container
                    spacing={1}
                >
                    {products.map(product => (
                        <Grid item xs={6} sm={4} md={3} lg={2} key={product.id}>
                            <ProductCard product={product} />
                        </Grid>
                    ))}
                </Grid>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
                />
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                        <TextField
                            label="Quantity"
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            type="number"
                            value={newProduct.quantity}
                            onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                        />
                        <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            multiline
                            rows={4}
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        />
                        <TextField
                            label="Price"
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            type="number"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        />
                        <Autocomplete
                            options={categories}
                            getOptionLabel={(option) => option.name}
                            value={categories.find(cat => cat.id === newProduct.category_id) || null}
                            onChange={(event, newValue) => setNewProduct({ ...newProduct, category_id: newValue ? newValue.id : '' })}
                            renderInput={(params) => <TextField {...params} label="Category" variant="outlined" />}
                            style={{ marginTop: '20px' }}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => setNewProduct({ ...newProduct, images: [...e.target.files] })}
                            style={{ marginTop: '20px' }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleAddProduct} color="primary">
                            Add Product
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </Box>
    );
}

export default ProductsGrid;
