import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store";
import { logout } from "../store/authSlice";

const Header = () => {
   const { user, token } = useAppSelector((state) => state.auth);
   const { items } = useAppSelector((state) => state.cart);
   const dispatch = useAppDispatch();
   const [menuOpen, setMenuOpen] = useState(false);

   const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

   const closeMenu = () => setMenuOpen(false);

   return (
      <header style={styles.header}>
         <div className="container" style={styles.container}>
            <Link to="/" style={styles.logo} onClick={closeMenu}>
               <h1>Макси</h1>
            </Link>

            <button
               className={`hamburger ${menuOpen ? "open" : ""}`}
               onClick={() => setMenuOpen((prev) => !prev)}
               aria-label="Меню"
            >
               <span />
               <span />
               <span />
            </button>

            <nav
               className={`nav-menu ${menuOpen ? "open" : ""}`}
               style={styles.nav}
            >
               <Link to="/" style={styles.link} onClick={closeMenu}>
                  Главная
               </Link>
               <Link to="/cart" style={styles.link} onClick={closeMenu}>
                  Корзина
                  {cartCount > 0 && (
                     <span style={styles.badge}>{cartCount}</span>
                  )}
               </Link>

               {token && user ? (
                  <div style={styles.userMenu}>
                     <Link
                        to="/profile"
                        style={styles.link}
                        onClick={closeMenu}
                     >
                        {user.name}
                     </Link>
                     <button
                        onClick={() => {
                           dispatch(logout());
                           closeMenu();
                        }}
                        className="btn-secondary"
                        style={styles.btnLogout}
                     >
                        Выйти
                     </button>
                  </div>
               ) : (
                  <div style={styles.userMenu}>
                     <Link to="/login" style={styles.link} onClick={closeMenu}>
                        Войти
                     </Link>
                     <Link
                        to="/register"
                        className="btn-primary"
                        style={styles.btnRegister}
                        onClick={closeMenu}
                     >
                        Регистрация
                     </Link>
                  </div>
               )}
            </nav>
         </div>
      </header>
   );
};

const styles: Record<string, React.CSSProperties> = {
   header: {
      backgroundColor: "var(--white)",
      boxShadow: "var(--shadow)",
      position: "sticky",
      top: 0,
      zIndex: 100,
   },
   container: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: 70,
   },
   logo: {
      textDecoration: "none",
   },
   nav: {
      display: "flex",
      alignItems: "center",
      gap: 20,
   },
   link: {
      color: "var(--text)",
      textDecoration: "none",
      fontWeight: 500,
      position: "relative" as const,
   },
   badge: {
      backgroundColor: "var(--primary)",
      color: "white",
      borderRadius: "50%",
      padding: "2px 6px",
      fontSize: 12,
      marginLeft: 5,
   },
   userMenu: {
      display: "flex",
      alignItems: "center",
      gap: 10,
   },
   btnLogout: {
      padding: "5px 10px",
      fontSize: 12,
   },
   btnRegister: {
      padding: "8px 16px",
      fontSize: 14,
      textDecoration: "none",
   },
};

export default Header;
