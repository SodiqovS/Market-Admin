import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, IconButton, Button } from '@mui/material';
import Slider from 'react-slick';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../api'; 
import Modal from '@mui/material/Modal';
import ProductEditForm from './ProductEditForm';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function ProductDetail() {
    const { id } = useParams();
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
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await ApiService.getProduct(id);
                setProduct(data);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Failed to fetch product details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
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

    if (!product) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Typography variant="h5" color="error">Product not found.</Typography>
            </Box>
        );
    }

    const { name, price, quantity, images, sold_quantity, description, category } = product;

    const sliderSettings = {
        className: "",
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 3000,
        cssEase: "linear",
        pauseOnHover: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: images.length > 1,
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4, px: 2}} className="slider-container">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={() => navigate('/products')}
                    variant="outlined"
                >
                    Back to Products
                </Button>
                <IconButton 
                    aria-label="edit" 
                    size="large" 
                    onClick={handleEditClick} 
                    sx={{ alignSelf: 'flex-start' }}
                >
                    <EditIcon fontSize="inherit" />
                </IconButton>
            </Box>

            <div style={{ position: 'relative', width: '80%', height: 'auto', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                {product.images && product.images.length > 1 ? (
                    <Slider {...sliderSettings}>
                        {product.images.map((image, index) => (
                            <div key={index} style={{ position: 'relative', width: '100%', height: '100%' }}>
                                <div style={{ 
                                    position: 'absolute', 
                                    top: 0, 
                                    left: 0, 
                                    width: '100%', 
                                    height: '100%', 
                                }}></div>
                                <img 
                                    src={image.url} 
                                    alt={`${product.name} ${index + 1}`} 
                                    style={{ 
                                        maxWidth: '98%', 
                                        maxHeight: '98%', 
                                        width: 'auto', 
                                        height: 'auto', 
                                        objectFit: 'contain', 
                                        display: 'block', 
                                        margin: 'auto' 
                                    }}
                                />
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <div style={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '100%', 
                            height: '100%', 
                    
                        }}></div>
                        <img 
                            src={product.images[0].url} 
                            alt={product.name} 
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: '100%', 
                                width: 'auto', 
                                height: 'auto', 
                                objectFit: 'contain', 
                                display: 'block', 
                                margin: 'auto' 
                            }}
                        />
                    </div>
                )}
            </div>

            <Box sx={{ mt: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>{name}</Typography>
                <Typography variant="h5" color="text.secondary" gutterBottom sx={{ mb: 2 }}>${price}</Typography>
                <Typography variant="h5" color="text.secondary" gutterBottom sx={{ mb: 2 }}>{category.name}</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>Quantity: {quantity}</Typography>
                <Typography variant="body1" color="text.secondary">Sold quantity: {sold_quantity}</Typography>
                <Typography variant="body1" color="text.secondary">Description: {description}</Typography>
            </Box>

            <Modal open={isEditing} onClose={() => setIsEditing(false)}>
                <div style={{ padding: '20px', backgroundColor: 'white', margin: 'auto', marginTop: '100px', maxWidth: '600px', borderRadius: '8px' }}>
                    <ProductEditForm productId={product.id} onSave={handleSave} />
                </div>
            </Modal>
        </Box>
    );
}

export default ProductDetail;
