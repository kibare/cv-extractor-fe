// src/redux/slices/departmentSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllDepartmens } from '../../services/api';

export const fetchDepartments = createAsyncThunk('departments/fetchDepartments', async (_, thunkAPI) => {
  try {
    const response = await getAllDepartmens();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const departmentSlice = createSlice({
  name: 'departments',
  initialState: {
    departments: [],
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ? action.payload.error : action.error.message;
      });
  },
});

export default departmentSlice.reducer;
