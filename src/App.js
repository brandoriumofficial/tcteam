import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "@splidejs/splide/dist/css/splide.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "./App.css";

import Navbar from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'react-before-after-slider-component/dist/build.css';
import { useState } from "react";
import CartSidebar from "./components/CartSidebar";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
// import Coupons from "./pages/Coupons";
import AdminOrder from "./components/Admin/Order/AdminOrder"; 
import AdminLayout from "./components/Admin/AdminLayout";
import AllProducts from "./components/Admin/Catalog/AllProducts";
import AddProduct from "./components/Admin/Catalog/AddProduct";
import Categories from "./components/Admin/Catalog/Categories";
import AddCategory from "./components/Admin/Catalog/AddCategory";
import AdminCoupon from "./components/Admin/Catalog/AdminCoupon";
import AdminReview from "./components/Admin/Catalog/AdminReview";
import AdminInventory from "./components/Admin/Catalog/AdminInventory";
import AdminPayment from "./components/Admin/Catalog/AdminPayment";
import AdminShipped from "./components/Admin/Catalog/AdminShipped";
import AdminReferral from "./components/Admin/Catalog/AdminReferral";
import AdminBanner from "./components/Admin/AdminBanner";
import AdminReports from "./components/Admin/AdminReports";
import AdminOffers from "./components/Admin/AdminOffers";
import AdminSEO from "./pages/AdminSEO";

function App() {
  const [cart, setCart] = useState([]); // Cart state
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Add product to cart
  const handleAddToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find(p => p.id === product.id && p.selectedVariation?.size === product.selectedVariation?.size);
      if (exists) return prev; // already in cart
      return [...prev, product];
    });
  };


  const handleRemoveFromCart = (productId, variationSize) => {
    setCart((prev) =>
      prev.filter(
        (p) =>
          !(p.id === productId && p.selectedVariation?.size === variationSize)
      )
    );
  };
    const handleQuantityChange = (productId, variationSize, delta) => {
    setCart((prev) =>
      prev
        .map((p) =>
          p.id === productId &&
          p.selectedVariation?.size === variationSize
            ? { ...p, quantity: Math.max(1, p.quantity + delta) }
            : p
        )
        .filter((p) => p.quantity > 0)
    );
  };

  return (
    <Router>
      <Navbar cartCount={cart.length} onCartClick={() => setIsCartOpen(true)} />

      <Routes>
        <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
        <Route
          path="/products"
          element={<ProductList onAddToCart={handleAddToCart} />}
        />
        <Route
          path="/product/:id"
          element={<ProductDetails onAddToCart={handleAddToCart} />}
        />
        <Route
          path="/cart"
          element={<Cart cart={cart} onRemove={handleRemoveFromCart} />}
        />
        <Route
          path="/Admin"
          element={<AdminDashboard />}
        />

  {/* <Route path="/admin/orders" element={<AdminOrder />} /> */}

  <Route path="/admin" element={<AdminLayout />}>
   {/* <Route index element={<AdminDashboard />} /> */}
   <Route path="orders" element={<AdminOrder />} />
   <Route path="products" element={<AllProducts />} />
   <Route path="addproduct" element={<AddProduct />} />
   <Route path="categories" element={<Categories />} />
   <Route path="addcategory" element={<AddCategory />} />
   <Route path="coupons" element={<AdminCoupon />} />
   <Route path="review" element={<AdminReview />} />
   <Route path="inventory" element={<AdminInventory />} />
   <Route path="payments" element={<AdminPayment />} />
   <Route path="shipped" element={<AdminShipped />} />
   <Route path="referral" element={<AdminReferral />} />
   <Route path="banner" element={<AdminBanner />} />
   <Route path="reports" element={<AdminReports />} />
   <Route path="seo" element={<AdminSEO />} />
   <Route path="offer" element={<AdminOffers />} />
</Route>


        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="*" element={<NotFound />} />
        
        
      </Routes>

      <Footer />
  <CartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onQuantityChange={handleQuantityChange}
          onRemove={handleRemoveFromCart}
        />
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
