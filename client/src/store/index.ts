import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import productsReducer from "./productsSlice";
import categoriesReducer from "./categoriesSlice";

export const store = configureStore({
   reducer: {
      auth: authReducer,
      cart: cartReducer,
      products: productsReducer,
      categories: categoriesReducer,
   },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
