import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CartProvider } from "./components/CartContext";
import { ProductProvider } from "./context/ProductContext";

import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import BookingConfirmation from "./pages/BookingConfirmation";
import MyBookings from "./pages/MyBookings";
import CategoryProducts from "./pages/CategoryProducts";
import Cart from "./pages/Cart";
import CartNotification from "./components/CartNotification";
import LifeMode from "./pages/LifeMode";

function App() {
return (
      <ProductProvider>
      <CartProvider>
          <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/category/:categoryName"
          element={<CategoryProducts />}
        />
        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/booking-confirmation"
          element={<BookingConfirmation />}
        />
        <Route
          path="/my-bookings"
          element={<MyBookings />}
        />
        <Route
          path="/life-mode"
          element={<LifeMode />}
        />
      </Routes>
    </BrowserRouter>
  </CartProvider>
</ProductProvider>

);
}

export default App;