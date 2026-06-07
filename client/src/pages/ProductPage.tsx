import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { productsApi } from "../api/productsApi";
import { useAppDispatch, useAppSelector } from "../store";
import { addToCart } from "../store/cartSlice";
import ImageSlider from "../components/ImageSlider";
import { IProduct } from "../types/product";

const ProductPage = () => {
   const { id } = useParams<{ id: string }>();
   const dispatch = useAppDispatch();
   const { token } = useAppSelector((state) => state.auth);
   const [product, setProduct] = useState<IProduct | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [addedToCart, setAddedToCart] = useState(false);

   useEffect(() => {
      const loadProduct = async () => {
         try {
            setLoading(true);
            const data = await productsApi.getProductById(Number(id));
            setProduct(data);
         } catch (err) {
            setError("Ошибка загрузки товара");
         } finally {
            setLoading(false);
         }
      };
      loadProduct();
   }, [id]);

   const handleAddToCart = () => {
      if (!token) {
         window.location.href = "/login";
         return;
      }

      if (product) {
         dispatch(addToCart({ product_id: product.id }));
         setAddedToCart(true);
         setTimeout(() => setAddedToCart(false), 2000);
      }
   };

   if (loading) {
      return <div className="loading">Загрузка товара...</div>;
   }

   if (error || !product) {
      return <div className="error">{error || "Товар не найден"}</div>;
   }

   return (
      <div>
         <Link to="/" style={styles.backLink}>
            &#8592; Назад к товарам
         </Link>

         <div style={styles.productPage}>
            <div style={styles.sliderSection}>
               <ImageSlider
                  images={product.images || []}
                  productName={product.name}
               />
            </div>

            <div style={styles.infoSection}>
               <h1 style={styles.name}>{product.name}</h1>

               {product.category && (
                  <Link
                     to={`/?categoryId=${product.category.id}`}
                     style={styles.category}
                  >
                     {product.category.name}
                  </Link>
               )}

               <p style={styles.price}>
                  {Number(product.price).toLocaleString()} ₽
               </p>

               <button
                  onClick={handleAddToCart}
                  className="btn-primary"
                  style={styles.addToCartBtn}
               >
                  {addedToCart ? "✓ Добавлено!" : "Добавить в корзину"}
               </button>

               {product.composition && (
                  <div style={styles.section}>
                     <h3>Состав</h3>
                     <p style={styles.text}>{product.composition}</p>
                  </div>
               )}

               {product.description && (
                  <div style={styles.section}>
                     <h3>Описание</h3>
                     <p style={styles.text}>{product.description}</p>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

const styles: Record<string, React.CSSProperties> = {
   backLink: {
      display: "inline-block",
      marginBottom: 20,
      color: "var(--primary)",
      textDecoration: "none",
      fontWeight: 500,
   },
   productPage: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 40,
      backgroundColor: "var(--white)",
      borderRadius: "var(--radius)",
      padding: 30,
      boxShadow: "var(--shadow)",
   },
   sliderSection: {
      minHeight: 400,
   },
   infoSection: {
      display: "flex",
      flexDirection: "column",
      gap: 15,
   },
   name: {
      fontSize: 28,
      fontWeight: 700,
      color: "var(--text)",
   },
   category: {
      color: "var(--primary)",
      fontSize: 14,
      textDecoration: "none",
      fontWeight: 500,
   },
   price: {
      fontSize: 32,
      fontWeight: 700,
      color: "var(--primary)",
   },
   addToCartBtn: {
      padding: "14px 30px",
      fontSize: 16,
      fontWeight: 600,
      width: "100%",
   },
   section: {
      borderTop: "1px solid var(--border)",
      paddingTop: 15,
   },
   text: {
      color: "var(--text-light)",
      lineHeight: 1.6,
      whiteSpace: "pre-line",
   },
};

export default ProductPage;
