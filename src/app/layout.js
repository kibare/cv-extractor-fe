// src/app/layout.js
"use client";

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import theme from '../styles/theme';
import Sidebar from '@/components/common/sidebar';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const showSidebar = pathname !== '/register' && pathname !== '/login';

  return (
    <Provider store={store}>
      <html lang="en">
        <head>
        <title>CV Extractor System</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap" rel="stylesheet" />
        </head>
        <body>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex' }}>
              {showSidebar && <Sidebar />}
              <Box sx={{ flexGrow: 1, p: 3 }}>
                {children}
              </Box>
            </Box>
          </ThemeProvider>
        </body>
      </html>
    </Provider>
  );
}
