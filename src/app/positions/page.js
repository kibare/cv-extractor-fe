"use client";

import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, TextField, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, IconButton, Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '../../redux/slices/departmentSlice';
import { fetchCompanies } from '../../redux/slices/companySlice';
import { createDepartment, editDepartment, deleteDepartment, createPosition } from '../../services/api';

const Positions = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const { departments, status, error } = useSelector((state) => state.departments);
  const { companies } = useSelector((state) => state.companies);
  const [openModal, setOpenModal] = useState(false);
  const [openPositionModal, setOpenPositionModal] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    company_id: ''
  });
  const [positionFormData, setPositionFormData] = useState({
    name: '',
    education: '',
    location: '',
    minWorkExp: '',
    description: '',
    qualification: '',
    departmentId: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchCompanies());
  }, [dispatch]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePositionClick = (positionId) => {
    router.push(`/position_details/${positionId}`);
  };

  const handleOpenModal = () => {
    setIsEditing(false);
    setFormData({
      id: '',
      name: '',
      company_id: ''
    });
    setOpenModal(true);
  };

  const handleOpenPositionModal = (departmentId) => {
    setPositionFormData({
      name: '',
      education: '',
      location: '',
      minWorkExp: '',
      description: '',
      qualification: '',
      departmentId: departmentId
    });
    setOpenPositionModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleEditOpenModal = (department) => {
    setIsEditing(true);
    setFormData({
      id: department.ID,
      name: department.Name,
      company_id: department.CompanyID
    });
    setOpenModal(true);
  };

  const handleClosePositionModal = () => {
    setOpenPositionModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePositionChange = (e) => {
    const { name, value } = e.target;
    setPositionFormData({
      ...positionFormData,
      [name]: name === 'minWorkExp' ? parseInt(value, 10) : value,
    });
  };

  const handlePositionSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPosition(positionFormData);
      dispatch(fetchDepartments());
      handleClosePositionModal();
    } catch (error) {
      console.error('Failed to create position:', error);
      alert(error.response.data.message || 'An error occurred. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await editDepartment(formData);
      } else {
        await createDepartment(formData);
      }
      dispatch(fetchDepartments());
      handleCloseModal();
    } catch (error) {
      console.error('Failed to create/edit department:', error);
      alert(error.response.data.message || 'An error occurred. Please try again.');
    }
  };
  
  const handleDelete = async () => {
    try {
      await deleteDepartment(formData.id);
      dispatch(fetchDepartments());
      handleCloseModal();
    } catch (error) {
      console.error('Failed to delete department:', error);
      alert(error.response.data.message || 'An error occurred. Please try again.');
    }
  };
  

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Container component="main" maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>Positions</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>List of Positions in Departments</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <TextField 
              label="Search Position" 
              variant="outlined" 
              value={searchTerm} 
              onChange={handleSearchChange} 
              sx={{ width: '75%' }} 
            />
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenModal}>
              Add Department
            </Button>
          </Box>
          {status === 'loading' && <Typography>Loading...</Typography>}
          {error && <Typography color="error">{error}</Typography>}
          {departments.map((department, index) => (
            <Paper elevation={3} sx={{ mb: 2 }} key={index}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                  sx={{ alignItems: 'center', height: "10vh" }}
                >
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    {department.Name}
                    <IconButton size="small" sx={{ ml: 1 }} onClick={() => handleEditOpenModal(department)}>
                      <EditIcon />
                    </IconButton>
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                    <IconButton size="small" sx={{ mr: 1 }} onClick={() => handleOpenPositionModal(department.ID)}>
                      <AddIcon />
                    </IconButton>
                    <Chip label={`${department.Positions ? department.Positions.length : 0} positions`} />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {department.Positions && department.Positions.map((position) => (
                      <ListItem key={position.ID} button onClick={() => handlePositionClick(position.ID)}>
                        <ListItemText primary={position.Name} />
                        <IconButton>
                          <ArrowForwardIosIcon fontSize="small" />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </Paper>
          ))}
        </Container>
      </Box>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{isEditing ? "Edit Department" : "Add New Department"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            required
            fullWidth
            id="name"
            label="Department Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            margin="dense"
            required
            fullWidth
            select
            disabled
            id="company_id"
            label="Company"
            name="company_id"
            value={formData.company_id}
            onChange={handleChange}
            variant="outlined"
          >
            {companies.map((company) => (
              <MenuItem key={company.ID} value={company.ID}>
                {company.Name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          {isEditing && (
            <Button onClick={handleDelete} color="error">Delete</Button>
          )}
          <Button onClick={handleSubmit} variant="contained">{isEditing ? "Edit" : "Add"}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openPositionModal} onClose={handleClosePositionModal}>
        <DialogTitle>Add New Position</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            required
            fullWidth
            id="name"
            label="Position Name"
            name="name"
            value={positionFormData.name}
            onChange={handlePositionChange}
            variant="outlined"
          />
          <TextField
            margin="dense"
            required
            fullWidth
            id="education"
            label="Education"
            name="education"
            value={positionFormData.education}
            onChange={handlePositionChange}
            variant="outlined"
          />
          <TextField
            margin="dense"
            required
            fullWidth
            id="location"
            label="Location"
            name="location"
            value={positionFormData.location}
            onChange={handlePositionChange}
            variant="outlined"
          />
          <TextField
            margin="dense"
            required
            fullWidth
            id="minWorkExp"
            label="Minimum Work Experience"
            name="minWorkExp"
            type="number"
            value={positionFormData.minWorkExp}
            onChange={handlePositionChange}
            variant="outlined"
          />
          <TextField
            margin="dense"
            required
            fullWidth
            id="description"
            label="Description"
            name="description"
            value={positionFormData.description}
            onChange={handlePositionChange}
            variant="outlined"
          />
          <TextField
            margin="dense"
            required
            fullWidth
            id="qualification"
            label="Qualification"
            name="qualification"
            value={positionFormData.qualification}
            onChange={handlePositionChange}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePositionModal}>Cancel</Button>
          <Button onClick={handlePositionSubmit} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Positions;