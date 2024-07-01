import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ mt: 5, mb: 3, textAlign: 'center' }}>
      <Typography variant="body2" color="textSecondary">
        ©2022 YourCompanyName
      </Typography>
    </Box>
  );
};

export default Footer;
