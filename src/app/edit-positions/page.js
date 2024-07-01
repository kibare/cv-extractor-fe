"use client";

import React, { useState } from 'react';
import { Container, Typography, Box, Button, TextField } from '@mui/material';

const EditPosition = () => {
  const [positionName, setPositionName] = useState('');
  const [department, setDepartment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log('Position Name:', positionName);
    console.log('Department:', department);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Edit Position
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="positionName"
            label="Position Name"
            name="positionName"
            autoFocus
            value={positionName}
            onChange={(e) => setPositionName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="department"
            label="Department"
            name="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Save Changes
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EditPosition;
