const Footer = () => {
   return (
      <footer style={styles.footer}>
         <div className="container footer-container">
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
};

export default Footer;
