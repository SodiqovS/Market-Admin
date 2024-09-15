import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ApiService from '../../api';
import {
  Paper, Typography, Avatar, List, ListItem, ListItemText,
  Box, CircularProgress, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Collapse, IconButton
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const statusStyles = {
  PENDING: { backgroundColor: '#F4DD5D', color: '#fff', borderRadius: '12px', padding: '4px 8px' },
  APPROVED: { backgroundColor: '#FF9800', color: '#fff', borderRadius: '12px', padding: '4px 8px' },
  DELIVERING: { backgroundColor: '#2196F3', color: '#fff', borderRadius: '12px', padding: '4px 8px' },
  DELIVERED: { backgroundColor: '#4CAF50', color: '#fff', borderRadius: '12px', padding: '4px 8px' },
  CANCELLED: { backgroundColor: '#F44336', color: '#fff', borderRadius: '12px', padding: '4px 8px' },
};

const CustomerDetailPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [openOrderIds, setOpenOrderIds] = useState({});

  useEffect(() => {
    const fetchCustomerAndOrders = async () => {
      const customerData = await ApiService.getCustomerById(id);
      setCustomer(customerData);

      const ordersData = customerData.orders; 
      setOrders(ordersData);
    };
    fetchCustomerAndOrders();
  }, [id]);

  const toggleOrderDetails = (orderId) => {
    setOpenOrderIds((prevOpenOrderIds) => ({
      ...prevOpenOrderIds,
      [orderId]: !prevOpenOrderIds[orderId],
    }));
  };

  if (!customer) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <Avatar 
        src={customer.image} 
        alt={customer.first_name} 
        style={{ width: '100px', height: '100px', margin: 'auto' }}
      />
      <Typography variant="h5" align="center" style={{ marginTop: '20px' }}>
        {customer.first_name} {customer.last_name}
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary={customer.is_admin ? "Admin" : ""} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Username" secondary={`@${customer.username}`} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Phone Number" secondary={customer.phone_number} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Address" secondary={customer.address} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Telegram ID" secondary={customer.telegram_id} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Created At" secondary={new Date(customer.created_at).toLocaleDateString()} />
        </ListItem>
      </List>

      <Typography variant="h6" style={{ marginTop: '20px' }}>Orders</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Order ID</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Order Amount</TableCell>
              <TableCell>Address</TableCell>
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
                  <TableCell>{new Date(order.order_date).toLocaleString()}</TableCell>
                  <TableCell>${order.order_amount}</TableCell>
                  <TableCell>{order.shipping_address}</TableCell>
                  <TableCell>
                    <span style={statusStyles[order.order_status]}>
                      {order.order_status}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={openOrderIds[order.id]} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <Typography variant="h6">Order Details</Typography>
                        {order.order_details.map((detail) => (
                          <Typography key={detail.id}>
                            Product: 
                            <Link to={`/products/${detail.product.id}`}>
                              {detail.product.name}
                            </Link> 
                            - {detail.quantity} pcs
                          </Typography>
                        ))}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CustomerDetailPage;
