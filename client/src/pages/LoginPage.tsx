import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { login, clearError } from "../store/authSlice";

const LoginPage = () => {
   const dispatch = useAppDispatch();
   const navigate = useNavigate();
   const { token, loading, error } = useAppSelector((state) => state.auth);

   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");

   useEffect(() => {
      if (token) {
         navigate("/");
      }
   }, [token, navigate]);

   useEffect(() => {
      dispatch(clearError());
   }, [dispatch]);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      dispatch(login({ email, password }));
   };

   return (
      <div style={styles.authPage}>
         <div className="auth-form-container" style={styles.formContainer}>
            <h2 style={styles.title}>Вход</h2>

            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
               <div style={styles.field}>
                  <label style={styles.label}>Email</label>
                  <input
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="Введите email"
                     required
                  />
               </div>

               <div style={styles.field}>
                  <label style={styles.label}>Пароль</label>
                  <input
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="Введите пароль"
                     required
                  />
               </div>

               <button
                  type="submit"
                  className="btn-primary"
                  style={styles.submitBtn}
                  disabled={loading}
               >
                  {loading ? "Вход..." : "Войти"}
               </button>
            </form>

            <p style={styles.link}>
               Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </p>
         </div>
      </div>
   );
};

const styles: Record<string, React.CSSProperties> = {
   authPage: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "calc(100vh - 200px)",
   },
   formContainer: {
      backgroundColor: "var(--white)",
      padding: 40,
      borderRadius: "var(--radius)",
      boxShadow: "var(--shadow)",
      width: "100%",
      maxWidth: 400,
   },
   title: {
      textAlign: "center",
      marginBottom: 30,
   },
   error: {
      backgroundColor: "#f8d7da",
      color: "#721c24",
      padding: 10,
      borderRadius: "var(--radius)",
      marginBottom: 15,
      textAlign: "center",
   },
   form: {
      display: "flex",
      flexDirection: "column",
      gap: 15,
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
   submitBtn: {
      padding: "12px",
      fontSize: 16,
      fontWeight: 600,
      marginTop: 10,
   },
   link: {
      textAlign: "center",
      marginTop: 20,
      color: "var(--text-light)",
   },
};

export default LoginPage;
