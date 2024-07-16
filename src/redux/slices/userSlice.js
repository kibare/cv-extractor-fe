import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserData, updateUserProfile, changeUserPassword } from '@/services/api'; // Import API functions

export const fetchUserData = createAsyncThunk('user/fetchUserData', async () => {
    const response = await getUserData();
    return response;
});

export const updateUserProfileAsync = createAsyncThunk('user/updateUserProfile', async (profileData) => {
    const response = await updateUserProfile(profileData);
    return response;
});

export const changeUserPasswordAsync = createAsyncThunk('user/changeUserPassword', async (passwordData) => {
    const response = await changeUserPassword(passwordData);
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
      })
      .addCase(updateUserProfileAsync.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(changeUserPasswordAsync.fulfilled, (state) => {
        state.status = 'succeeded';
      });
  },
});

export default userSlice.reducer;
