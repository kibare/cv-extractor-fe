"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, Grid, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { Work, Place, School, People } from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';
import { getPositionDetails, getCandidatesByPositionId, editPosition, archivePosition, createCandidate, trashPosition } from '@/services/api';
import DataTable from '@/components/common/dataTable';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '@/redux/slices/departmentSlice';
import { fetchPositionDetails, fetchPositions } from '@/redux/slices/positionSlice';
import { fetchAllCandidates } from '@/redux/slices/candidateSlice';
import SearchBar from '@/components/common/searchBar';

const PositionDetails = () => {
  const { positionId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [position, setPosition] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [qualifiedCandidates, setQualifiedCandidates] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    education: '',
    location: '',
    minWorkExp: '',
    description: '',
    qualification: '',
  });
  const [file, setFile] = useState(null);
  const [newCandidateData, setNewCandidateData] = useState({
    name: '',
    email: '',
    domicile: '',
    positionId: positionId,
  });
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedDomicile, setSelectedDomicile] = useState('');
  const allPositions = useSelector((state) => state.positions.positions);
  const departments = useSelector((state) => state.departments.departments);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'application/pdf' });

  useEffect(() => {
    const getPositionDetailsData = async () => {
      try {
        const response = await getPositionDetails(positionId);
        setPosition(response);
        setEditFormData({
          name: response.Name,
          education: response.Education,
          location: response.Location,
          minWorkExp: response.MinWorkExp,
          description: response.Description,
          qualification: response.Qualification,
        });
      } catch (error) {
        console.error('Failed to fetch position details:', error);
      }
    };
    getPositionDetailsData();

    const getCandidatesData = async () => {
      try {
        const response = await getCandidatesByPositionId(positionId);
        setCandidates(response);

        const total = response.length;
        const qualified = response.filter(candidate => candidate.IsQualified).length;
        setTotalCandidates(total);
        setQualifiedCandidates(qualified);
      } catch (error) {
        console.error('Failed to fetch candidates:', error);
      }
    };
    getCandidatesData();
    dispatch(fetchDepartments());
    dispatch(fetchPositions());
    dispatch(fetchAllCandidates());
    dispatch(fetchPositionDetails());
  }, [positionId, dispatch]);

  if (!position) {
    return <Typography>Loading...</Typography>;
  }

  const data = candidates.map(candidate => ({
    id: candidate.ID,
    name: candidate.Name,
    position: candidate.Position.Name,
    department: candidate.Position.Department.Name,
    score: candidate.Score,
    qualified: candidate.IsQualified ? 'Qualified' : 'Not Qualified',
  }));

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleReadMore = (content) => {
    setDialogContent(content);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEditClick = () => {
    setOpenEditDialog(true);
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
      await editPosition(positionId, editFormData);
      setPosition({ ...position, ...editFormData });
      handleEditDialogClose();
    } catch (error) {
      console.error('Failed to edit position:', error);
      alert(error.response.data.message || 'An error occurred. Please try again.');
    }
  };

  const handleArchiveClick = async () => {
    try {
      await archivePosition(positionId);
      router.push('/positions');
    } catch (error) {
      console.error('Failed to archive position:', error);
      alert(error.response.data.message || 'An error occurred. Please try again.');
    }
  };

  const handleDeleteClick = async () => {
    try {
      await trashPosition(positionId);
      router.push('/positions');
    } catch (error) {
      console.error('Failed to trash position:', error);
      alert(error.response.data.message || 'An error occurred. Please try again.');
    }
  };

  const handleAddClick = () => {
    setOpenAddDialog(true);
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
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
      const response = await getCandidatesByPositionId(positionId);
      setCandidates(response);
      setTotalCandidates(response.length);
      setQualifiedCandidates(response.filter(candidate => candidate.IsQualified).length);
      handleAddDialogClose();
    } catch (error) {
      console.error('Failed to create candidate:', error);
      alert(error.response.data.message || 'An error occurred. Please try again.');
    }
  };

  const regions = [
    "Aceh", "Bali", "Banten", "Bengkulu", "DI Yogyakarta", "DKI Jakarta", "Gorontalo",
    "Jambi", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Kalimantan Barat", "Kalimantan Selatan",
    "Kalimantan Tengah", "Kalimantan Timur", "Kalimantan Utara", "Kepulauan Bangka Belitung",
    "Kepulauan Riau", "Lampung", "Maluku", "Maluku Utara", "Nusa Tenggara Barat", "Nusa Tenggara Timur",
    "Papua", "Papua Barat", "Riau", "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tengah", "Sulawesi Tenggara",
    "Sulawesi Utara", "Sumatera Barat", "Sumatera Selatan", "Sumatera Utara"
  ];

  const truncateText = (text, length) => {
    if (text.length <= length) {
      return text;
    }
    return (
      <>
        {text.substring(0, length)}...
        <Button onClick={() => handleReadMore(text)} sx={{ textTransform: 'none', p: 0, m: 0 }}>Read More</Button>
      </>
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>Position Details</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>Positions &gt; {position.Name}</Typography>
          </Box>
          <Box>
            <Button variant="contained" sx={{ mr: 2 }} onClick={handleEditClick}>EDIT POSITION</Button>
            <Button variant="outlined" sx={{ mr: 2 }} onClick={handleArchiveClick}>CLOSE POSITION</Button>
            <Button variant="outlined" onClick={handleDeleteClick}>TRASH POSITION</Button>
          </Box>
        </Box>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Work sx={{ mr: 1 }} />
              <Typography variant="body1">{position.Name}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Work sx={{ mr: 1 }} />
              <Typography variant="body1">{position.MinWorkExp} Years</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <School sx={{ mr: 1 }} />
              <Typography variant="body1">{position.Education}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Place sx={{ mr: 1 }} />
              <Typography variant="body1">{position.Location}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <People sx={{ mr: 1 }} />
              <Typography variant="body1">{totalCandidates} Candidates</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Work sx={{ mr: 1 }} />
              <Typography variant="body1">{qualifiedCandidates} Qualified</Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 2, height: 'auto' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Description</Typography>
              <Typography variant="body2">
                {truncateText(position.Description, 400)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 2, height: 'auto' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Qualification</Typography>
              <Typography variant="body2">
                {truncateText(position.Qualification, 400)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>{position.Name} Candidates</Typography>
          <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} onAddClick={handleAddClick} />
          <DataTable
            data={data}
            page={page}
            rowsPerPage={rowsPerPage}
            emptyRows={emptyRows}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Box>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Details</DialogTitle>
          <DialogContent sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Typography variant="body1">{dialogContent}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
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

        <Dialog open={openAddDialog} onClose={handleAddDialogClose}>
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
              onChange={(event) => setSelectedDepartment(event.target.value)}
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
              onChange={(event) => {
                setSelectedPosition(event.target.value);
                setNewCandidateData({ ...newCandidateData, positionId: event.target.value });
              }}
              disabled={!selectedDepartment}
            >
              {allPositions.filter(position => position.DepartmentID === parseInt(selectedDepartment)).map((position) => (
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
              onChange={(event) => {
                setSelectedDomicile(event.target.value);
                setNewCandidateData({ ...newCandidateData, domicile: event.target.value });
              }}
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
          <DialogActions>
            <Button onClick={handleAddDialogClose}>Cancel</Button>
            <Button variant="contained" onClick={handleNewCandidateSubmit}>Create Candidate</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default PositionDetails;
