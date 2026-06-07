import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ICategory } from "../types/product";
import { productsApi } from "../api/productsApi";

interface CategoriesState {
   categories: ICategory[];
   selectedCategory: ICategory | null;
   loading: boolean;
   error: string | null;
}

const initialState: CategoriesState = {
   categories: [],
   selectedCategory: null,
   loading: false,
   error: null,
};

export const fetchCategories = createAsyncThunk(
   "categories/fetchCategories",
   async (_, { rejectWithValue }) => {
      try {
         return await productsApi.getCategories();
      } catch (error: any) {
         return rejectWithValue("Ошибка загрузки категорий");
      }
   },
);

export const fetchCategoryById = createAsyncThunk(
   "categories/fetchCategoryById",
   async (id: number, { rejectWithValue }) => {
      try {
         return await productsApi.getCategoryById(id);
      } catch (error: any) {
         return rejectWithValue("Ошибка загрузки категории");
      }
   },
);

const categoriesSlice = createSlice({
   name: "categories",
   initialState,
   reducers: {
      clearSelectedCategory: (state) => {
         state.selectedCategory = null;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchCategories.pending, (state) => {
            state.loading = true;
         })
         .addCase(fetchCategories.fulfilled, (state, action) => {
            state.loading = false;
            state.categories = action.payload;
         })
         .addCase(fetchCategories.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
         })
         .addCase(fetchCategoryById.fulfilled, (state, action) => {
            state.selectedCategory = action.payload;
         });
   },
});

export const { clearSelectedCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
