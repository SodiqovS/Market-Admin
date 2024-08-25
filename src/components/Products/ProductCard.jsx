// src/components/ProductCard.jsx
import React from 'react';
import { Card, CardContent, Typography, CardActions, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function ProductCard({ product }) {
    const navigate = useNavigate();
    
    const handleCardClick = () => {
        navigate(`/product/${product.id}`);
    };

    const settings = {
        dots: product.images.length > 1,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: product.images.length > 1,
    };

    return (
        <Card sx={{ maxWidth: 300, boxShadow: 4, borderRadius: 3 }} onClick={handleCardClick}>
            {product.images && product.images.length > 1 ? (
                <Slider
                    dots={true}
                    infinite={true}
                    speed={500}
                    slidesToShow={1}
                    slidesToScroll={1}
                    arrows={true}
                >
                    {product.images.map((image, index) => (
                        <div key={index}>
                            <img 
                                src={image.url} 
                                alt={`${product.name} ${index + 1}`} 
                                style={{ width: '100%', objectFit: 'cover', borderRadius: '8px' }}
                            />
                        </div>
                    ))}
                </Slider>
            ) : (
                <img 
                    src={product.images && product.images.length === 1 ? product.images[0].url : 'https://via.placeholder.com/400'} 
                    alt={product.name} 
                    style={{ width: '100%', objectFit: 'cover', borderRadius: '8px' }}
                />
            )}
            <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    ${product.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Quantity: {product.quantity}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default ProductCard;
