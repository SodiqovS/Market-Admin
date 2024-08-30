// src/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" />;
    }

    if (!user.is_admin) {
        // Redirect to a page that informs the user they are not an admin
        return <Navigate to="/not-authorized" />;
    }

    return children;
};

export default PrivateRoute;
