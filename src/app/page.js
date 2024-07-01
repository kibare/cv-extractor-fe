"use client";

import React from 'react';
import { Container, Typography, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const Content = styled('main')(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(3),
}));

const Dashboard = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Content>
        <Container>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>Dashboard</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>Overview Information</Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Total Candidates</Typography>
                <Typography variant="h4" sx={{ my: 2, fontWeight: 'bold' }}>560</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Total Department</Typography>
                <Typography variant="h4" sx={{ my: 2, fontWeight: 'bold' }}>1050</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Total Position</Typography>
                <Typography variant="h4" sx={{ my: 2, fontWeight: 'bold' }}>470</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Qualified Candidates</Typography>
                <Typography variant="h4" sx={{ my: 2, fontWeight: 'bold' }}>250</Typography>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Positions Overview</Typography>
                  <Button variant="outlined" size="small" >View All</Button>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Department</TableCell>
                        <TableCell>Position</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Add your rows here */}
                      <TableRow>
                        <TableCell>Marketing</TableCell>
                        <TableCell>Team Lead - Design</TableCell>
                        <TableCell>Open</TableCell>
                      </TableRow>
                      {/* Add more rows as needed */}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Candidates Overview</Typography>
                  <Button variant="outlined" size="small">View All</Button>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Employee Name</TableCell>
                        <TableCell>Position</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Qualified</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Add your rows here */}
                      <TableRow>
                        <TableCell>Leasie Watson</TableCell>
                        <TableCell>Team Lead - Design</TableCell>
                        <TableCell>Finance</TableCell>
                        <TableCell>90</TableCell>
                        <TableCell sx={{ color: 'success.main' }}>Qualified</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Darlene Robertson</TableCell>
                        <TableCell>Web Designer</TableCell>
                        <TableCell>Tech</TableCell>
                        <TableCell>85</TableCell>
                        <TableCell sx={{ color: 'error.main' }}>Not Qualified</TableCell>
                      </TableRow>
                      {/* Add more rows as needed */}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Content>
    </Box>
  );
};

export default Dashboard;
