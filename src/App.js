import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState, lazy, Suspense, memo } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import '@fortawesome/fontawesome-free/css/all.min.css';


// USER
import { clientId } from "./api/API_URL";
import EditProduct from "./pages/Admin/EditProduct.jsx";
import RestaurantInvoice from "./pages/Admin/RestaurantInvoice.js";
import ProductDetailPage from "./pages/user/ProductDetailPage.jsx";
import OrderSuccess from "./pages/user/OrderSuccess.jsx";
const Home = lazy(() => import("./pages/user/Home"));
const AllProduect = lazy(() => import("./pages/user/AllProduect.jsx"));
const ProductDetails = lazy(() => import("./pages/user/ProductDetails"));
const Login = lazy(() => import("./pages/user/Login"));
const About = lazy(() => import("./pages/user/About"));
const Contact = lazy(() => import("./pages/user/Contact"));
const NotFound = lazy(() => import("./pages/user/NotFound"));
const ComboOffers = lazy(() => import("./pages/user/ComboOffer"));
const HairCare = lazy(() => import("./pages/user/HairCarePage.jsx"));
const Facewash = lazy(() => import("./pages/user/FaceWash.jsx"));
const Skincare = lazy(() => import("./pages/user/Skincare.jsx"));
const Cart = lazy(() => import("./components/Homeuser/card/Cart.js"));

const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin")); 

const AdminLayout = lazy(() => import("./components/Admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const AdminOrder = lazy(() => import("./components/Admin/Order/AdminOrder"));
const OrderList = lazy(() => import("./components/Admin/Order/OrderList"));
const AddProduct = lazy(() => import("./pages/Admin/AddProduct"));
const AllProducts = lazy(() => import("./pages/Admin/AllProducts.jsx"));
const Categories = lazy(() => import("./components/Admin/Catalog/Categories"));
const AddCategory = lazy(() => import("./pages/Admin/AddCategory"));
const AdminCoupon = lazy(() => import("./pages/Admin/AdminCoupon"));
const AdminReview = lazy(() => import("./components/Admin/Catalog/AdminReview"));
const AdminInventory = lazy(() => import("./pages/Admin/AdminInventory"));
const AdminPayment = lazy(() => import("./pages/Admin/AdminPayment"));
const AdminShipped = lazy(() => import("./components/Admin/Catalog/AdminShipped"));
const AdminReferral = lazy(() => import("./pages/Admin/AdminReferral"));
const AdminBanner = lazy(() => import("./components/Admin/AdminBanner"));
const AdminReports = lazy(() => import("./components/Admin/AdminReports"));
const AdminOffers = lazy(() => import("./components/Admin/AdminOffers"));
const AdminPageBuilder = lazy(() => import("./components/Admin/AdminPageBuilder"));
const AdminContact = lazy(() => import("./components/Admin/AdminContact"));
const BrandManagement = lazy(() => import("./pages/Admin/BrandManagement.jsx")); // Already existed
const AdminSEO = lazy(() => import("./pages/Admin/AdminSEO.jsx"));

// COMMON
const Header = memo(lazy(() => import("./components/Homeuser/Header.js")));
const Footer = memo(lazy(() => import("./components/Homeuser/Footer.js")));
const CartSidebar = lazy(() =>
  import("./components/Homeuser/card/CartSidebar.js")
);

const Loader = () => <div className="text-center p-5">Loading...</div>;


function useCart() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find(
        (p) =>
          p.id === product.id &&
          p.selectedVariation?.size === product.selectedVariation?.size
      );
      return exists ? prev : [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id, size) => {
    setCart((prev) =>
      prev.filter(
        (p) => !(p.id === id && p.selectedVariation?.size === size)
      )
    );
  };

  const changeQty = (id, size, delta) => {
    setCart((prev) =>
      prev.map((p) =>
        p.id === id && p.selectedVariation?.size === size
          ? { ...p, quantity: Math.max(1, p.quantity + delta) }
          : p
      )
    );
  };

  const cartCount = cart.reduce((t, i) => t + i.quantity, 0);

  return {
    cart,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    changeQty,
  };
}


function AppRoutes({ addToCart, cart, removeFromCart }) {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* USER ROUTES */}
        <Route path="/" element={<Home onAddToCart={addToCart} />} />
        <Route path="/products" element={<AllProduect />} />
        <Route
          path="/product/:id"
          element={<ProductDetails onAddToCart={addToCart} />}
        />
         <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/order-success" element={<OrderSuccess />} />
        <Route
          path="/cart"
          element={<Cart cart={cart} onRemove={removeFromCart} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products/combo" element={<ComboOffers />} />
        <Route path="/products/haircare" element={<HairCare />} />
        <Route path="/products/facewash" element={<Facewash />} />
        <Route path="/products/skincare" element={<Skincare />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin/login" element={<AdminLogin />} /> 

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrder />} />
          <Route path="orders/list" element={<OrderList />} />
          <Route path="addproduct" element={<AddProduct />} />
          <Route path="editproduct/:id" element={<AddProduct />} />
          <Route path="products" element={<AllProducts />} />
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
          <Route path="offer" element={<AdminOffers />} />
          <Route path="pagebuilder" element={<AdminPageBuilder />} />
          <Route path="contact" element={<AdminContact />} />
          <Route path="invoice" element={<RestaurantInvoice />} />
          <Route path="brandmanagement" element={<BrandManagement />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

/* ================== MAIN APP ================== */

export default function App() {
  const cartData = useCart();

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Suspense fallback={<Loader />}>
          <Header
            cartCount={cartData.cartCount}
            onCartClick={() => cartData.setIsCartOpen(true)}
          />
        </Suspense>

        <AppRoutes
          addToCart={cartData.addToCart}
          cart={cartData.cart}
          removeFromCart={cartData.removeFromCart}
        />

        <Suspense fallback={null}>
          <Footer />
          <CartSidebar
            isOpen={cartData.isCartOpen}
            onClose={() => cartData.setIsCartOpen(false)}
            cart={cartData.cart}
            onQuantityChange={cartData.changeQty}
            onRemove={cartData.removeFromCart}
          />
        </Suspense>

        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </GoogleOAuthProvider>
  );
}