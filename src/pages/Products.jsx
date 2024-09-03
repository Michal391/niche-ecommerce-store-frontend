import React from 'react';
import Navbar from '../components/Navbar';

const Products = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <Navbar/>
      {/* Products Content */}
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Our Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Product Card 1 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-2">Product 1</h2>
            <p className="text-gray-600 mb-4">Description of Product 1</p>
            <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
              Learn More
            </button>
          </div>
          {/* Product Card 2 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-2">Product 2</h2>
            <p className="text-gray-600 mb-4">Description of Product 2</p>
            <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
              Learn More
            </button>
          </div>
          {/* Product Card 3 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-2">Product 3</h2>
            <p className="text-gray-600 mb-4">Description of Product 3</p>
            <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Products;