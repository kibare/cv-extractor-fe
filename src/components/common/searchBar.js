import React from 'react';
import { Box, TextField, IconButton, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

const SearchBar = ({ searchTerm, onSearchChange, onAddClick, hideAddButton }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <TextField 
        fullWidth 
        label="Search" 
        placeholder="Name, email, etc..." 
        value={searchTerm} 
        onChange={onSearchChange} 
        sx={{ width: "50%", mr: 2 }} 
      />
      <Box>
        <IconButton>
          <FilterListIcon />
        </IconButton>
        {!hideAddButton && (
          <Button variant="contained" sx={{ ml: 2 }} onClick={onAddClick}>ADD NEW CANDIDATE</Button>
        )}
      </Box>
    </Box>
  );
};

export default SearchBar;
