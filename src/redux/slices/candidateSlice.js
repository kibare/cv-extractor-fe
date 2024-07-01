// src/redux/slices/candidateSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCandidates, getCandidatesByFilters } from '../../services/api';

export const fetchAllCandidates = createAsyncThunk('candidates/fetchAllCandidates', async (_, thunkAPI) => {
  try {
    const response = await getAllCandidates();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const fetchCandidatesByFilters = createAsyncThunk('candidates/fetchCandidatesByFilters', async (filters, thunkAPI) => {
  try {
    const response = await getCandidatesByFilters(filters);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const candidateSlice = createSlice({
  name: 'candidates',
  initialState: {
    candidates: [],
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCandidates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllCandidates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.candidates = action.payload;
      })
      .addCase(fetchAllCandidates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ? action.payload.error : action.error.message;
      })
      .addCase(fetchCandidatesByFilters.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCandidatesByFilters.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.candidates = action.payload;
      })
      .addCase(fetchCandidatesByFilters.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ? action.payload.error : action.error.message;
      });
  },
});

export default candidateSlice.reducer;
