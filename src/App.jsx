import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductsGrid from './components/Products/ProductsGrid';
import ProductDetail from './components/Products/ProductDetail';
import CategoryList from './components/Categories/CategoryList';
import AddCategory from './components/Categories/AddCategory';
import EditCategory from './components/Categories/EditCategory';
import PrivateRoute from './components/Auth/PrivateRoute';
import { AuthProvider } from './components/Auth/AuthContext';
import LoginPage from './components/Auth/LoginPage';
import ProtectedLayout from './components/Auth/ProtectedLayout';
import CustomersPage from './components/Customers/CustomersPage';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Route */}
                    <Route path="/login" element={<LoginPage />} />
                    
                    {/* Protected Routes */}
                    <Route
                        path="/*"
                        element={
                            <ProtectedLayout>
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            <PrivateRoute>
                                                <div>Dashboard</div>
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/products"
                                        element={
                                            <PrivateRoute>
                                                <ProductsGrid />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/product/:id"
                                        element={
                                            <PrivateRoute>
                                                <ProductDetail />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/categories"
                                        element={
                                            <PrivateRoute>
                                                <CategoryList />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/categories/edit/:id"
                                        element={
                                            <PrivateRoute>
                                                <EditCategory />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/categories/add"
                                        element={
                                            <PrivateRoute>
                                                <AddCategory />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/customers"
                                        element={
                                            <PrivateRoute>
                                                <CustomersPage />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/orders"
                                        element={
                                            <PrivateRoute>
                                                <div>Orders Page</div>
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/statistics"
                                        element={
                                            <PrivateRoute>
                                                <div>Statistics Page</div>
                                            </PrivateRoute>
                                        }
                                    />
                                </Routes>
                            </ProtectedLayout>
                        }
                    />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
