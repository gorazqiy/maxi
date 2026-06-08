import { useState } from "react";
import { ICategory } from "../types/product";
import { IProductFilters } from "../types/product";

interface FilterBarProps {
   categories: ICategory[];
   filters: IProductFilters;
   onFilterChange: (filters: IProductFilters) => void;
}

const FilterBar = ({ categories, filters, onFilterChange }: FilterBarProps) => {
   const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() || "");
   const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() || "");

   const handleCategoryChange = (categoryId: number | undefined) => {
      onFilterChange({ ...filters, categoryId, page: 1 });
   };

   const handlePriceFilter = () => {
      onFilterChange({
         ...filters,
         minPrice: minPrice ? Number(minPrice) : undefined,
         maxPrice: maxPrice ? Number(maxPrice) : undefined,
         page: 1,
      });
   };

   const handleSortChange = (sort: string) => {
      onFilterChange({
         ...filters,
         sort: sort as IProductFilters["sort"],
         page: 1,
      });
   };

   const handleSearch = (search: string) => {
      onFilterChange({ ...filters, search, page: 1 });
   };

   const clearFilters = () => {
      setMinPrice("");
      setMaxPrice("");
      onFilterChange({});
   };

   return (
      <div style={styles.filterBar}>
         <input
            type="text"
            placeholder="Поиск товаров..."
            value={filters.search || ""}
            onChange={(e) => handleSearch(e.target.value)}
            style={styles.searchInput}
         />

         <div style={styles.filterGroup}>
            <h4>Категории</h4>
            <button
               onClick={() => handleCategoryChange(undefined)}
               style={{
                  ...styles.categoryBtn,
                  ...(!filters.categoryId ? styles.activeBtn : {}),
               }}
            >
               Все
            </button>
            {categories.map((cat) => (
               <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  style={{
                     ...styles.categoryBtn,
                     ...(filters.categoryId === cat.id ? styles.activeBtn : {}),
                  }}
               >
                  {cat.name}
               </button>
            ))}
         </div>

         <div style={styles.filterGroup}>
            <h4>Цена</h4>
            <div style={styles.priceInputs}>
               <input
                  type="number"
                  placeholder="От"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={styles.priceInput}
               />
               <span style={styles.priceSeparator}>-</span>
               <input
                  type="number"
                  placeholder="До"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={styles.priceInput}
               />
               <button
                  onClick={handlePriceFilter}
                  className="btn-primary"
                  style={styles.priceBtn}
               >
                  OK
               </button>
            </div>
         </div>

         <div style={styles.filterGroup}>
            <h4>Сортировка</h4>
            <select
               value={filters.sort || ""}
               onChange={(e) => handleSortChange(e.target.value)}
               style={styles.select}
            >
               <option value="">По умолчанию</option>
               <option value="price_asc">Цена: по возрастанию</option>
               <option value="price_desc">Цена: по убыванию</option>
               <option value="name">По названию</option>
            </select>
         </div>

         <button
            onClick={clearFilters}
            className="btn-secondary"
            style={styles.clearBtn}
         >
            Сбросить фильтры
         </button>
      </div>
   );
};

const styles: Record<string, React.CSSProperties> = {
   filterBar: {
      backgroundColor: "var(--white)",
      padding: 20,
      borderRadius: "var(--radius)",
      boxShadow: "var(--shadow)",
      display: "flex",
      flexDirection: "column",
      gap: 15,
   },
   searchInput: {
      padding: 10,
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      fontSize: 14,
   },
   filterGroup: {
      display: "flex",
      flexDirection: "column",
      gap: 5,
   },
   categoryBtn: {
      padding: "8px 12px",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      backgroundColor: "var(--white)",
      cursor: "pointer",
      textAlign: "left",
      fontSize: 14,
      outline: "none",
   },
   activeBtn: {
      backgroundColor: "var(--primary)",
      color: "var(--white)",
      borderColor: "var(--primary)",
   },
   priceInputs: {
      display: "flex",
      alignItems: "center",
      gap: 5,
   },
   priceInput: {
      width: 70,
      padding: 8,
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      fontSize: 14,
   },
   priceSeparator: {
      color: "var(--text-light)",
   },
   priceBtn: {
      padding: "8px 12px",
      fontSize: 14,
   },
   select: {
      padding: 8,
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      fontSize: 14,
   },
   clearBtn: {
      width: "100%",
      padding: 10,
      fontSize: 14,
   },
};

export default FilterBar;
