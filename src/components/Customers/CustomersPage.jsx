import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment, Select, MenuItem, TablePagination, TableSortLabel } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../api';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('created_at');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, [search, sort, order, page, size]);

  const fetchCustomers = async () => {
    const params = {
      s: search,
      sort_by: sort,
      sort_order: order,
      page,
      size,
    };

    const data = await ApiService.getCustomers(params);
    setCustomers(data.items);
    setTotalItems(data.total); // Assuming the API returns the total number of items
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleSizeChange = (event) => {
    setSize(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleSort = (column) => {
    const isAsc = sort === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setSort(column);
  };

  return (
    <TableContainer component={Paper}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Select
          value={size}
          onChange={handleSizeChange}
          displayEmpty
          style={{ marginLeft: '8px' }}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={30}>30</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Avatar</TableCell>
            <TableCell>
              <TableSortLabel
                active={sort === 'first_name'}
                direction={sort === 'first_name' ? order : 'asc'}
                onClick={() => handleSort('first_name')}
              >
                First Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sort === 'last_name'}
                direction={sort === 'last_name' ? order : 'asc'}
                onClick={() => handleSort('last_name')}
              >
                Last Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sort === 'phone_number'}
                direction={sort === 'phone_number' ? order : 'asc'}
                onClick={() => handleSort('phone_number')}
              >
                Phone Number
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sort === 'username'}
                direction={sort === 'username' ? order : 'asc'}
                onClick={() => handleSort('username')}
              >
                Username
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sort === 'created_at'}
                direction={sort === 'created_at' ? order : 'asc'}
                onClick={() => handleSort('created_at')}
              >
                Created At
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sort === 'is_admin'}
                direction={sort === 'is_admin' ? order : 'asc'}
                onClick={() => handleSort('is_admin')}
              >
                Is Admin
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer) => (
            <TableRow 
              key={customer.id} 
              hover
              onClick={() => navigate(`/customers/${customer.id}`)}
            >
              <TableCell>
                <img src={customer.image} alt="avatar" style={{ width: '30px', borderRadius: '50%' }} />
              </TableCell>
              <TableCell>{customer.first_name}</TableCell>
              <TableCell>{customer.last_name}</TableCell>
              <TableCell>{customer.phone_number}</TableCell>
              <TableCell>{customer.username}</TableCell>
              <TableCell>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{customer.is_admin ? 'Yes' : 'No'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
        <TablePagination
          component="div"
          count={totalItems}
          page={page - 1}
          onPageChange={handlePageChange}
          rowsPerPage={size}
          onRowsPerPageChange={handleSizeChange}
          rowsPerPageOptions={[10, 20, 30, 50]}
        />
      </div>
    </TableContainer>
  );
};

export default CustomersPage;
