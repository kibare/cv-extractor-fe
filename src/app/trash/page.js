// src/app/trash/page.js

"use client";

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, TextField, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '@/redux/slices/departmentSlice';
import { fetchPositions } from '@/redux/slices/positionSlice';
import { fetchAllCandidates } from '@/redux/slices/candidateSlice'; // Import the thunk for fetching candidates
import SearchBar from '@/components/common/searchBar';
import TrashDataTable from '@/components/common/trashDataTable';

const Trash = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [positions, setPositions] = useState([]);

  const departments = useSelector((state) => state.departments.departments);
  const allPositions = useSelector((state) => state.positions.positions);
  const candidates = useSelector((state) => state.candidates.candidates);

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchPositions());
    dispatch(fetchAllCandidates()); // Fetch all candidates
  }, [dispatch]);

  useEffect(() => {
    const filteredPositions = allPositions.filter(position => position.IsTrash && (selectedDepartment ? position.DepartmentID === parseInt(selectedDepartment) : true));
    setPositions(filteredPositions);
  }, [allPositions, selectedDepartment]);

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

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const getCandidatesCount = (positionId) => {
    return candidates.filter(candidate => candidate.PositionID === positionId).length;
  };

  const getQualifiedCandidatesCount = (positionId) => {
    return candidates.filter(candidate => candidate.PositionID === positionId && candidate.IsQualified).length;
  };

  const data = positions.map(position => ({
    id: position.ID,
    position: position.Name,
    department: position.Department.Name,
    candidateCount: getCandidatesCount(position.ID),
    qualifiedCandidateCount: getQualifiedCandidatesCount(position.ID),
    removedDate: new Date(position.RemovedDate).toLocaleString(),
  }));

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Container component="main" maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>Trash</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>Deleted Positions</Typography>
          <Grid container spacing={2} sx={{ mb: 0.5 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Select Department"
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                sx={{ mb: 2 }}
              >
                {departments.map((department) => (
                  <MenuItem key={department.ID} value={department.ID}>
                    {department.Name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} hideAddButton={true}/>
          <TrashDataTable 
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
