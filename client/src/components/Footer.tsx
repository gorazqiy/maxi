const Footer = () => {
   return (
      <footer style={styles.footer}>
         <div className="container" style={styles.container}>
            <p>
               &copy; {new Date().getFullYear()} МАкси - Магазин собственного
               производства
            </p>
            <p>Все права защищены</p>
         </div>
      </footer>
   );
};

const styles: Record<string, React.CSSProperties> = {
   footer: {
      backgroundColor: "var(--primary-dark)",
      color: "var(--white)",
      padding: "20px 0",
      textAlign: "center",
   },
   container: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
   },
};

export default Footer;
