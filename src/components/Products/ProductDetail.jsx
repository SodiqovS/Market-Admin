import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, IconButton, Button } from '@mui/material';
import Slider from 'react-slick';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../api'; // Assuming ApiService is correctly imported
import Modal from '@mui/material/Modal';
import ProductEditForm from './ProductEditForm';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function ProductDetail() {
    const { id } = useParams(); // Get the product ID from the route parameters
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    
    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        // Optionally refresh the product data in the parent component
    };

    // Fetch the product details when the component mounts
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await ApiService.getProduct(id); // Fetch product details using the provided ID
                setProduct(data); // Set the product state with the fetched data
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Failed to fetch product details.'); // Set error message if fetching fails
            } finally {
                setLoading(false); // Stop loading once the fetch operation is complete
            }
        };

        fetchProduct(); // Call the fetch function
    }, [id]);

    // Show a loading spinner while the product data is being fetched
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Show an error message if there was a problem fetching the product data
    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Typography variant="h5" color="error">{error}</Typography>
            </Box>
        );
    }

    // Show a message if no product was found
    if (!product) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Typography variant="h5" color="error">Product not found.</Typography>
            </Box>
        );
    }

    const { name, price, quantity, images, sold_quantity } = product;

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, px: 2 }}>
            {/* Navigatsiya tugmalari */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={() => navigate('/products')}
                    variant="outlined"
                >
                    Back to Products
                </Button>
                <Button 
                    startIcon={<ShoppingCartIcon />} 
                    onClick={() => navigate('/cart')}
                    variant="contained"
                >
                    Go to Cart
                </Button>
            </Box>

            {/* Mahsulot Rasmlarini Slaydi */}
            {images && images.length > 1 ? (
                <Slider
                    dots={true}
                    infinite={true}
                    speed={500}
                    slidesToShow={1}
                    slidesToScroll={1}
                    arrows={true}
                    customPaging={(i) => (
                        <img src={images[i].url} alt={`${name} thumbnail`} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px' }} />
                    )}
                >
                    {images.map((image, index) => (
                        <div key={index}>
                            <img 
                                src={image.url} 
                                alt={`${name} ${index + 1}`} 
                                style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                        </div>
                    ))}
                </Slider>
            ) : (
                <img 
                    src={images && images.length === 1 ? images[0].url : 'https://via.placeholder.com/400'} 
                    alt={name} 
                    style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '8px' }}
                />
            )}

            <Box sx={{ mt: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>{name}</Typography>
                <Typography variant="h5" color="text.secondary" gutterBottom sx={{ mb: 2 }}>${price}</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>Quantity: {quantity}</Typography>
                <Typography variant="body1" color="text.secondary">Sold quantity: {sold_quantity}</Typography>
            </Box>

            <IconButton 
                aria-label="edit" 
                size="large" 
                onClick={handleEditClick} 
                sx={{ mt: 2 }}
            >
                <EditIcon fontSize="inherit" />
            </IconButton>
            <Modal open={isEditing} onClose={() => setIsEditing(false)}>
                <div style={{ padding: '20px', backgroundColor: 'white', margin: 'auto', marginTop: '100px', maxWidth: '600px', borderRadius: '8px' }}>
                    <ProductEditForm productId={product.id} onSave={handleSave} />
                </div>
            </Modal>
        </Box>
    );
}

export default ProductDetail;
