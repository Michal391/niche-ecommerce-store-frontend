import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <Navbar/>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-2">Welcome to Our Platform</h2>
          <h3 className="text-2xl mb-8">Discover amazing products and services</h3>
          <button className="bg-white text-blue-600 font-bold rounded-full py-4 px-8 shadow-lg uppercase tracking-wider hover:bg-gray-200 transition duration-300">
            Get Started
          </button>
        </div>
      </div>
      {/* Content Section */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap -mx-4">
          {/* Feature 1 */}
          <div className="w-full md:w-1/3 px-4 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Feature 1</h3>
              <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec condimentum quam.</p>
            </div>
          </div>
          {/* Feature 2 */}
          <div className="w-full md:w-1/3 px-4 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Feature 2</h3>
              <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec condimentum quam.</p>
            </div>
          </div>
          {/* Feature 3 */}
          <div className="w-full md:w-1/3 px-4 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Feature 3</h3>
              <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec condimentum quam.</p>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Home;