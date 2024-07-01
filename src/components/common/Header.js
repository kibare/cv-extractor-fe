import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, TextField, InputAdornment, Box, Container } from '@mui/material';
import Link from 'next/link';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => (
  <AppBar position="static" color="transparent" elevation={0} sx={{ padding: '10px 20px' }}>
    <Toolbar sx={{ justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <img src="/next.svg" alt="Logo" style={{ width: "80px" }} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: "30px" }}>
        <Button color="inherit" component={Link} href="/">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} href="/talent-pool">
          Talent Pool
        </Button>
        <Button color="inherit" component={Link} href="/candidates">
          Candidates
        </Button>
        <Button color="inherit" component={Link} href="/archive">
          Archive
        </Button>
        <Button color="inherit" component={Link} href="/trash">
          Trash
        </Button>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton color="inherit" component={Link} href="/settings">
          <SettingsIcon />
        </IconButton>
        <IconButton color="inherit" component={Link} href="/profile">
          <AccountCircleIcon />
        </IconButton>
      </Box>
    </Toolbar>
    {/* <Container sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <TextField
        variant="outlined"
        placeholder="Search"
        size="small"
        sx={{ width: '50%' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          sx: { borderRadius: '50px', backgroundColor: '#f5f5f5', padding: '5px 10px' }
        }}
      />
    </Container> */}
  </AppBar>
);

export default Header;
