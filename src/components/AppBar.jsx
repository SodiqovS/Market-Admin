import React, { useEffect, useState } from 'react';
import { AppBar as MUIAppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Avatar, Box } from '@mui/material';
import { Menu as MenuIcon, AccountCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ApiService from '../api';

function AppBar({ onMenuClick }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await ApiService.getProfile();
                setProfile(profileData);
            } catch (error) {
                console.error('Failed to load profile:', error);
            }
        };

        fetchProfile();
    }, []);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <MUIAppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuClick} sx={{ display: { xs: 'block', md: 'none' } }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    
                </Typography>
                <Box>
                    <Link to="/products" style={{ color: 'inherit', textDecoration: 'none', marginRight: '20px' }}>
                        Products
                    </Link>
                    <Link to="/categories" style={{ color: 'inherit', textDecoration: 'none', marginRight: '20px' }}>
                        Categories
                    </Link>
                    <Link to="/orders" style={{ color: 'inherit', textDecoration: 'none', marginRight: '20px' }}>
                        Orders
                    </Link>
                    <Link to="/customers" style={{ color: 'inherit', textDecoration: 'none', marginRight: '20px' }}>
                        Customers
                    </Link>
                    <IconButton onClick={handleMenu} color="inherit">
                        {profile?.image ? (
                            <Avatar alt={profile.first_name} src={profile.image} />
                        ) : (
                            <AccountCircle />
                        )}
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem disabled>{profile?.first_name} {profile?.last_name}</MenuItem>
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </MUIAppBar>
    );
}

export default AppBar;
