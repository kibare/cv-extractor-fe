"use client";

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '@/redux/slices/departmentSlice';
import { fetchPositions } from '@/redux/slices/positionSlice';
import { fetchAllCandidates } from '@/redux/slices/candidateSlice';
import Link from 'next/link';

const Content = styled('main')(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(3),
}));

const Dashboard = () => {
  const dispatch = useDispatch();
  const departments = useSelector((state) => state.departments.departments);
  const positions = useSelector((state) => state.positions.positions);
  const candidates = useSelector((state) => state.candidates.candidates);

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchPositions());
    dispatch(fetchAllCandidates());
  }, [dispatch]);

  const getDepartmentName = (departmentId) => {
    const department = departments.find(dep => dep.ID === departmentId);
    return department ? department.Name : '';
  };

  const getCandidatesCount = (positionId) => {
    return candidates.filter(candidate => candidate.PositionID === positionId).length;
  };

  const getQualifiedCandidatesCount = (positionId) => {
    return candidates.filter(candidate => candidate.PositionID === positionId && candidate.IsQualified).length;
  };

  const recentPositions = positions.slice(0, 5);
  const recentCandidates = candidates.slice(0, 5);

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
                <Typography variant="h4" sx={{ my: 2, fontWeight: 'bold' }}>{candidates.length}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Total Department</Typography>
                <Typography variant="h4" sx={{ my: 2, fontWeight: 'bold' }}>{departments.length}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Total Position</Typography>
                <Typography variant="h4" sx={{ my: 2, fontWeight: 'bold' }}>{positions.length}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Qualified Candidates</Typography>
                <Typography variant="h4" sx={{ my: 2, fontWeight: 'bold' }}>{candidates.filter(c => c.IsQualified).length}</Typography>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Positions Overview</Typography>
                  <Link href="/positions" passHref>
                    <Button variant="outlined" size="small">View All</Button>
                  </Link>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Department</TableCell>
                        <TableCell>Position</TableCell>
                        <TableCell>Candidates</TableCell>
                        <TableCell>Qualified Candidates</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentPositions.map((position) => (
                        <TableRow key={position.ID}>
                          <TableCell>{getDepartmentName(position.DepartmentID)}</TableCell>
                          <TableCell>{position.Name}</TableCell>
                          <TableCell>{getCandidatesCount(position.ID)}</TableCell>
                          <TableCell>{getQualifiedCandidatesCount(position.ID)}</TableCell>
                        </TableRow>
                      ))}
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
                  <Link href="/talent-pool" passHref>
                    <Button variant="outlined" size="small">View All</Button>
                  </Link>
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
                      {recentCandidates.map((candidate) => (
                        <TableRow key={candidate.ID}>
                          <TableCell>{candidate.Name}</TableCell>
                          <TableCell>{candidate.Position.Name}</TableCell>
                          <TableCell>{getDepartmentName(candidate.Position.DepartmentID)}</TableCell>
                          <TableCell>{candidate.Score}</TableCell>
                          <TableCell sx={{ color: candidate.IsQualified ? 'success.main' : 'error.main' }}>
                            <Chip label={candidate.IsQualified ? 'Qualified' : 'Not Qualified'} color={candidate.IsQualified ?  "success" : "error"} variant='outlined'></Chip>
                          </TableCell>
                        </TableRow>
                      ))}
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
