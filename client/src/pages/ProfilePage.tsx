import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { updateProfile } from "../store/authSlice";
import axiosInstance from "../api/axiosInstance";
import { IOrder } from "../types/cart";

const ProfilePage = () => {
   const dispatch = useAppDispatch();
   const { user } = useAppSelector((state) => state.auth);

   const [name, setName] = useState(user?.name || "");
   const [phone, setPhone] = useState(user?.phone || "");
   const [address, setAddress] = useState(user?.address || "");
   const [saved, setSaved] = useState(false);
   const [orders, setOrders] = useState<IOrder[]>([]);
   const [ordersLoading, setOrdersLoading] = useState(true);

   useEffect(() => {
      if (user) {
         setName(user.name);
         setPhone(user.phone);
         setAddress(user.address);
      }

      const fetchOrders = async () => {
         try {
            const response = await axiosInstance.get("/orders");
            setOrders(response.data);
         } catch (err) {
            console.error("Ошибка загрузки заказов");
         } finally {
            setOrdersLoading(false);
         }
      };

      fetchOrders();
   }, [user]);

   const handleSaveProfile = (e: React.FormEvent) => {
      e.preventDefault();
      dispatch(updateProfile({ name, phone, address }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
   };

   const getStatusText = (status: string) => {
      const statuses: Record<string, string> = {
         pending: "В обработке",
         paid: "Оплачен",
         shipped: "Отправлен",
         delivered: "Доставлен",
         cancelled: "Отменён",
      };
      return statuses[status] || status;
   };

   const getStatusColor = (status: string) => {
      const colors: Record<string, string> = {
         pending: "#f0ad4e",
         paid: "#5bc0de",
         shipped: "#0275d8",
         delivered: "#5cb85c",
         cancelled: "#d9534f",
      };
      return colors[status] || "#999";
   };

   return (
      <div style={styles.profilePage}>
         <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Мой профиль</h2>

            <form onSubmit={handleSaveProfile} style={styles.form}>
               <div style={styles.field}>
                  <label style={styles.label}>Имя</label>
                  <input
                     type="text"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                  />
               </div>

               <div style={styles.field}>
                  <label style={styles.label}>Email</label>
                  <input
                     type="email"
                     value={user?.email || ""}
                     disabled
                     style={styles.disabledInput}
                  />
               </div>

               <div style={styles.field}>
                  <label style={styles.label}>Телефон</label>
                  <input
                     type="tel"
                     value={phone}
                     onChange={(e) => setPhone(e.target.value)}
                     placeholder="+7 (999) 999-99-99"
                  />
               </div>

               <div style={styles.field}>
                  <label style={styles.label}>Адрес доставки</label>
                  <textarea
                     value={address}
                     onChange={(e) => setAddress(e.target.value)}
                     placeholder="Город, улица, дом, квартира"
                     rows={3}
                  />
               </div>

               <button
                  type="submit"
                  className="btn-primary"
                  style={styles.saveBtn}
               >
                  {saved ? "✓ Сохранено!" : "Сохранить изменения"}
               </button>
            </form>
         </div>

         <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Мои заказы</h2>

            {ordersLoading ? (
               <div className="loading">Загрузка заказов...</div>
            ) : orders.length === 0 ? (
               <p style={styles.noOrders}>У вас пока нет заказов</p>
            ) : (
               <div style={styles.ordersList}>
                  {orders.map((order) => (
                     <div key={order.id} style={styles.orderCard}>
                        <div style={styles.orderHeader}>
                           <span style={styles.orderId}>Заказ №{order.id}</span>
                           <span
                              style={{
                                 ...styles.orderStatus,
                                 backgroundColor: getStatusColor(order.status),
                              }}
                           >
                              {getStatusText(order.status)}
                           </span>
                        </div>
                        <p style={styles.orderDate}>
                           {new Date(order.created_at).toLocaleDateString(
                              "ru-RU",
                           )}
                        </p>
                        <p style={styles.orderTotal}>
                           Сумма:{" "}
                           <strong>
                              {Number(order.total).toLocaleString()} ₽
                           </strong>
                        </p>
                        {order.items && order.items.length > 0 && (
                           <div style={styles.orderItems}>
                              {order.items.map((item) => (
                                 <div key={item.id} style={styles.orderItem}>
                                    <span>{item.product.name}</span>
                                    <span>
                                       {item.quantity} x{" "}
                                       {Number(item.price).toLocaleString()} ₽
                                    </span>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
};

const styles: Record<string, React.CSSProperties> = {
   profilePage: {
      display: "flex",
      flexDirection: "column",
      gap: 30,
   },
   section: {
      backgroundColor: "var(--white)",
      borderRadius: "var(--radius)",
      padding: 30,
      boxShadow: "var(--shadow)",
   },
   sectionTitle: {
      marginBottom: 20,
      fontSize: 22,
   },
   form: {
      display: "flex",
      flexDirection: "column",
      gap: 15,
      maxWidth: 500,
   },
   field: {
      display: "flex",
      flexDirection: "column",
      gap: 5,
   },
   label: {
      fontWeight: 500,
      fontSize: 14,
   },
   disabledInput: {
      backgroundColor: "#f5f5f5",
      cursor: "not-allowed",
   },
   saveBtn: {
      padding: "12px 24px",
      fontSize: 16,
      fontWeight: 600,
      width: "fit-content",
   },
   noOrders: {
      color: "var(--text-light)",
      textAlign: "center",
      padding: 30,
   },
   ordersList: {
      display: "flex",
      flexDirection: "column",
      gap: 15,
   },
   orderCard: {
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: 15,
   },
   orderHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
   },
   orderId: {
      fontWeight: 700,
      fontSize: 16,
   },
   orderStatus: {
      padding: "4px 12px",
      borderRadius: 20,
      color: "white",
      fontSize: 13,
      fontWeight: 500,
   },
   orderDate: {
      color: "var(--text-light)",
      fontSize: 14,
      marginBottom: 5,
   },
   orderTotal: {
      fontSize: 16,
      marginBottom: 10,
   },
   orderItems: {
      borderTop: "1px solid var(--border)",
      paddingTop: 10,
      display: "flex",
      flexDirection: "column",
      gap: 5,
   },
   orderItem: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 14,
      color: "var(--text-light)",
   },
};

export default ProfilePage;
