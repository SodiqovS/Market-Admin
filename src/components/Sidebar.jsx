import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Toolbar } from '@mui/material';
import { Home, ShoppingCart, Category, People, BarChart, LocalMall } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';

function Sidebar({ mobileOpen, handleDrawerToggle }) {
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
                            handleDrawerToggle(); // Close the drawer on mobile after selection
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
        </Box>
    );
}

export default Sidebar;
