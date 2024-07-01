"use client";

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Container, Typography, CircularProgress, Link, Box, Paper, IconButton, InputAdornment } from '@mui/material';
import { loginUser } from '../../redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { status, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = () => {
    let isValid = true;

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!email.endsWith('@gmail.com')) {
      setEmailError('Email must end with @gmail.com');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      router.push('/');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Lexend, Arial, sans-serif' }}>
      <Paper 
        elevation={3} 
        sx={{
          padding: 4, 
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ color: "#333333", fontWeight: 'bold' }}>
          Log In
        </Typography>
        <Typography variant="body2" align="center" sx={{ mt: 1, mb: 2, color: "#666666" }}>
          Please login here to access CV Extractor
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email or mobile phone number"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {status === 'loading' && <CircularProgress sx={{ mt: 2 }} />}
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: '#7152F3', '&:hover': { backgroundColor: '#5e42c1' } }}
            disabled={status === 'loading'}
          >
            Log In
          </Button>
        </Box>
      </Paper>
      <Typography variant="body2" align="center" sx={{ mt: 2, color: '#666666' }}>
        Do Not have an account?
      </Typography>
      <Button
        fullWidth
        variant="outlined"
        component={Link} href="/register"
        sx={{ 
          mt: 1, 
          mb: 2, 
          borderColor: '#7152F3', 
          color: '#7152F3', 
          '&:hover': { 
            borderColor: '#5e42c1', 
            backgroundColor: '#f0f0f0' 
          } 
        }}
      >
        Create an Account
      </Button>
    </Container>
  );
};

export default Login;
