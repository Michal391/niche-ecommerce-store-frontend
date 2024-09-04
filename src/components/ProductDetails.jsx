import React from 'react';

const ProductDetails = ({ product, onClose, onBuyNow, onAddToCart }) => {
  if (!product) return null;

  // Function to format specification keys
  const formatSpecKey = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center" id="product-modal">
      <div className="relative mx-auto p-5 border w-full max-w-md md:max-w-xl lg:max-w-2xl h-full md:h-[80vh] lg:h-[70vh] shadow-lg rounded-md bg-white overflow-y-auto">
        <div className="h-full flex flex-col">
          <h3 className="text-lg md:text-xl leading-6 font-medium text-gray-900 mb-2">{product.name}</h3>
          <button
            onClick={onClose}
            className="absolute top-0 right-0 mt-4 mr-4 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex-grow overflow-y-auto px-4 md:px-7 py-3">
            <img src={product.thumbnailUrl} alt={product.name} className="w-full h-48 md:h-60 lg:h-72 object-cover mb-4 rounded-lg"/>
            <p className="text-sm md:text-base text-gray-500 mb-4">{product.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <p className="text-md md:text-lg font-bold">Price: ${product.price}</p>
              <p className="text-sm md:text-base">Brand: {product.brand}</p>
              <p className="text-sm md:text-base">In Stock: {product.stock}</p>
            </div>
            <div className="mt-4">
              <h4 className="font-bold mb-2">Specifications:</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <p key={key} className="text-sm md:text-base">
                    <span className="font-semibold">{formatSpecKey(key)}:</span> {value}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 space-y-2 md:space-y-0 md:space-x-2 mt-auto">
            <button
              className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full md:w-1/3 shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
              onClick={onBuyNow}
            >
              Buy Now
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full md:w-1/3 shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={onAddToCart}
            >
              Add to Cart
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-full md:w-1/3 shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;