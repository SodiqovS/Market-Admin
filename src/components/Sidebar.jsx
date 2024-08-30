// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Toolbar, IconButton } from '@mui/material';
import { Home, ShoppingCart, Category, People, BarChart, Menu, LocalMall } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';

function Sidebar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const menuItems = [
        { text: 'Dashboard', icon: <Home />, path: '/' },
        { text: 'Products', icon: <ShoppingCart />, path: '/products' },
        { text: 'Categories', icon: <Category />, path: '/categories' },
        { text: 'Customers', icon: <People />, path: '/customers' },
        { text: 'Orders', icon: <LocalMall />, path: '/orders' },
        { text: 'Statistics', icon: <BarChart />, path: '/statistics' },
    ];
    const drawerWidth = 200;
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawerContent = (
        <>
            <Toolbar>
                <Typography variant="h6" noWrap>
                    Admin Panel
                </Typography>
            </Toolbar>
            <List>
                {menuItems.map((item, index) => (
                    <ListItem 
                        button 
                        key={index} 
                        onClick={() => {
                            navigate(item.path);
                            setMobileOpen(false); // Close the drawer on mobile after selection
                        }}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Container for the menu icon, ensuring it's fixed to the left */}
            <Box 
                sx={{
                    display: { xs: 'block', md: 'none' }, 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    zIndex: 1201, // Ensure it stays above the drawer
                }}
            >
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ ml: 1 }}
                >
                    <Menu />
                </IconButton>
            </Box>

            {/* Sidebar for large screens */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Sidebar as a temporary drawer on small screens */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { width: drawerWidth },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* The main content area */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {/* Main content goes here */}
            </Box>
        </Box>
    );
}

export default Sidebar;
