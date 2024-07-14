"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { fetchUserData } from '@/redux/slices/userSlice'; // Assuming you have a slice to fetch user data
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
  const user = useSelector((state) => state.user.user); // Assuming you have a user slice and state

  useEffect(() => {
    dispatch(fetchUserData()); // Fetch user data after component mounts
  }, [dispatch]);

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
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              label="Enter Your Email"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              label="Enter Your Phone"
              fullWidth
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleDialogClose} variant="contained">Edit</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openChangePasswordDialog} onClose={handleChangePassword}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Enter Your New Password"
              fullWidth
              variant="outlined"
              type="password"
            />
            <TextField
              margin="dense"
              label="Confirm Your Password"
              fullWidth
              variant="outlined"
              type="password"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleDialogClose} variant="contained">Edit</Button>
          </DialogActions>
        </Dialog>
      </SidebarContainer>
    </Box>
  );
};

export default Sidebar;
