import { useEffect, useState } from 'react';
import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, Box } from '@mui/material';
import ApiService from '../api'; // Assume you have ApiService for fetching user data

function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await ApiService.getProfile();
        setUser(response.data.user);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Admin Panel
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt={user.username} src={user.image} sx={{ mr: 2 }} />
            <Typography variant="body1">{user.username}</Typography>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
