import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authorizedDataCall } from "./apiCalls";

const initialState = {
  data: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

export const dataFetchThunk = createAsyncThunk('data/fetch', async (token, thunkAPI) => {
  try {
    return await authorizedDataCall(token);
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response.data.message);
  }
})

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    resetData: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(dataFetchThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(dataFetchThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(dataFetchThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
  }
});

export const { resetData } = dataSlice.actions
export default dataSlice.reducer