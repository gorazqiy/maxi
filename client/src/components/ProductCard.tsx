import { Link } from "react-router-dom";
import { IProduct } from "../types/product";

const ProductCard = ({ product }: { product: IProduct }) => {
   const imageUrl =
      product.images && product.images.length > 0
         ? product.images[0].image_url
         : "/images/no-image.png";

   return (
      <Link to={`/product/${product.id}`} style={styles.card}>
         <div style={styles.imageContainer}>
            <img
               src={imageUrl}
               alt={product.name}
               style={styles.image}
               onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/no-image.png";
               }}
            />
         </div>
         <div style={styles.info}>
            <h3 style={styles.name}>{product.name}</h3>
            {product.category && (
               <span style={styles.category}>{product.category.name}</span>
            )}
            <p style={styles.price}>
               {Number(product.price).toLocaleString()} ₽
            </p>
         </div>
      </Link>
   );
};

const styles: Record<string, React.CSSProperties> = {
   card: {
      backgroundColor: "var(--white)",
      borderRadius: "var(--radius)",
      overflow: "hidden",
      boxShadow: "var(--shadow)",
      textDecoration: "none",
      color: "var(--text)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      display: "flex",
      flexDirection: "column",
   },
   imageContainer: {
      width: "100%",
      aspectRatio: "1 / 1",
      overflow: "hidden",
   },
   image: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      backgroundColor: "#f8f8f8",
   },
   info: {
      padding: 15,
      flex: 1,
      display: "flex",
      flexDirection: "column",
   },
   name: {
      fontSize: 16,
      marginBottom: 5,
      fontWeight: 600,
   },
   category: {
      fontSize: 13,
      color: "var(--text-light)",
      marginBottom: 5,
   },
   price: {
      fontSize: 18,
      fontWeight: 700,
      color: "var(--primary)",
      marginTop: "auto",
   },
};

export default ProductCard;
