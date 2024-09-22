import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Collapse, IconButton, Box, Typography, Pagination,
  TextField, Button,
  MenuItem
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ApiService from '../../api';

const statusStyles = {
  PENDING: { backgroundColor: '#F4DD5D', color: '#fff', borderRadius: '12px', padding: '4px 8px' },
  APPROVED: { backgroundColor: '#FF9800', color: '#fff', borderRadius: '12px', padding: '4px 8px' },
  DELIVERING: { backgroundColor: '#2196F3', color: '#fff', borderRadius: '12px', padding: '4px 8px' },
  DELIVERED: { backgroundColor: '#4CAF50', color: '#fff', borderRadius: '12px', padding: '4px 8px' },
  CANCELLED: { backgroundColor: '#F44336', color: '#fff', borderRadius: '12px', padding: '4px 8px' },
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [openOrderIds, setOpenOrderIds] = useState({});

  // Filter state
  const [search, setSearch] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('order_date');
  const [sortOrder, setSortOrder] = useState('desc');

  // State to manage applying filters
  const [filterParams, setFilterParams] = useState({});
  const [searchTerm, setSearchTerm] = useState('');  // Debounced search term

  useEffect(() => {
    fetchOrders();
  }, [page, size, filterParams]);

  const fetchOrders = async () => {
    // Build filter params dynamically, adding only non-empty values
    const params = {
      page,
      size,
      ...filterParams
    };

    const data = await ApiService.getOrders(params);
    setOrders(data.items);
    setTotalPages(data.pages);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const toggleOrderDetails = (orderId) => {
    setOpenOrderIds((prevOpenOrderIds) => ({
      ...prevOpenOrderIds,
      [orderId]: !prevOpenOrderIds[orderId],
    }));
  };

  const handleFilterReset = () => {
    setSearch('');
    setMinAmount('');
    setMaxAmount('');
    setStartDate('');
    setEndDate('');
    setSortBy('order_date');
    setSortOrder('desc');
    setFilterParams({}); // Reset filters
    setPage(1);
  };

  const handleApplyFilters = () => {
    // Apply filters only when the apply button is clicked
    const filters = {};
    if (search) filters.search = search;
    if (minAmount) filters.min_amount = minAmount;
    if (maxAmount) filters.max_amount = maxAmount;
    if (startDate) filters.start_date = startDate;
    if (endDate) filters.end_date = endDate;
    filters.sort_by = sortBy;
    filters.sort_order = sortOrder;

    setFilterParams(filters);
    setPage(1); // Reset page to 1 after applying filters
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleApplyFilters();
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Update order status in the backend
      await ApiService.updateOrderStatus(orderId, newStatus);

      // Update the local order list with the new status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, order_status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Failed to update order status:', error);
      // Optionally display a message to the user
    }
  };

  return (
    <Paper>
      <Typography variant="h3">Orders</Typography>
      <Box padding={2} display="flex" flexDirection="column" maxWidth="600px">

        {/* Filter Group: Search */}
        <Box display="flex" flexDirection="row" mb={2} justifyContent="space-between">
          <TextField
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ mb: 2 }}
          />
        </Box>

        {/* Filter Group: Amounts */}
        <Box display="flex" flexDirection="row" mb={2} justifyContent="space-between">
          <Typography variant="subtitle1">Amount</Typography>
          <TextField
            label="Min Amount"
            type="number"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            size="small"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Max Amount"
            type="number"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            size="small"
            sx={{ mb: 2 }}
          />
        </Box>

        {/* Filter Group: Dates */}
        <Box display="flex" flexDirection="row" mb={2} justifyContent="space-between">
          <Typography variant="subtitle1">Date</Typography>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            sx={{ mb: 2 }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            sx={{ mb: 2 }}
          />
        </Box>

        {/* Filter Group: Sorting */}
        <Box display="flex" flexDirection="row" mb={2} justifyContent="space-between">
          <Typography variant="subtitle1">Sorting</Typography>
          <TextField
            select
            label="Sort By"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            size="small"
            sx={{ mb: 2 }}
          >
            <MenuItem value="id">ID</MenuItem>
            <MenuItem value="order_date">Date</MenuItem>
            <MenuItem value="order_amount">Amount</MenuItem>
          </TextField>
          <TextField
            select
            label="Sort Order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            size="small"
            sx={{ mb: 2 }}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </TextField>
        </Box>

        {/* Action Buttons */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Button variant="contained" onClick={handleApplyFilters}>Apply</Button>
          <Button variant="outlined" onClick={handleFilterReset}>Reset</Button>
        </Box>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      {openOrderIds[order.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    <Link to={`/customers/${order.user_info.id}`}>
                      {`${order.user_info.first_name} ${order.user_info.last_name || ''}`}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <a href={`tel:${order.user_info.phone_number}`}>{order.user_info.phone_number}</a>
                  </TableCell>
                  <TableCell>{new Date(order.order_date).toLocaleString()}</TableCell>
                  <TableCell>{order.shipping_address}</TableCell>
                  <TableCell>${order.order_amount}</TableCell>
                  <TableCell>
                    <TextField
                      select
                      value={order.order_status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      size="small"
                      variant="outlined"
                      sx={{
                        minWidth: 150,
                        '& .MuiSelect-select': {
                          backgroundColor: statusStyles[order.order_status].backgroundColor,
                          color: statusStyles[order.order_status].color,
                          borderRadius: '12px',
                          padding: '4px 8px',
                        }
                      }}
                    >
                      {Object.keys(statusStyles).map((status) => (
                        <MenuItem key={status} value={status} sx={statusStyles[status]}>
                          {status}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={openOrderIds[order.id]} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <Table size="small" aria-label="order-details">
                          <TableHead>
                            <TableRow>
                              <TableCell>Product</TableCell>
                              <TableCell align="right">Quantity</TableCell>
                              <TableCell align="right">Price</TableCell>
                              <TableCell align="right">Total</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {order.order_details.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <Link to={`/products/${item.product.id}`}>
                                    {item.product.name}
                                  </Link>
                                </TableCell>
                                <TableCell align="right">{item.quantity}</TableCell>
                                <TableCell align="right">${item.product.price}</TableCell>
                                <TableCell align="right">
                                  ${item.quantity * item.product.price}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}
      />
    </Paper>
  );
};

export default OrdersPage;
