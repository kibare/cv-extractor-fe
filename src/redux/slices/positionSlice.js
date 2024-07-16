import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllPositions, getPositionDetails as fetchPositionDetailsAPI, archivePosition as archivePositionAPI, fetchArchivedPositions as fetchArchivedPositionsAPI } from '@/services/api';

export const fetchPositions = createAsyncThunk('positions/fetchPositions', async () => {
  const response = await getAllPositions();
  return response;
});

export const fetchArchivedPositions = createAsyncThunk('positions/fetchArchivedPositions', async () => {
  const response = await fetchArchivedPositionsAPI();
  return response;
});

export const fetchPositionDetails = createAsyncThunk('positions/fetchPositionDetails', async (positionId) => {
  const response = await fetchPositionDetailsAPI(positionId);
  return response;
});

const positionSlice = createSlice({
  name: 'positions',
  initialState: {
    positions: [],
    archivedPositions: [],
    positionDetails: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPositions.fulfilled, (state, action) => {
        state.positions = action.payload.filter(position => !position.IsArchive);
      })
      .addCase(fetchArchivedPositions.fulfilled, (state, action) => {
        state.archivedPositions = action.payload;
      })
      .addCase(fetchPositionDetails.fulfilled, (state, action) => {
        state.positionDetails = action.payload;
      });
  },
});

export default positionSlice.reducer;
