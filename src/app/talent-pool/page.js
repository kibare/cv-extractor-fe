"use client";

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper, Button, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '@/redux/slices/departmentSlice';
import { fetchPositions } from '@/redux/slices/positionSlice';
import { fetchCandidatesByFilters, fetchAllCandidates } from '@/redux/slices/candidateSlice';
import { editPosition, archivePosition } from '@/services/api'; // Import the API function to archive position
import SearchBar from '@/components/common/searchBar';
import DataTable from '@/components/common/dataTable';

const TalentPool = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false); // For edit position dialog
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [positions, setPositions] = useState([]);
  const [editFormData, setEditFormData] = useState({ // Form data for editing position
    name: '',
    education: '',
    location: '',
    minWorkExp: '',
    description: '',
    qualification: '',
  });
  const departments = useSelector((state) => state.departments.departments);
  const allPositions = useSelector((state) => state.positions.positions);
  const candidates = useSelector((state) => state.candidates.candidates);

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchPositions());
    dispatch(fetchAllCandidates());
  }, [dispatch]);

  useEffect(() => {
    if (selectedDepartment) {
      const filteredPositions = allPositions.filter(position => position.DepartmentID === parseInt(selectedDepartment) && !position.IsArchive);
      setPositions(filteredPositions);
    } else {
      setPositions([]);
    }
  }, [selectedDepartment, allPositions]);

  useEffect(() => {
    const filters = {
      departmentId: selectedDepartment ? parseInt(selectedDepartment) : 0,
      positionId: selectedPosition ? parseInt(selectedPosition) : 0
    };
    dispatch(fetchCandidatesByFilters(filters));
  }, [selectedDepartment, selectedPosition, dispatch]);

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
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
    setSelectedPosition(''); // Reset the selected position when department changes
  };

  const handlePositionChange = (event) => {
    setSelectedPosition(event.target.value);
  };

  const handleEditClick = () => {
    if (selectedPosition) {
      const position = allPositions.find(pos => pos.ID === parseInt(selectedPosition));
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
      await editPosition(selectedPosition, editFormData); // Call the API to edit the position
      dispatch(fetchPositions());
      // Fetch candidates again after editing position
      const filters = {
        departmentId: selectedDepartment ? parseInt(selectedDepartment) : 0,
        positionId: selectedPosition ? parseInt(selectedPosition) : 0
      };
      dispatch(fetchCandidatesByFilters(filters));
      handleEditDialogClose();
    } catch (error) {
      console.error('Failed to edit position:', error);
      alert(error.response.data.message || 'An error occurred. Please try again.');
    }
  };

  const handleArchiveClick = async () => {
    if (selectedPosition) {
      try {
        await archivePosition(selectedPosition); // Call the API to archive the position
        dispatch(fetchPositions());
        setSelectedPosition('');
      } catch (error) {
        console.error('Failed to archive position:', error);
        alert(error.response.data.message || 'An error occurred. Please try again.');
      }
    }
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find(dep => dep.ID === departmentId);
    return department ? department.Name : '';
  };

  const data = candidates.map(candidate => ({
    id: candidate.ID,
    name: candidate.Name,
    position: candidate.Position.Name,
    department: getDepartmentName(candidate.Position.DepartmentID) || candidate.Position.Department.Name,
    score: candidate.Score,
    qualified: candidate.IsQualified ? 'Qualified' : 'Not Qualified',
  }));

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Container component="main" maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>Talent Pool</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>Get The Best Candidate!</Typography>
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
                {positions.map((position) => (
                  <MenuItem key={position.ID} value={position.ID}>
                    {position.Name}
                  </MenuItem>
                ))}
              </TextField>
              <Button 
                variant="contained" 
                sx={{ mr: 2 }} 
                onClick={handleEditClick} 
                disabled={!selectedDepartment || !selectedPosition}
              >
                EDIT POSITION
              </Button>
              <Button variant="outlined" onClick={handleArchiveClick} disabled={!selectedDepartment || !selectedPosition}>
                CLOSE POSITION
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ padding: 2, height: 'auto' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Candidates</Typography>
                <Typography variant="h4" sx={{ my: 1.5, fontWeight: 'bold' }}>{candidates.length}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ padding: 2, height: 'auto' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Qualified Candidate</Typography>
                <Typography variant="h4" sx={{ my: 1.5, fontWeight: 'bold' }}>{candidates.filter(c => c.IsQualified).length}</Typography>
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
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Add Candidate</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Full Name"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Email Address"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            select
            label="Select Department"
            fullWidth
            variant="outlined"
            value={selectedDepartment}
            onChange={handleDepartmentChange}
          >
            {departments.map((department) => (
              <MenuItem key={department.ID} value={department.ID}>
                {department.Name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            select
            label="Select Position"
            fullWidth
            variant="outlined"
            value={selectedPosition}
            onChange={handlePositionChange}
            disabled={!selectedDepartment}
          >
            {positions.map((position) => (
              <MenuItem key={position.ID} value={position.ID}>
                {position.Name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Domicile"
            fullWidth
            variant="outlined"
          />
          <Box sx={{ mt: 2, mb: 2, border: '1px dashed grey', padding: 2, textAlign: 'center' }}>
            <Typography>Drag & Drop or choose file to upload</Typography>
            <Typography variant="caption" display="block">Supported formats: Jpeg, pdf</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ mr: 2 }}>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained">Create Candidate</Button>
        </DialogActions>
      </Dialog>
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

export default TalentPool;
