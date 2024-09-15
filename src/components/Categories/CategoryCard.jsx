import React from 'react';
import { Button, Card, CardContent, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

function CategoryCard({ category }) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/categories/${category.id}`);
    };

    return (
        <Card sx={{ maxWidth: 180, boxShadow: 4, borderRadius: 3, cursor: 'pointer'}} onClick={handleCardClick}>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',

                }}></div>
                <img
                    src={category.image_url}
                    alt={category.name}
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
            <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                    {category.name}
                </Typography>
            </CardContent>
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
        </Card>
    );
}

export default CategoryCard;
