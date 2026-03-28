import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import { CartProvider } from "./context/CartContext";

// User components
import UserLayout from "./components/user/UserLayout";
import Home from "./components/user/Home";
import Products from "./components/user/Products";
import Cart from "./components/user/Cart";
import Checkout from "./components/user/Checkout";
import About from "./components/user/About";
import Orders from "./components/user/Orders";
import NotFound from "./components/user/NotFound";
import Profile from "./components/user/Profile";
import UserSettings from "./components/user/Settings";

// Seller components
import SellerLayout from "./components/seller/SellerLayout";
import SellerDashboard from "./components/seller/Dashboard";
import SellerProfile from "./components/seller/Profile";
import Categories from "./components/seller/Categories";
import CrudApp from "./components/seller/CrudApp";
import Order from "./components/seller/Order";
import Reports from "./components/seller/Reports";
import Settings from "./components/seller/Settings";

function App() {
return (
<CartProvider>
<Router>
<Routes>
{/* Public Routes */}
<Route path="/" element={<Login />} />
<Route path="/register" element={<Register />} />

{/* User Routes */}
<Route
path="/user"
element={
<PrivateRoute>
<UserLayout />
</PrivateRoute>
}
>
<Route index element={<Home />} />
<Route path="products" element={<Products />} />
<Route path="cart" element={<Cart />} />
<Route path="checkout" element={<Checkout />} />
<Route path="orders" element={<Orders />} />
<Route path="about" element={<About />} />
<Route path="profile" element={<Profile />} />
<Route path="settings" element={<UserSettings />} />
</Route>

{/* Seller Routes */}
<Route
path="/seller"
element={
<PrivateRoute>
<SellerLayout />
</PrivateRoute>
}
>
<Route index element={<SellerDashboard />} />
<Route path="profile" element={<SellerProfile />} />
<Route path="categories" element={<Categories />} />
<Route path="products" element={<CrudApp />} />
<Route path="orders" element={<Order />} />
<Route path="reports" element={<Reports />} />
<Route path="settings" element={<Settings />} />
</Route>

{/* 404 Route */}
<Route path="*" element={<NotFound />} />
</Routes>
</Router>
</CartProvider>
);
}
export default App;
