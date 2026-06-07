import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IProduct, IProductFilters } from "../types/product";
import { productsApi } from "../api/productsApi";

interface ProductsState {
   products: IProduct[];
   total: number;
   page: number;
   totalPages: number;
   loading: boolean;
   error: string | null;
   filters: IProductFilters;
}

const initialState: ProductsState = {
   products: [],
   total: 0,
   page: 1,
   totalPages: 1,
   loading: false,
   error: null,
   filters: {},
};

export const fetchProducts = createAsyncThunk(
   "products/fetchProducts",
   async (filters: IProductFilters | undefined, { rejectWithValue }) => {
      try {
         return await productsApi.getProducts(filters);
      } catch (error: any) {
         return rejectWithValue("Ошибка загрузки товаров");
      }
   },
);

const productsSlice = createSlice({
   name: "products",
   initialState,
   reducers: {
      setFilters: (state, action) => {
         state.filters = { ...state.filters, ...action.payload };
      },
      clearFilters: (state) => {
         state.filters = {};
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(fetchProducts.fulfilled, (state, action: any) => {
            state.loading = false;
            state.products = action.payload.products;
            state.total = action.payload.total;
            state.page = action.payload.page;
            state.totalPages = action.payload.totalPages;
         })
         .addCase(fetchProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
         });
   },
});

export const { setFilters, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
