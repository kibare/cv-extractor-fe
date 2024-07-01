"use client";

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper, Button, TextField, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArchivedPositions } from '@/redux/slices/positionSlice';
import SearchBar from '@/components/common/searchBar';
import DataTable from '@/components/common/dataTable';

const Archive = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const archivedPositions = useSelector((state) => state.positions.archivedPositions);

  useEffect(() => {
    dispatch(fetchArchivedPositions());
  }, [dispatch]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const data = archivedPositions.map((position) => ({
    id: position.ID,
    name: position.Name,
    department: position.Department.Name,
    education: position.Education,
    location: position.Location,
    minWorkExp: position.MinWorkExp,
  }));

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Container component="main" maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>Archive</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>Closed Position</Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <TextField fullWidth select label="Label" value="Value" sx={{ mb: 2 }}>
                <MenuItem value="Value">Value</MenuItem>
              </TextField>
              <TextField fullWidth select label="Attribute" value="Property" sx={{ mr: 2, mb: 2 }}>
                <MenuItem value="Property">Property</MenuItem>
              </TextField>
              <Button variant="contained" sx={{ mr: 2 }}>EDIT POSITION</Button>
              <Button variant="outlined">OPEN POSITION</Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ padding: 2, height: 'auto' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Candidates</Typography>
                <Typography variant="h4" sx={{ my: 1.5, fontWeight: 'bold' }}>{archivedPositions.length}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ padding: 2, height: 'auto' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Qualified Candidate</Typography>
                <Typography variant="h4" sx={{ my: 1.5, fontWeight: 'bold' }}>{archivedPositions.filter(pos => pos.IsQualified).length}</Typography>
              </Paper>
            </Grid>
          </Grid>
          <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} hideAddButton={true} />
          <DataTable 
            data={data} 
            page={page} 
            rowsPerPage={rowsPerPage} 
            emptyRows={emptyRows} 
            handleChangePage={handleChangePage} 
            handleChangeRowsPerPage={handleChangeRowsPerPage} 
          />
        </Container>
      </Box>
    </Box>
  );
};

export default Archive;
