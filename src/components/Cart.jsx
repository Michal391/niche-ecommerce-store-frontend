import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';

const CartPage = () => {
  const { cart, error, removeItemFromCart } = useCart();
  const navigate = useNavigate();

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (!cart) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const calculateTotal = () => {
    return (cart.items || []).reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleRemoveItem = async (productId) => {
    console.log("Removing product with ID:", productId); // Add this to check
    try {
      await removeItemFromCart(productId);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };  

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          <ShoppingCart className="inline-block mr-2 mb-1" />
          Your Cart
        </h1>
        {!cart.items || cart.items.length === 0 ? (
          <div className="text-center py-16 bg-gray-100 rounded-lg">
            <p className="text-xl text-gray-600">Your cart is empty.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-8">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                      {/* Placeholder for product image */}
                      <span className="text-2xl">{item.productName[0]}</span>
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg">{item.productName}</h2>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="font-semibold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="text-red-500 hover:text-red-700 transition duration-300"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <p className="text-2xl font-bold text-right mb-4">
                Total: ${calculateTotal().toFixed(2)}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => navigate('/checkout')}
                  className="bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 transition duration-300 flex items-center"
                >
                  Proceed to Checkout
                  <ChevronRight className="ml-2" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;