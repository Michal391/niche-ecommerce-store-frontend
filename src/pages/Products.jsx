import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/motion';
import { getAllProducts, getProductInformation } from '../services/api';
import ServiceCard from '../components/ProductCard';
import ProductDetails from '../components/ProductDetails';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      console.log("fetched products:", data);
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      setLoading(false);
    }
  };

  const handleProductClick = async (productId) => {
    try {
      const productData = await getProductInformation(productId);
      setSelectedProduct(productData);
    } catch (err) {
      console.error('Failed to fetch product details:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Our Products</h1>
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={fadeIn("up", "spring", 0.5, 0.75)}
              initial="hidden"
              animate="show"
            >
              {products.map((product, index) => (
                <ServiceCard
                  key={product.id}
                  index={index}
                  {...product}
                  handleClick={handleProductClick}
                />
              ))}
            </motion.div>

            <ProductDetails 
              product={selectedProduct} 
              onClose={() => setSelectedProduct(null)} 
            />
          </>
        )}
      </div>
      <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Products;