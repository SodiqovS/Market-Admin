import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../api';
import Sidebar from '../Sidebar';
import AppBar from '../AppBar';
import { Box, CircularProgress } from '@mui/material';

function ProtectedLayout({ children }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));

                if (!user || !user.is_admin) {
                    throw new Error('You are not an admin');
                }

                // Attempt to fetch the profile to validate the access token
                setLoading(false);
            } catch (error) {
                console.error('Error during authentication:', error);

                if (error.message === 'You are not an admin') {
                    alert('You are not an admin');
                    localStorage.clear();
                    navigate('/login');
                } else if (error.response && error.response.status === 401) {
                    try {
                        // If access token expired, try to refresh it
                        await ApiService.refreshAccessToken();
                        // await ApiService.getProfile(); // Retry with the new access token
                        setLoading(false);
                    } catch (refreshError) {
                        console.error('Session expired, please log in again.', refreshError);
                        localStorage.clear(); // Clear all tokens and user info
                        navigate('/login');
                    }
                } else {
                    console.error('Session expired, please log in again.');
                    localStorage.clear(); // Clear all tokens and user info
                    navigate('/login');
                }
            }
        };

        checkAuth();
    }, [navigate]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            <AppBar />
            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <Sidebar />
                <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, overflow: 'auto' }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}

export default ProtectedLayout;
