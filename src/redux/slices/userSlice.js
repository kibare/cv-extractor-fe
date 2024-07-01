import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserData } from '@/services/api'; // Assuming you have an API function to get user data

export const fetchUserData = createAsyncThunk('user/fetchUserData', async () => {
    const response = await getUserData();
    return response;
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
