// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, register } from '@/services/api';

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, thunkAPI) => {
  try {
    const response = await login(credentials);
    localStorage.setItem('token', response.token);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (data, thunkAPI) => {
  try {
    const response = await register(data);
    localStorage.setItem('token', response.token);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    company: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.company = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.company = action.payload.company;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.company = action.payload.company;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
