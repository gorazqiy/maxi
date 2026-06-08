import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "./store";
import { fetchUser } from "./store/authSlice";
import { fetchCart } from "./store/cartSlice";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
   const dispatch = useAppDispatch();

   useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
         dispatch(fetchUser());
         dispatch(fetchCart());
      }
   }, [dispatch]);

   return (
      <>
         <Header />
         <main className="page">
            <div className="container">
               <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/product/:id" element={<ProductPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                     path="/profile"
                     element={
                        <ProtectedRoute>
                           <ProfilePage />
                        </ProtectedRoute>
                     }
                  />
               </Routes>
            </div>
         </main>
         <Footer />
      </>
   );
}

export default App;
