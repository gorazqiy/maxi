import { useState } from "react";
import { IProductImage } from "../types/product";

interface ImageSliderProps {
   images: IProductImage[];
   productName: string;
}

const ImageSlider = ({ images, productName }: ImageSliderProps) => {
   const [activeIndex, setActiveIndex] = useState(0);

   if (!images || images.length === 0) {
      return (
         <div style={styles.noImage}>
            <p>Нет изображения</p>
         </div>
      );
   }

   const handlePrev = () => {
      setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
   };

   const handleNext = () => {
      setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
   };

   return (
      <div style={styles.slider}>
         <div className="image-slider-main" style={styles.mainImage}>
            {images.length > 1 && (
               <button
                  onClick={handlePrev}
                  style={{ ...styles.arrow, left: 10 }}
               >
                  &#10094;
               </button>
            )}
            <img
               src={images[activeIndex].image_url}
               alt={`${productName} - фото ${activeIndex + 1}`}
               style={styles.image}
               onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/no-image.png";
               }}
            />
            {images.length > 1 && (
               <button
                  onClick={handleNext}
                  style={{ ...styles.arrow, right: 10 }}
               >
                  &#10095;
               </button>
            )}
         </div>

         {images.length > 1 && (
            <div style={styles.thumbnails}>
               {images.map((img, index) => (
                  <img
                     key={img.id}
                     src={img.image_url}
                     alt={`${productName} - миниатюра ${index + 1}`}
                     onClick={() => setActiveIndex(index)}
                     style={{
                        ...styles.thumbnail,
                        ...(index === activeIndex
                           ? styles.activeThumbnail
                           : {}),
                     }}
                     onError={(e) => {
                        (e.target as HTMLImageElement).src =
                           "/images/no-image.png";
                     }}
                  />
               ))}
            </div>
         )}
      </div>
   );
};

const styles: Record<string, React.CSSProperties> = {
   slider: {
      display: "flex",
      flexDirection: "column",
      gap: 15,
   },
   mainImage: {
      position: "relative",
      width: "100%",
      height: 400,
      borderRadius: "var(--radius)",
      overflow: "hidden",
      backgroundColor: "var(--white)",
   },
   image: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
   },
   noImage: {
      width: "100%",
      height: 400,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "var(--white)",
      borderRadius: "var(--radius)",
      color: "var(--text-light)",
   },
   arrow: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      backgroundColor: "rgba(255,255,255,0.8)",
      border: "none",
      borderRadius: "50%",
      width: 40,
      height: 40,
      cursor: "pointer",
      fontSize: 18,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
      boxShadow: "var(--shadow)",
   },
   thumbnails: {
      display: "flex",
      gap: 10,
      overflowX: "auto",
   },
   thumbnail: {
      width: 80,
      height: 80,
      objectFit: "cover",
      borderRadius: 4,
      cursor: "pointer",
      border: "2px solid transparent",
      transition: "border-color 0.3s ease",
   },
   activeThumbnail: {
      borderColor: "var(--primary)",
   },
};

export default ImageSlider;
