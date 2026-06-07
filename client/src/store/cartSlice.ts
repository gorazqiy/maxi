import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ICartItem } from "../types/cart";
import { cartApi } from "../api/cartApi";

interface CartState {
   items: ICartItem[];
   loading: boolean;
   error: string | null;
}

const initialState: CartState = {
   items: [],
   loading: false,
   error: null,
};

export const fetchCart = createAsyncThunk(
   "cart/fetchCart",
   async (_, { rejectWithValue }) => {
      try {
         return await cartApi.getCart();
      } catch (error: any) {
         return rejectWithValue("Ошибка загрузки корзины");
      }
   },
);

export const addToCart = createAsyncThunk(
   "cart/addToCart",
   async (
      { product_id, quantity }: { product_id: number; quantity?: number },
      { rejectWithValue },
   ) => {
      try {
         return await cartApi.addToCart(product_id, quantity);
      } catch (error: any) {
         return rejectWithValue(
            error.response?.data?.message || "Ошибка добавления в корзину",
         );
      }
   },
);

export const updateQuantity = createAsyncThunk(
   "cart/updateQuantity",
   async (
      { itemId, quantity }: { itemId: number; quantity: number },
      { rejectWithValue },
   ) => {
      try {
         return await cartApi.updateQuantity(itemId, quantity);
      } catch (error: any) {
         return rejectWithValue("Ошибка обновления количества");
      }
   },
);

export const removeFromCart = createAsyncThunk(
   "cart/removeFromCart",
   async (itemId: number, { rejectWithValue }) => {
      try {
         await cartApi.removeFromCart(itemId);
         return itemId;
      } catch (error: any) {
         return rejectWithValue("Ошибка удаления из корзины");
      }
   },
);

export const clearCart = createAsyncThunk(
   "cart/clearCart",
   async (_, { rejectWithValue }) => {
      try {
         await cartApi.clearCart();
      } catch (error: any) {
         return rejectWithValue("Ошибка очистки корзины");
      }
   },
);

const cartSlice = createSlice({
   name: "cart",
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(fetchCart.pending, (state) => {
            state.loading = true;
         })
         .addCase(fetchCart.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload;
         })
         .addCase(fetchCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
         })
         .addCase(addToCart.fulfilled, (state, action) => {
            const index = state.items.findIndex(
               (item) => item.id === action.payload.id,
            );
            if (index >= 0) {
               state.items[index] = action.payload;
            } else {
               state.items.push(action.payload);
            }
         })
         .addCase(updateQuantity.fulfilled, (state, action) => {
            const index = state.items.findIndex(
               (item) => item.id === action.payload.id,
            );
            if (index >= 0) {
               state.items[index] = action.payload;
            }
         })
         .addCase(removeFromCart.fulfilled, (state, action) => {
            state.items = state.items.filter(
               (item) => item.id !== action.payload,
            );
         })
         .addCase(clearCart.fulfilled, (state) => {
            state.items = [];
         });
   },
});

export default cartSlice.reducer;
