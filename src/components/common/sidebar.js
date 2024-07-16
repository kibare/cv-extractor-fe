"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { fetchUserData } from '@/redux/slices/userSlice'; // Assuming you have a slice to fetch user data
import { updateUserProfile, changeUserPassword } from '@/services/api'; // Import API functions for updating user profile and changing password
import { Typography, List, ListItem, ListItemIcon, ListItemText, Box, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InboxIcon from '@mui/icons-material/Inbox';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const SidebarContainer = styled('div')(({ theme, open }) => ({
  width: open ? 280 : 0,
  flexShrink: 0,
  backgroundColor: '#FAFAFA',
  display: 'flex',
  flexDirection: 'column',
  padding: open ? theme.spacing(2) : 0,
  height: '95vh',
  position: 'sticky',
  top: 0,
  margin: "20px 0px 0px 20px",
  borderRadius: "20px",
  transition: 'width 0.3s ease, padding 0.3s ease',
  overflow: 'hidden',
}));

const SidebarContent = styled('div')(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  marginBottom: theme.spacing(2),
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#F3F1F9',
  },
}));

const SidebarToggle = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 20,
  left: 20,
}));

const Header = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const Sidebar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editProfileData, setEditProfileData] = useState({ name: '', email: '', phone: '' });
  const [changePasswordData, setChangePasswordData] = useState({ password: '', confirmPassword: '' });
  const user = useSelector((state) => state.user.user); // Assuming you have a user slice and state

  useEffect(() => {
    dispatch(fetchUserData()); // Fetch user data after component mounts
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setEditProfileData({ name: user.Name, email: user.Email, phone: user.Phone });
    }
  }, [user]);

  const handleNavigation = (path) => {
    router.push(path);
  };

  const isActive = (path) => pathname === path;

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditProfile = () => {
    handleMenuClose();
    setOpenDialog(true);
  };

  const handleChangePassword = () => {
    handleMenuClose();
    setOpenChangePasswordDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setOpenChangePasswordDialog(false);
  };

  const handleLogout = () => {
    handleMenuClose();
    dispatch(logout());
    router.push('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setEditProfileData({ ...editProfileData, [name]: value });
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setChangePasswordData({ ...changePasswordData, [name]: value });
  };

  const handleProfileUpdate = async () => {
    try {
      await updateUserProfile(editProfileData);
      dispatch(fetchUserData());
      handleDialogClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert(error.response.data.message || 'An error occurred. Please try again.');
    }
  };

  const handlePasswordChange = async () => {
    if (changePasswordData.password !== changePasswordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await changeUserPassword({ password: changePasswordData.password });
      handleDialogClose();
    } catch (error) {
      console.error('Failed to change password:', error);
      alert(error.response.data.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {!sidebarOpen && (
        <SidebarToggle onClick={toggleSidebar}>
          <MenuIcon />
        </SidebarToggle>
      )}
      <SidebarContainer open={sidebarOpen}>
        <Header>
          <Typography variant="h6" sx={{ textAlign: 'left', fontWeight: 'bold' }}>CV Extractor</Typography>
          <IconButton onClick={toggleSidebar}>
            <CloseIcon />
          </IconButton>
        </Header>
        <SidebarContent>
          <List>
            <StyledListItem
              button
              onClick={() => handleNavigation('/')}
              sx={{
                backgroundColor: isActive('/') ? '#F3F1F9' : 'inherit',
                borderLeft: isActive('/') ? '3px solid #7152F2' : 'none',
                color: isActive('/') ? '#7152F3' : ''
              }}
            >
              <ListItemIcon sx={{ color: isActive('/') ? '#7152F3' : '' }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </StyledListItem>
            <StyledListItem
              button
              onClick={() => handleNavigation('/talent-pool')}
              sx={{
                backgroundColor: isActive('/talent-pool') ? '#F3F1F9' : 'inherit',
                borderLeft: isActive('/talent-pool') ? '3px solid #7152F2' : 'none',
                color: isActive('/talent-pool') ? '#7152F3' : ''
              }}
            >
              <ListItemIcon sx={{ color: isActive('/talent-pool') ? '#7152F3' : '' }}>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText primary="Talent Pool" />
            </StyledListItem>
            <StyledListItem
              button
              onClick={() => handleNavigation('/positions')}
              sx={{
                backgroundColor: isActive('/positions') ? '#F3F1F9' : 'inherit',
                borderLeft: isActive('/positions') ? '3px solid #7152F2' : 'none',
                color: isActive('/positions') ? '#7152F3' : ''
              }}
            >
              <ListItemIcon sx={{ color: isActive('/positions') ? '#7152F3' : '' }}>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Positions" />
            </StyledListItem>
            <StyledListItem
              button
              onClick={() => handleNavigation('/archive')}
              sx={{
                backgroundColor: isActive('/archive') ? '#F3F1F9' : 'inherit',
                borderLeft: isActive('/archive') ? '3px solid #7152F2' : 'none',
                color: isActive('/archive') ? '#7152F3' : ''
              }}
            >
              <ListItemIcon sx={{ color: isActive('/archive') ? '#7152F3' : '' }}>
                <ArchiveIcon />
              </ListItemIcon>
              <ListItemText primary="Archive" />
            </StyledListItem>
            <StyledListItem
              button
              onClick={() => handleNavigation('/trash')}
              sx={{
                backgroundColor: isActive('/trash') ? '#F3F1F9' : 'inherit',
                borderLeft: isActive('/trash') ? '3px solid #7152F2' : 'none',
                color: isActive('/trash') ? '#7152F3' : ''
              }}
            >
              <ListItemIcon sx={{ color: isActive('/trash') ? '#7152F3' : '' }}>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText primary="Trash" />
            </StyledListItem>
          </List>
        </SidebarContent>
        <Box sx={{ mt: 'auto' }}>
          <List>
            <StyledListItem
              button
              onClick={handleProfileClick}
              sx={{
                backgroundColor: isActive('/profile') ? '#F3F1F9' : 'inherit',
                borderLeft: isActive('/profile') ? '3px solid #7152F2' : 'none',
                color: isActive('/profile') ? '#7152F3' : ''
              }}
            >
              <ListItemIcon sx={{ color: isActive('/profile') ? '#7152F3' : '' }}>
                <AccountBoxIcon />
              </ListItemIcon>
              <ListItemText primary={user ? user.Name : 'Profile'} />
            </StyledListItem>
          </List>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
          <MenuItem onClick={handleChangePassword}>Change Password</MenuItem>
          <MenuItem onClick={handleLogout}>Log Out</MenuItem>
        </Menu>
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Enter Your Name"
              name="name"
              fullWidth
              variant="outlined"
              value={editProfileData.name}
              onChange={handleProfileInputChange}
            />
            <TextField
              margin="dense"
              label="Enter Your Email"
              name="email"
              fullWidth
              variant="outlined"
              value={editProfileData.email}
              onChange={handleProfileInputChange}
            />
            <TextField
              margin="dense"
              label="Enter Your Phone"
              name="phone"
              fullWidth
              variant="outlined"
              value={editProfileData.phone}
              onChange={handleProfileInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleProfileUpdate} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openChangePasswordDialog} onClose={handleChangePassword}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Enter Your New Password"
              name="password"
              fullWidth
              variant="outlined"
              type="password"
              value={changePasswordData.password}
              onChange={handlePasswordInputChange}
            />
            <TextField
              margin="dense"
              label="Confirm Your Password"
              name="confirmPassword"
              fullWidth
              variant="outlined"
              type="password"
              value={changePasswordData.confirmPassword}
              onChange={handlePasswordInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handlePasswordChange} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </SidebarContainer>
    </Box>
  );
};

export default Sidebar;
