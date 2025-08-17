import React from 'react';
import { Box, Container } from '@mui/material';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard; 