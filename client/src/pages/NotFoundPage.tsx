import { Link } from "react-router-dom";

const NotFoundPage = () => {
   return (
      <div
         style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
            textAlign: "center",
            padding: "40px 20px",
         }}
      >
         <h1
            style={{
               fontSize: "120px",
               fontWeight: 800,
               color: "var(--primary)",
               lineHeight: 1,
               marginBottom: "8px",
            }}
         >
            404
         </h1>
         <h2
            style={{
               fontSize: "24px",
               fontWeight: 600,
               color: "var(--text)",
               marginBottom: "12px",
            }}
         >
            Страница не найдена
         </h2>
         <p
            style={{
               fontSize: "16px",
               color: "var(--text-light)",
               maxWidth: "400px",
               marginBottom: "28px",
            }}
         >
            Возможно, она была удалена или вы перешли по неверной ссылке.
         </p>
         <Link to="/" className="btn-primary" style={{ padding: "12px 32px" }}>
            На главную
         </Link>
      </div>
   );
};

export default NotFoundPage;
