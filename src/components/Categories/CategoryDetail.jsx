import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Button, Grid, IconButton } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from '../../api';
import ProductCard from '../Products/ProductCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';


function CategoryDetail() {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleEditClick = () => {
        setIsEditing(true);
    };

    useEffect(() => {
        const fetchCategoryDetails = async () => {
            try {
                const data = await ApiService.getCategory(id);
                setCategory(data);
            } catch (err) {
                console.error('Error fetching category details:', err);
                setError('Failed to fetch category details.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryDetails();
    }, [id]);

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

    if (!category) {
        return null;
    }

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, px: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={() => navigate('/categories')}
                    variant="outlined"
                >
                    Back to Categories
                </Button>
                <IconButton 
                    aria-label="edit" 
                    size="large" 
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/categories/edit/${category.id}`);
                      }} 
                    sx={{ alignSelf: 'flex-start' }}
                >
                    <EditIcon fontSize="inherit" />
                </IconButton>
            </Box>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <img
                    src={category.image_url}
                    alt={category.name}
                    style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <Typography variant="h4" gutterBottom>{category.name}</Typography>
            </Box>

            <Grid container spacing={2}>
                {category.products.map((product) => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={product.id}>
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default CategoryDetail;
