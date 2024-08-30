import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ApiService from '../../api';
import Pagination from '@mui/material/Pagination';
import ProductCard from './ProductCard';

function ProductsGrid() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState('desc');
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

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
                    categories: category ? [category] : [],
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
    }, [search, category, sortBy, sortOrder, page, size]);

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
            // Fetch the updated product list
            setPage(1); // Reset to first page to show the new product
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    displayEmpty
                    variant="outlined"
                >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map(cat => (
                        <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                    ))}
                </Select>
                <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    displayEmpty
                    variant="outlined"
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
                >
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
                </Select>
                <Select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    displayEmpty
                    variant="outlined"
                >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                </Select>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Add Product
                </Button>
            </div>

            <Grid container spacing={1}>
                {products.map(product => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>

            <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                style={{ marginTop: '20px' }}
            />

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                    <TextField
                        label="Quantity"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="number"
                        value={newProduct.quantity}
                        onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                    />
                    <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    />
                    <TextField
                        label="Price"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                    <Select
                        value={newProduct.category_id}
                        onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                        displayEmpty
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="">Select Category</MenuItem>
                        {categories.map(cat => (
                            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                        ))}
                    </Select>
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
        </>
    );
}

export default ProductsGrid;
