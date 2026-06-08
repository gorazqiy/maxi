import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import {
   fetchCart,
   updateQuantity,
   removeFromCart,
   clearCart,
} from "../store/cartSlice";
import { paymentApi } from "../api/paymentApi";

const CartPage = () => {
   const dispatch = useAppDispatch();
   const { items, loading, error } = useAppSelector((state) => state.cart);
   const { token } = useAppSelector((state) => state.auth);
   const [orderCreated, setOrderCreated] = useState(false);
   const [paymentLoading, setPaymentLoading] = useState(false);
   const [searchParams] = useSearchParams();

   useEffect(() => {
      if (token) {
         dispatch(fetchCart());
      }
   }, [dispatch, token]);

   // Показываем сообщение об успешной оплате при редиректе с YooKassa
   useEffect(() => {
      if (searchParams.get("payment") === "success") {
         setOrderCreated(true);
         setTimeout(() => setOrderCreated(false), 5000);
      }
   }, [searchParams]);

   const handleQuantityChange = (itemId: number, quantity: number) => {
      if (quantity < 1) return;
      dispatch(updateQuantity({ itemId, quantity }));
   };

   const handleRemove = (itemId: number) => {
      dispatch(removeFromCart(itemId));
   };

   const handleClearCart = () => {
      dispatch(clearCart());
   };

   const handleCreateOrder = async () => {
      setPaymentLoading(true);
      try {
         const result = await paymentApi.createPayment();
         // Перенаправляем пользователя на страницу оплаты YooKassa
         window.location.href = result.payment_url;
      } catch (err) {
         alert("Ошибка при создании платежа");
         setPaymentLoading(false);
      }
   };

   if (!token) {
      return (
         <div style={styles.empty}>
            <h2>Войдите, чтобы посмотреть корзину</h2>
            <Link to="/login" className="btn-primary" style={styles.btn}>
               Войти
            </Link>
         </div>
      );
   }

   if (loading) {
      return <div className="loading">Загрузка корзины...</div>;
   }

   if (error) {
      return <div className="error">{error}</div>;
   }

   if (items.length === 0) {
      return (
         <div style={styles.empty}>
            <h2>Корзина пуста</h2>
            <p style={styles.emptyText}>Добавьте товары из каталога</p>
            <Link to="/" className="btn-primary" style={styles.btn}>
               Перейти в каталог
            </Link>
         </div>
      );
   }

   const total = items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
   );

   return (
      <div className="cart-page" style={styles.cartPage}>
         <div className="cart-header" style={styles.header}>
            <h2>Корзина ({items.length} товаров)</h2>
            <button
               onClick={handleClearCart}
               className="btn-secondary"
               style={styles.clearBtn}
            >
               Очистить корзину
            </button>
         </div>

         {orderCreated && (
            <div style={styles.success}>
               ✓ Оплата прошла успешно! Заказ оформлен.
            </div>
         )}

         <div style={styles.itemsList}>
            {items.map((item) => (
               <div key={item.id} className="cart-item" style={styles.item}>
                  <img
                     className="cart-item-image"
                     src={
                        item.product.images && item.product.images.length > 0
                           ? item.product.images[0].image_url
                           : "/images/no-image.png"
                     }
                     alt={item.product.name}
                     style={styles.itemImage}
                     onError={(e) => {
                        (e.target as HTMLImageElement).src =
                           "/images/no-image.png";
                     }}
                  />
                  <div className="cart-item-info" style={styles.itemInfo}>
                     <Link
                        to={`/product/${item.product.id}`}
                        style={styles.itemName}
                     >
                        {item.product.name}
                     </Link>
                     <p style={styles.itemPrice}>
                        {Number(item.product.price).toLocaleString()} ₽
                     </p>
                  </div>
                  <div
                     className="cart-item-quantity"
                     style={styles.quantityControls}
                  >
                     <button
                        onClick={() =>
                           handleQuantityChange(item.id, item.quantity - 1)
                        }
                        style={styles.qtyBtn}
                     >
                        -
                     </button>
                     <span style={styles.quantity}>{item.quantity}</span>
                     <button
                        onClick={() =>
                           handleQuantityChange(item.id, item.quantity + 1)
                        }
                        style={styles.qtyBtn}
                     >
                        +
                     </button>
                  </div>
                  <p className="cart-item-subtotal" style={styles.subtotal}>
                     {(
                        Number(item.product.price) * item.quantity
                     ).toLocaleString()}{" "}
                     ₽
                  </p>
                  <button
                     className="cart-item-remove"
                     onClick={() => handleRemove(item.id)}
                     style={styles.removeBtn}
                  >
                     ✕
                  </button>
               </div>
            ))}
         </div>

         <div className="cart-total-section" style={styles.totalSection}>
            <div style={styles.totalInfo}>
               <span style={styles.totalLabel}>Итого:</span>
               <span style={styles.totalPrice}>{total.toLocaleString()} ₽</span>
            </div>
            <button
               onClick={handleCreateOrder}
               className="btn-primary"
               style={{
                  ...styles.orderBtn,
                  ...(paymentLoading ? styles.orderBtnDisabled : {}),
               }}
               disabled={paymentLoading}
            >
               {paymentLoading
                  ? "Переход к оплате..."
                  : "Оплатить через ЮKassa"}
            </button>
         </div>
      </div>
   );
};

