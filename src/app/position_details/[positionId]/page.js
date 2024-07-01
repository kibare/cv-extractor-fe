"use client";

import React, {useState} from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Box, Grid, Paper, Button } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import PlaceIcon from '@mui/icons-material/Place';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import SearchBar from '@/components/common/searchBar';
import DataTable from '@/components/common/dataTable';
import { useParams } from 'react-router-dom';

const PositionDetails = () => {
  const { positionId } = useParams();

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
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>Position Details</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>Positions &gt; {positionId}</Typography>
            </Box>
            <Box>
                <Button variant="contained" sx={{mr: 2}}>EDIT POSITION</Button>
                <Button variant="outlined">CLOSE POSITION</Button>
            </Box>

        </Box>
        
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WorkIcon sx={{ mr: 1 }} />
              <Typography variant="body1">Project Manager</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WorkIcon sx={{ mr: 1 }} />
              <Typography variant="body1">3 Years</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon sx={{ mr: 1 }} />
              <Typography variant="body1">Bachelor of Product</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PeopleIcon sx={{ mr: 1 }} />
              <Typography variant="body1">100 Candidates</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PlaceIcon sx={{ mr: 1 }} />
              <Typography variant="body1">Jakarta, Cengkareng</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WorkIcon sx={{ mr: 1 }} />
              <Typography variant="body1">20 Qualified</Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 2, height: 'auto' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Qualification</Typography>
              <Typography variant="body2">dada</Typography>
              <Typography variant="body2">dawdawd</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 2, height: 'auto' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Description</Typography>
              <Typography variant="body2">dnakjwndawjknd</Typography>
              <Typography variant="body2">dawdawdaw</Typography>
            </Paper>
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
  );
};

export default PositionDetails;
