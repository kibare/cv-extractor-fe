import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllPositions, archivePosition as archivePositionAPI, fetchArchivedPositions as fetchArchivedPositionsAPI } from '@/services/api';

export const fetchPositions = createAsyncThunk('positions/fetchPositions', async () => {
  const response = await getAllPositions();
  return response;
});

export const fetchArchivedPositions = createAsyncThunk('positions/fetchArchivedPositions', async () => {
  const response = await fetchArchivedPositionsAPI();
  return response;
});

const positionSlice = createSlice({
  name: 'positions',
  initialState: {
    positions: [],
    archivedPositions: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPositions.fulfilled, (state, action) => {
        state.positions = action.payload.filter(position => !position.IsArchive);
      })
      .addCase(fetchArchivedPositions.fulfilled, (state, action) => {
        state.archivedPositions = action.payload;
      });
  },
});

export default positionSlice.reducer;
