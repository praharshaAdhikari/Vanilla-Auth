import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginCall, registerCall } from './apiCalls';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

export const loginThunk = createAsyncThunk('auth/login', async (loginData, thunkAPI) => {
  try {
    return await loginCall(loginData);
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response.data.message);
  };
});

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  return await localStorage.removeItem('user');
});

export const registerThunk = createAsyncThunk('auth/register', async (registerData, thunkAPI) => {
  try {
    return await registerCall(registerData);
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response.data.message);
  }
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.isLoading = false,
        state.isSuccess = false,
        state.isError = false,
        state.message = ''
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
  }
});

export const { resetAuth } = authSlice.actions
export default authSlice.reducer