// src/redux/slices/companySlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCompanies } from '../../services/api';

export const fetchCompanies = createAsyncThunk('companies/fetchCompanies', async (_, thunkAPI) => {
  try {
    const response = await getAllCompanies();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const companySlice = createSlice({
  name: 'companies',
  initialState: {
    companies: [],
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ? action.payload.error : action.error.message;
      });
  },
});

export default companySlice.reducer;
