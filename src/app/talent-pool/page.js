"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, Grid, Paper, Button, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '@/redux/slices/departmentSlice';
import { fetchPositions } from '@/redux/slices/positionSlice';
import { fetchCandidatesByFilters, fetchAllCandidates } from '@/redux/slices/candidateSlice';
import { editPosition, archivePosition, createCandidate, trashPosition, getCandidateDetails, editCandidate } from '@/services/api';
import SearchBar from '@/components/common/searchBar';
import DataTable from '@/components/common/dataTable';

const TalentPool = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openEditCandidateDialog, setOpenEditCandidateDialog] = useState(false);
  const [openCVDialog, setOpenCVDialog] = useState(false);
  const [cvUrl, setCVUrl] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedDomicile, setSelectedDomicile] = useState('');
  const [positions, setPositions] = useState([]);
  const [editFormData, setEditFormData] = useState({
    name: '',
    education: '',
    location: '',
    minWorkExp: '',
    description: '',
    qualification: '',
  });
  const [editCandidateData, setEditCandidateData] = useState({
    id: '',
    name: '',
    email: '',
    domicile: '',
    positionId: '',
    cvUrl: '', // Add cvUrl to state
  });
  const [file, setFile] = useState(null);
  const [newCandidateData, setNewCandidateData] = useState({
    name: '',
    email: '',
    domicile: '',
    positionId: '',
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
    setSelectedPosition('');
  };

  const handlePositionChange = (event) => {
    setSelectedPosition(event.target.value);
    setNewCandidateData({ ...newCandidateData, positionId: event.target.value });
  };

  const handleDomicileChange = (event) => {
    setSelectedDomicile(event.target.value);
    setNewCandidateData({ ...newCandidateData, domicile: event.target.value });
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
      await editPosition(selectedPosition, editFormData);
      dispatch(fetchPositions());
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
        await archivePosition(selectedPosition);
        dispatch(fetchPositions());
        setSelectedPosition('');
      } catch (error) {
        console.error('Failed to archive position:', error);
        alert(error.response.data.message || 'An error occurred. Please try again.');
      }
    }
  };

  const handleDeleteClick = async () => {
    if (selectedPosition) {
      try {
        await trashPosition(selectedPosition);
        dispatch(fetchPositions());
        setSelectedPosition('');
      } catch (error) {
        console.error('Failed to trash position:', error);
        alert(error.response.data.message || 'An error occurred. Please try again.');
      }
    }
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleNewCandidateChange = (event) => {
    const { name, value } = event.target;
    setNewCandidateData({
      ...newCandidateData,
      [name]: value,
    });
  };

  const handleNewCandidateSubmit = async () => {
    const formData = new FormData();
    formData.append('name', newCandidateData.name);
    formData.append('email', newCandidateData.email);
    formData.append('domicile', newCandidateData.domicile);
    formData.append('positionId', newCandidateData.positionId);
    if (file) {
      formData.append('cv_file', file);
    }

    try {
      await createCandidate(formData);
      dispatch(fetchAllCandidates());
      handleDialogClose();
    } catch (error) {
      console.error('Failed to create candidate:', error);
      alert(error.response.data.message || 'An error occurred. Please try again.');
    }
  };

  const handleEditCandidateChange = (event) => {
    const { name, value } = event.target;
    setEditCandidateData({
      ...editCandidateData,
      [name]: value,
    });
  };

  const handleEditCandidateClick = async (candidateId) => {
    try {
      const response = await getCandidateDetails(candidateId);
      setEditCandidateData({
        id: response.ID,
        name: response.Name,
        email: response.Email,
        domicile: response.Domicile,
        positionId: response.PositionID,
      });
      setSelectedDomicile(response.Domicile);
      setSelectedDepartment('')
      setSelectedPosition('')
      setOpenEditCandidateDialog(true);
    } catch (error) {
      console.error('Failed to fetch candidate details:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleEditCandidateSubmit = async () => {
    const formData = new FormData();
    formData.append('name', editCandidateData.name);
    formData.append('email', editCandidateData.email);
    formData.append('domicile', editCandidateData.domicile);
    formData.append('positionId', editCandidateData.positionId);

    try {
      await editCandidate(editCandidateData.id, formData);
      dispatch(fetchAllCandidates());
      setOpenEditCandidateDialog(false);
    } catch (error) {
      console.error('Failed to edit candidate:', error);
      alert(error.response.data.message || 'An error occurred. Please try again.');
    }
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find(dep => dep.ID === departmentId);
    return department ? department.Name : '';
  };

  const activeCandidates = candidates.filter(candidate => !candidate.Position.IsArchive && !candidate.Position.IsTrash);

  const data = activeCandidates.map(candidate => ({
    id: candidate.ID,
    name: candidate.Name,
    position: candidate.Position.Name,
    department: getDepartmentName(candidate.Position.DepartmentID) || candidate.Position.Department.Name,
    score: candidate.Score,
    qualified: candidate.IsQualified ? 'Qualified' : 'Not Qualified',
  }));

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'application/pdf' });

  const handleViewCV = async (candidateId) => {
    try {
      const response = await getCandidateDetails(candidateId);
      setCVUrl(response.CVFile);
      setOpenCVDialog(true);
    } catch (error) {
      console.error('Failed to fetch candidate details:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleCVDialogClose = () => {
    setOpenCVDialog(false);
    setCVUrl('');
  };

  const regions = [
    "Aceh", "Bali", "Banten", "Bengkulu", "DI Yogyakarta", "DKI Jakarta", "Gorontalo",
    "Jambi", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Kalimantan Barat", "Kalimantan Selatan",
    "Kalimantan Tengah", "Kalimantan Timur", "Kalimantan Utara", "Kepulauan Bangka Belitung",
    "Kepulauan Riau", "Lampung", "Maluku", "Maluku Utara", "Nusa Tenggara Barat", "Nusa Tenggara Timur",
    "Papua", "Papua Barat", "Riau", "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tengah", "Sulawesi Tenggara",
    "Sulawesi Utara", "Sumatera Barat", "Sumatera Selatan", "Sumatera Utara"
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Container component="main" maxWidth="lg">
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>Talent Pool</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>Get The Best Candidate!</Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
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
              <Button variant="outlined" sx={{ mr: 2 }} onClick={handleArchiveClick}  disabled={!selectedDepartment || !selectedPosition}>
                CLOSE POSITION
              </Button>
              <Button variant="outlined" onClick={handleDeleteClick} disabled={!selectedDepartment || !selectedPosition}>
                TRASH POSITION
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={3} sx={{ padding: 2, height: 'auto' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Candidates</Typography>
                <Typography variant="h4" sx={{ my: 1.5, fontWeight: 'bold' }}>{activeCandidates.length}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={3} sx={{ padding: 2, height: 'auto' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Qualified Candidate</Typography>
                <Typography variant="h4" sx={{ my: 1.5, fontWeight: 'bold' }}>{activeCandidates.filter(c => c.IsQualified).length}</Typography>
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
            onViewCV={handleViewCV}
            onEditCandidate={handleEditCandidateClick}
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
            name="name"
            value={newCandidateData.name}
            onChange={handleNewCandidateChange}
          />
          <TextField
            margin="dense"
            label="Email Address"
            fullWidth
            variant="outlined"
            name="email"
            value={newCandidateData.email}
            onChange={handleNewCandidateChange}
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
            select
            label="Domicile"
            fullWidth
            variant="outlined"
            name="domicile"
            value={selectedDomicile}
            onChange={handleDomicileChange}
          >
            {regions.map((region, index) => (
              <MenuItem key={index} value={region}>
                {region}
              </MenuItem>
            ))}
          </TextField>
          <Box
            {...getRootProps()}
            sx={{
              mt: 2, mb: 2, border: '1px dashed grey', padding: 2, textAlign: 'center',
              backgroundColor: isDragActive ? 'lightgrey' : 'inherit',
              cursor: 'pointer'
            }}
          >
            <input {...getInputProps()} onChange={handleFileChange} />
            <InsertDriveFileIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography>Drag & Drop or click to choose file to upload</Typography>
            <Typography variant="caption" display="block">Supported formats: pdf</Typography>
            {file && <Typography variant="caption" display="block">Selected file: {file.name}</Typography>}
          </Box>
        </DialogContent>
        <DialogActions sx={{ mr: 2 }}>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleNewCandidateSubmit}>Create Candidate</Button>
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
      <Dialog open={openEditCandidateDialog} onClose={() => setOpenEditCandidateDialog(false)}>
        <DialogTitle>Edit Candidate</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Full Name"
            fullWidth
            variant="outlined"
            name="name"
            value={editCandidateData.name}
            onChange={handleEditCandidateChange}
          />
          <TextField
            margin="dense"
            label="Email Address"
            fullWidth
            variant="outlined"
            name="email"
            value={editCandidateData.email}
            onChange={handleEditCandidateChange}
          />
          <TextField
            margin="dense"
            select
            label="Domicile"
            fullWidth
            variant="outlined"
            name="domicile"
            value={editCandidateData.domicile}
            onChange={handleEditCandidateChange}
          >
            {regions.map((region, index) => (
              <MenuItem key={index} value={region}>
                {region}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ mr: 2 }}>
          <Button onClick={() => setOpenEditCandidateDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditCandidateSubmit}>Save Changes</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openCVDialog} onClose={handleCVDialogClose} maxWidth="xl" fullWidth>
        <DialogTitle>View CV</DialogTitle>
        <DialogContent>
          <iframe src={cvUrl} width="100%" height="1000px" title="CV Preview" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCVDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TalentPool;
