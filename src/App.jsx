import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home'
import Products from './pages/Products';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products/>}/>
        <Route path="*" element={<Navigate to="/Login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;