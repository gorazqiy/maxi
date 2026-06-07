import axiosInstance from "./axiosInstance";
import {
   IProduct,
   IProductsResponse,
   IProductFilters,
   ICategory,
} from "../types/product";

export const productsApi = {
   getProducts: async (
      filters?: IProductFilters,
   ): Promise<IProductsResponse> => {
      const params = new URLSearchParams();
      if (filters?.categoryId)
         params.append("categoryId", String(filters.categoryId));
      if (filters?.minPrice)
         params.append("minPrice", String(filters.minPrice));
      if (filters?.maxPrice)
         params.append("maxPrice", String(filters.maxPrice));
      if (filters?.sort) params.append("sort", filters.sort);
      if (filters?.search) params.append("search", filters.search);
      if (filters?.page) params.append("page", String(filters.page));
      if (filters?.limit) params.append("limit", String(filters.limit));

      const response = await axiosInstance.get(
         `/products?${params.toString()}`,
      );
      return response.data;
   },

   getProductById: async (id: number): Promise<IProduct> => {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
   },

   getCategories: async (): Promise<ICategory[]> => {
      const response = await axiosInstance.get("/categories");
      return response.data;
   },

   getCategoryById: async (id: number): Promise<ICategory> => {
      const response = await axiosInstance.get(`/categories/${id}`);
      return response.data;
   },
};
