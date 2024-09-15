// src/components/ProductCard.jsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function ProductCard({ product }) {
    const navigate = useNavigate();
    
    const handleCardClick = () => {
        navigate(`/products/${product.id}`);
    };

    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        cssEase: "linear",
        pauseOnHover: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: product.images.length > 1,
    };

    return (
        <Card sx={{ maxWidth: 180, boxShadow: 4, borderRadius: 3 }} onClick={handleCardClick}>
            <div style={{ position: 'relative', width: '180px', height: '180px', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                {product.images && product.images.length > 1 ? (
                    <Slider {...settings}>
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
            <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {product.price} so'm
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Quantity: {product.quantity} ta
                </Typography>
            </CardContent>
        </Card>
    );
}

export default ProductCard;
