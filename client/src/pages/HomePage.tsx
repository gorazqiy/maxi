import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchProducts, setFilters } from "../store/productsSlice";
import { fetchCategories } from "../store/categoriesSlice";
import FilterBar from "../components/FilterBar";
import ProductCard from "../components/ProductCard";
import { IProductFilters } from "../types/product";

const HomePage = () => {
   const dispatch = useAppDispatch();
   const { products, loading, error, filters, total, page, totalPages } =
      useAppSelector((state) => state.products);
   const { categories } = useAppSelector((state) => state.categories);

   useEffect(() => {
      dispatch(fetchCategories());
   }, [dispatch]);

   useEffect(() => {
      dispatch(fetchProducts(filters));
   }, [dispatch, filters]);

   const handleFilterChange = (newFilters: IProductFilters) => {
      dispatch(setFilters(newFilters));
   };

   const handlePageChange = (newPage: number) => {
      dispatch(setFilters({ page: newPage }));
   };

   if (error) {
      return <div className="error">{error}</div>;
   }

   return (
      <div style={styles.home}>
         <div style={styles.sidebar}>
            <FilterBar
               categories={categories}
               filters={filters}
               onFilterChange={handleFilterChange}
            />
         </div>

         <div style={styles.content}>
            <div style={styles.header}>
               <h2>Наши товары</h2>
               <span style={styles.total}>Найдено: {total}</span>
            </div>

            {loading ? (
               <div className="loading">Загрузка товаров...</div>
            ) : products.length === 0 ? (
               <div className="loading">Товары не найдены</div>
            ) : (
               <>
                  <div className="grid">
                     {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                     ))}
                  </div>

                  {totalPages > 1 && (
                     <div style={styles.pagination}>
                        <button
                           onClick={() => handlePageChange(page - 1)}
                           disabled={page <= 1}
                           className="btn-secondary"
                        >
                           Назад
                        </button>
                        <span style={styles.pageInfo}>
                           Страница {page} из {totalPages}
                        </span>
                        <button
                           onClick={() => handlePageChange(page + 1)}
                           disabled={page >= totalPages}
                           className="btn-secondary"
                        >
                           Вперед
                        </button>
                     </div>
                  )}
               </>
            )}
         </div>
      </div>
   );
};

const styles: Record<string, React.CSSProperties> = {
   home: {
      display: "grid",
      gridTemplateColumns: "280px 1fr",
      gap: 30,
      alignItems: "start",
   },
   sidebar: {
      position: "sticky",
      top: 90,
   },
   content: {
      display: "flex",
      flexDirection: "column",
      gap: 20,
   },
   header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
   },
   total: {
      color: "var(--text-light)",
      fontSize: 14,
   },
   pagination: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
      marginTop: 20,
   },
   pageInfo: {
      color: "var(--text-light)",
      fontSize: 14,
   },
};

export default HomePage;
