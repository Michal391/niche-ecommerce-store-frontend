import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home'
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import CartPage from './components/Cart';
import { CartProvider } from './contexts/CartContext';
import { UserProvider } from './contexts/UserContext';

const App = () => {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/Login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/products" element={<Products/>}/>
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<CartPage/>} />
            <Route path="*" element={<Navigate to="/Login" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </UserProvider>
  );
};

export default App;