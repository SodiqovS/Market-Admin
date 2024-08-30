// src/components/CustomersPage.jsx
import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableCell, TableContainer, TableRow, Paper, TextField, Select, MenuItem, Grid, Pagination, InputLabel, FormControl } from '@mui/material';
import ApiService from '../../api';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isAdmin, setIsAdmin] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchCustomers = async () => {
      const params = {
        s: search,
        sort_by: sortBy,
        sort_order: sortOrder,
        is_admin: isAdmin,
        page,
        size: pageSize, // Use selected page size
      };
      const response = await ApiService.getCustomers(params);
      setCustomers(response.items);
      setTotalPages(response.pages);
    };

    fetchCustomers();
  }, [search, sortBy, sortOrder, isAdmin, page, pageSize]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleIsAdminChange = (event) => {
    setIsAdmin(event.target.value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div>
      <Grid container spacing={2} alignItems="center" justifyContent="space-between" marginBottom={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search"
            value={search}
            onChange={handleSearchChange}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortBy} onChange={handleSortByChange}>
              <MenuItem value="id">ID</MenuItem>
              <MenuItem value="created_at">Created At</MenuItem>
              <MenuItem value="first_name">First Name</MenuItem>
              <MenuItem value="last_name">Last Name</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Sort Order</InputLabel>
            <Select value={sortOrder} onChange={handleSortOrderChange}>
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Admin</InputLabel>
            <Select value={isAdmin} onChange={handleIsAdminChange}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="true">Admin</MenuItem>
              <MenuItem value="false">User</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Page Size</InputLabel>
            <Select value={pageSize} onChange={handlePageSizeChange}>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Admin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.first_name}</TableCell>
                <TableCell>{customer.last_name}</TableCell>
                <TableCell>{customer.phone_number}</TableCell>
                <TableCell>{customer.username}</TableCell>
                <TableCell>{customer.is_admin ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        sx={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}
      />
    </div>
  );
};

export default CustomersPage;
