import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IUser, ILoginData, IRegisterData } from "../types/user";
import { authApi } from "../api/authApi";

interface AuthState {
   user: IUser | null;
   token: string | null;
   loading: boolean;
   error: string | null;
}

const initialState: AuthState = {
   user: null,
   token: localStorage.getItem("token"),
   loading: false,
   error: null,
};

export const login = createAsyncThunk(
   "auth/login",
   async (data: ILoginData, { rejectWithValue }) => {
      try {
         const response = await authApi.login(data);
         localStorage.setItem("token", response.token);
         return response;
      } catch (error: any) {
         return rejectWithValue(
            error.response?.data?.message || "Ошибка авторизации",
         );
      }
   },
);

export const register = createAsyncThunk(
   "auth/register",
   async (data: IRegisterData, { rejectWithValue }) => {
      try {
         const response = await authApi.register(data);
         localStorage.setItem("token", response.token);
         return response;
      } catch (error: any) {
         return rejectWithValue(
            error.response?.data?.message || "Ошибка регистрации",
         );
      }
   },
);

export const fetchUser = createAsyncThunk(
   "auth/fetchUser",
   async (_, { rejectWithValue }) => {
      try {
         return await authApi.getMe();
      } catch (error: any) {
         localStorage.removeItem("token");
         return rejectWithValue("Не удалось загрузить профиль");
      }
   },
);

export const updateProfile = createAsyncThunk(
   "auth/updateProfile",
   async (data: Partial<IUser>, { rejectWithValue }) => {
      try {
         return await authApi.updateProfile(data);
      } catch (error: any) {
         return rejectWithValue(
            error.response?.data?.message || "Ошибка обновления профиля",
         );
      }
   },
);

const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      logout: (state) => {
         state.user = null;
         state.token = null;
         localStorage.removeItem("token");
      },
      clearError: (state) => {
         state.error = null;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
         })
         .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
         })
         .addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
         })
         .addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
         })
         .addCase(fetchUser.fulfilled, (state, action) => {
            state.user = action.payload;
         })
         .addCase(fetchUser.rejected, (state) => {
            state.user = null;
            state.token = null;
         })
         .addCase(updateProfile.fulfilled, (state, action) => {
            state.user = action.payload;
         });
   },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
