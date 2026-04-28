import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import MenuPage from "./pages/MenuPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";

const App = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:id" element={<OrderTrackingPage />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;