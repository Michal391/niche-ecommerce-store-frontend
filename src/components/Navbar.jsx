import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext'; // Import the useUser hook
import logoImage from '../assets/mobile.png'; // Adjust the path as needed

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItemCount } = useCart();
  const { user, logout } = useUser(); // Get user and logout function

  const navItems = [
    { name: 'Home', path: '/home' },
    { name: 'Products', path: '/products' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const handleLogout = () => {
    logout(); // Log out the user
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="w-full mx-auto px-5">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link to="/" className="flex items-center py-4 px-2">
                <img src={logoImage} alt="Your Logo" className="h-8 w-auto mr-2" />
                {/* <span className="font-semibold text-gray-500 text-lg">YourLogo</span> */}
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`py-4 px-3 font-semibold transition duration-300 ${
                    location.pathname === item.path
                      ? 'text-blue-500 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-blue-500 hover:scale-110'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => navigate('/cart')}
              className="relative py-2 px-3 font-medium text-gray-500 rounded hover:bg-blue-500 hover:text-white transition duration-300"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>
            {user ? (
              <>
                <span className="py-2 px-3 text-gray-500 font-medium">{user.email}</span> {/* Show user email */}
                <button
                  onClick={handleLogout}
                  className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-blue-500 hover:text-white transition duration-300"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-blue-500 hover:text-white transition duration-300"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
