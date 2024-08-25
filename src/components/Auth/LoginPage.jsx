import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../api';
import { useAuth } from './AuthContext';
import { Box, TextField, Button, Typography, Link, Alert } from '@mui/material';

const LoginPage = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await ApiService.login(code);
      const { user } = response
      const { access_token, refresh_token } = response.data;

      // Store user data and token
      login({ ...user, access_token, refresh_token });

      // Redirect to the dashboard
      navigate('/dashboard');
    } catch (error) {
      // Display error message
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
        bgcolor: 'background.default',
        padding: 3,
      }}
    >
      <Typography variant="h2" gutterBottom mb={2}>
        Login
      </Typography>
      <Typography variant="body1" align="center" mb={2}>
        <Link 
          color="inherit" 
          href="tg://resolve?domain=MusicLyricsSSbot"
          underline='none'
        >
          @marketloginbot
        </Link>
        <span> telegram botiga kiring va 1 daqiqalik kodingizni oling.</span>
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, width: '300px' }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Enter 6-digit code"
        variant="outlined"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        sx={{ marginBottom: 2, width: '300px' }}
      />
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login
      </Button>
    </Box>
  );
};

export default LoginPage;