const styles: Record<string, React.CSSProperties> = {
   cartPage: {
      display: "flex",
      flexDirection: "column",
      gap: 20,
   },
   header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
   },
   clearBtn: {
      padding: "8px 16px",
      fontSize: 14,
   },
   success: {
      backgroundColor: "#d4edda",
      color: "#155724",
      padding: 15,
      borderRadius: "var(--radius)",
      textAlign: "center",
      fontWeight: 600,
   },
   empty: {
      textAlign: "center",
      padding: 60,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 15,
   },
   emptyText: {
      color: "var(--text-light)",
   },
   btn: {
      display: "inline-block",
      padding: "12px 24px",
      textDecoration: "none",
   },
   itemsList: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
   },
   item: {
      display: "flex",
      alignItems: "center",
      gap: 15,
      backgroundColor: "var(--white)",
      padding: 15,
      borderRadius: "var(--radius)",
      boxShadow: "var(--shadow)",
   },
   itemImage: {
      width: 80,
      height: 80,
      objectFit: "cover",
      borderRadius: 4,
   },
   itemInfo: {
      flex: 1,
   },
   itemName: {
      fontWeight: 600,
      color: "var(--text)",
      textDecoration: "none",
   },
   itemPrice: {
      color: "var(--text-light)",
      fontSize: 14,
      marginTop: 5,
   },
   quantityControls: {
      display: "flex",
      alignItems: "center",
      gap: 10,
   },
   qtyBtn: {
      width: 30,
      height: 30,
      borderRadius: "50%",
      border: "1px solid var(--border)",
      backgroundColor: "var(--white)",
      cursor: "pointer",
      fontSize: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
   },
   quantity: {
      fontSize: 16,
      fontWeight: 600,
      minWidth: 30,
      textAlign: "center",
   },
   subtotal: {
      fontWeight: 700,
      fontSize: 16,
      minWidth: 100,
      textAlign: "right",
   },
   removeBtn: {
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      fontSize: 18,
      color: "var(--error)",
      padding: 5,
   },
   totalSection: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "var(--white)",
      padding: 20,
      borderRadius: "var(--radius)",
      boxShadow: "var(--shadow)",
   },
   totalInfo: {
      display: "flex",
      alignItems: "center",
      gap: 15,
   },
   totalLabel: {
      fontSize: 18,
      fontWeight: 500,
   },
   totalPrice: {
      fontSize: 24,
      fontWeight: 700,
      color: "var(--primary)",
   },
   orderBtn: {
      padding: "14px 30px",
      fontSize: 16,
      fontWeight: 600,
   },
   orderBtnDisabled: {
      opacity: 0.6,
      cursor: "not-allowed",
   },
};

export default CartPage;
