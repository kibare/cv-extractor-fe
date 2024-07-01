"use client";

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper, Button, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArchivedPositions, fetchPositions } from '@/redux/slices/positionSlice';
import { fetchDepartments } from '@/redux/slices/departmentSlice';
import { editPosition, archivePosition } from '@/services/api';
import SearchBar from '@/components/common/searchBar';
import DataTable from '@/components/common/dataTable';

const Archive = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    education: '',
    location: '',
    minWorkExp: '',
    description: '',
    qualification: '',
  });

  const archivedPositions = useSelector((state) => state.positions.archivedPositions);
  const departments = useSelector((state) => state.departments.departments);
  const allPositions = useSelector((state) => state.positions.positions);

  useEffect(() => {
    dispatch(fetchArchivedPositions());
    dispatch(fetchDepartments());
    dispatch(fetchPositions());
  }, [dispatch]);

  useEffect(() => {
    let positions = archivedPositions;

    if (selectedDepartment) {
      positions = positions.filter(position => position.DepartmentID === parseInt(selectedDepartment));
    }

    if (selectedPosition) {
      positions = positions.filter(position => position.ID === parseInt(selectedPosition));
    }

    setFilteredPositions(positions);
  }, [selectedDepartment, selectedPosition, archivedPositions]);

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
    setSelectedPosition('');
  };

  const handlePositionChange = (event) => {
    setSelectedPosition(event.target.value);
  };

  const handleEditClick = () => {
    if (selectedPosition) {
      const position = filteredPositions.find(pos => pos.ID === parseInt(selectedPosition));
      setEditFormData({
        name: position.Name,
        education: position.Education,
        location: position.Location,
        minWorkExp: position.MinWorkExp,
        description: position.Description,
        qualification: position.Qualification,
      });
      setOpenEditDialog(true);
    }
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await editPosition(selectedPosition, editFormData);
      dispatch(fetchArchivedPositions());
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Failed to edit position:', error);
      alert(error.response.data.message || 'An error occurred. Please try again.');
    }
  };

  const handleOpenClick = async () => {
    if (selectedPosition) {
      try {
        await archivePosition(selectedPosition);
        dispatch(fetchArchivedPositions());
        setSelectedPosition('');
      } catch (error) {
        console.error('Failed to open position:', error);
        alert(error.response.data.message || 'An error occurred. Please try again.');
      }
    }
  };

  const data = filteredPositions.map((position) => ({
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
              <TextField
                fullWidth
                select
                label="Select Position"
                value={selectedPosition}
                onChange={handlePositionChange}
                sx={{ mb: 2 }}
                disabled={!selectedDepartment}
              >
                {archivedPositions.filter(pos => pos.DepartmentID === parseInt(selectedDepartment) && pos.IsArchive).map((position) => (
                  <MenuItem key={position.ID} value={position.ID}>
                    {position.Name}
                  </MenuItem>
                ))}
              </TextField>
              <Button variant="contained" sx={{ mr: 2 }} onClick={handleEditClick} disabled={!selectedPosition}>EDIT POSITION</Button>
              <Button variant="outlined" onClick={handleOpenClick} disabled={!selectedPosition}>OPEN POSITION</Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ padding: 2, height: 'auto' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Archived Position</Typography>
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
      <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Position</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            required
            fullWidth
            label="Position Name"
            name="name"
            value={editFormData.name}
            onChange={handleEditFormChange}
          />
          <TextField
            margin="dense"
            required
            fullWidth
            label="Education"
            name="education"
            value={editFormData.education}
            onChange={handleEditFormChange}
          />
          <TextField
            margin="dense"
            required
            fullWidth
            label="Location"
            name="location"
            value={editFormData.location}
            onChange={handleEditFormChange}
          />
          <TextField
            margin="dense"
            required
            fullWidth
            label="Minimum Work Experience"
            name="minWorkExp"
            type="number"
            value={editFormData.minWorkExp}
            onChange={handleEditFormChange}
          />
          <TextField
            margin="dense"
            required
            fullWidth
            label="Description"
            name="description"
            value={editFormData.description}
            onChange={handleEditFormChange}
          />
          <TextField
            margin="dense"
            required
            fullWidth
            label="Qualification"
            name="qualification"
            value={editFormData.qualification}
            onChange={handleEditFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleEditFormSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Archive;
