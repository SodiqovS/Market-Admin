// src/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is logged in when the app starts
        const storedUser = localStorage.getItem('user');
        const storedAccessToken = localStorage.getItem('access_token');

        if (storedUser && storedAccessToken) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login'); // Redirect to login if not authenticated
        }
    }, [navigate]);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('access_token', userData.access_token); // Assuming token is in userData
        localStorage.setItem('refresh_token', userData.refresh); // Assuming token is in userData
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
