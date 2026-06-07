export interface ICategory {
   id: number;
   name: string;
   description: string;
   image: string;
   products?: IProduct[];
}

export interface IProduct {
   id: number;
   name: string;
   description: string;
   composition: string;
   price: number;
   category_id: number;
   category?: ICategory;
   images?: IProductImage[];
   created_at: string;
}

export interface IProductImage {
   id: number;
   product_id: number;
   image_url: string;
   sort_order: number;
}

export interface IProductsResponse {
   products: IProduct[];
   total: number;
   page: number;
   totalPages: number;
}

export interface IProductFilters {
   categoryId?: number;
   minPrice?: number;
   maxPrice?: number;
   sort?: "price_asc" | "price_desc" | "name";
   search?: string;
   page?: number;
   limit?: number;
}
