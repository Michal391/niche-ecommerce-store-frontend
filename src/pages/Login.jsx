import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleView = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          <motion.div 
            className="w-full md:w-1/2 p-8 flex flex-col justify-center"
            initial={false}
            animate={{ x: isLogin ? 0 : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {isLogin ? (
              <>
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Sign In</h2>
                <input className="mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" type="email" placeholder="Email" />
                <input className="mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" type="password" placeholder="Password" />
                <button className="mb-4 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">Sign In</button>
                <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
              </>
            ) : (
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome Back!</h2>
                <p className="mb-6 text-gray-600">Sign in to use our full range of features</p>
                <button onClick={toggleView} className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">Sign In</button>
              </div>
            )}
          </motion.div>
          <motion.div 
            className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-blue-600 text-white"
            initial={false}
            animate={{ x: isLogin ? 0 : '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {isLogin ? (
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6">Hello, Friend!</h2>
                <p className="mb-6">Enter your personal details and start your journey with us</p>
                <button onClick={toggleView} className="p-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition duration-300">Sign Up</button>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-6">Create Account</h2>
                <input className="mb-4 p-3 border border-white bg-blue-500 rounded-lg placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white" type="text" placeholder="Name" />
                <input className="mb-4 p-3 border border-white bg-blue-500 rounded-lg placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white" type="email" placeholder="Email" />
                <input className="mb-4 p-3 border border-white bg-blue-500 rounded-lg placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white" type="password" placeholder="Password" />
                <input className="mb-4 p-3 border border-white bg-blue-500 rounded-lg placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white" type="password" placeholder="Confirm Password" />
                <button className="p-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition duration-300">Sign Up</button>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;