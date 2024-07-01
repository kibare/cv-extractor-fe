"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Container, Typography, Box, Paper, MenuItem, Stepper, Step, StepLabel, CircularProgress, Link } from '@mui/material';
import { fetchCompanies } from '../../redux/slices/companySlice';
import { registerUser } from '../../redux/slices/authSlice';
import { useRouter } from 'next/navigation';

const steps = ['General Information', 'Detail Information'];

const Register = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { status, error } = useSelector((state) => state.auth);
  const { companies } = useSelector((state) => state.companies);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    company_id: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    company_id: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  const validateStep = () => {
    let errors = {};
    if (step === 0) {
      if (!formData.name) errors.name = 'Name is required';
      if (!formData.company_id) errors.company_id = 'Company is required';
      if (!formData.phone) errors.phone = 'Phone number is required';
    } else if (step === 1) {
      if (!formData.email) errors.email = 'Email is required';
      if (formData.email && !formData.email.endsWith('@gmail.com')) errors.email = 'Email must end with @gmail.com';
      if (!formData.password) errors.password = 'Password is required';
      if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFormErrors({
      ...formErrors,
      [name]: '',
    });
  };

  const handleCompanyChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      company_id: parseInt(value, 10),
    });
    setFormErrors({
      ...formErrors,
      company_id: '',
    });
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep()) {
      const result = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(result)) {
        router.push('/login');
      }
    }
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
          Register
        </Typography>
        <Typography variant="body2" align="center" sx={{ mt: 1, mb: 2, color: "#666666" }}>
          Register now to access the system
        </Typography>
        <Stepper activeStep={step} alternativeLabel sx={{ width: '100%', mb: 2 }}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {step === 0 && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={formData.name}
                onChange={handleChange}
                placeholder="Example: Andreas Borjous"
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                select
                id="company_id"
                label="Your Company"
                name="company_id"
                value={formData.company_id}
                onChange={handleCompanyChange}
                placeholder="Select your company"
                error={!!formErrors.company_id}
                helperText={formErrors.company_id}
              >
                {companies.map((company) => (
                  <MenuItem key={company.ID} value={company.ID}>
                    {company.Name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="normal"
                required
                fullWidth
                id="phone"
                label="Phone Number"
                name="phone"
                autoComplete="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+62xxxxxxxxxx"
                error={!!formErrors.phone}
                helperText={formErrors.phone}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ backgroundColor: '#7152F3', '&:hover': { backgroundColor: '#5e42c1' }}}
                >
                  Next
                </Button>
              </Box>
            </>
          )}
          {step === 1 && (
            <>
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
              />
              <TextField
                margin="normal"
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="current-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
              />
              {status === 'loading' && <CircularProgress sx={{ mt: 2 }} />}
              {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{ borderColor: '#7152F3', color: '#7152F3', '&:hover': { borderColor: '#5e42c1', color: '#5e42c1' } }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ backgroundColor: '#7152F3', '&:hover': { backgroundColor: '#5e42c1' } }}
                >
                  Sign Up
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Paper>
      <Typography variant="body2" align="center" sx={{ mt: 2, color: '#666666' }}>
        Already have an account?
      </Typography>
      <Button
        fullWidth
        variant="outlined"
        component={Link} href="/login"
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
        Login
      </Button>
    </Container>
  );
};

export default Register;
