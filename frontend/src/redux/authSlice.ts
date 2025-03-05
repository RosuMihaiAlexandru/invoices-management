import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define a type for the expected response from the API
interface LoginResponse {
  access_token: string;
}

export const loginUser = createAsyncThunk<
  LoginResponse, // The expected return type
  { email: string; password: string }, // The argument type
  { rejectValue: string } // The rejection type
>(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", { email, password });
      
      // Save the token to localStorage
      localStorage.setItem("access_token", response.data.access_token);

      return response.data; // Ensures TypeScript knows this returns { access_token: string }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    access_token: localStorage.getItem("access_token") || null,
    error: null as string | null,
    status: "idle",
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("access_token");
      state.access_token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.status = "succeeded";
        state.access_token = action.payload.access_token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = "failed";
        state.error = action.payload ?? "An error occurred";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
