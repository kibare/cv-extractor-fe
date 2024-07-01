// src/styles/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Lexend, sans-serif',
    h1: {
      fontWeight: 700, // Bold
    },
    h2: {
      fontWeight: 600, // Semi-Bold
    },
    h3: {
      fontWeight: 500, // Medium
    },
    body1: {
      fontWeight: 400, // Regular
    },
    body2: {
      fontWeight: 300, // Light
    },
  },
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: '#ff0000',
    },
  },
});

export default theme;
