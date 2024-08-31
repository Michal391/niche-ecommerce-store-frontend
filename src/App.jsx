import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        {/* Add other routes as needed, for example: */}
        {/* <Route path="/home" element={<Home />} /> */}
        {/* <Route path="/products" element={<Products />} /> */}
        
        {/* Redirect to login page if no other route matches */}
        <Route path="*" element={<Navigate to="/Login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;