"use client";

import React, {useState} from 'react';
import { Container, Typography, Box, Grid, Paper, Button, TextField, MenuItem } from '@mui/material';
import SearchBar from '@/components/common/searchBar';
import DataTable from '@/components/common/dataTable';

const Trash = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleAddClick = () => {
    // Add new candidate logic
  };

  const data = Array.from({ length: 13 }).map((_, index) => ({
    id: index,
    name: `Candidate ${index + 1}`,
    position: `Position ${index + 1}`,
    department: `Department ${index + 1}`,
    score: Math.floor(Math.random() * 100),
    qualified: index % 2 === 0 ? 'Qualified' : 'Not Qualified',
  }));

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Container component="main" maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>Trash</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>Deleted Position</Typography>
          <Grid container spacing={2} sx={{ mb: 0.5 }}>
            <Grid item xs={12} md={4}>
              <TextField fullWidth select label="Label" value="Value" sx={{ mb: 2 }}>
                <MenuItem value="Value">Value</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} onAddClick={handleAddClick} />
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

export default Trash;
