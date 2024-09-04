import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const toggleView = () => {
    setIsLogin(!isLogin);
    setMessage('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (isLogin) {
        await loginUser(formData.email, formData.password);
        setMessage('Login Successful!');
        navigate('/home');
      } else {
        if (formData.password !== formData.confirmPassword) {
          setMessage('Passwords do not match');
          return;
        }
        await registerUser(formData.name, formData.email, formData.password, formData.confirmPassword);
        setMessage('Registration successful!');
        navigate('/home');
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setMessage('Email already exists. Please use a different email.');
      } else {
        const errorMsg = isLogin ? 'Login failed. Please try again.' : 'Registration failed. Please try again.';
        setMessage(errorMsg);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-zinc-200 from-10% via-gray-100 via-30% to-slate-100 to-90%">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          <motion.div 
            className="w-full md:w-1/2 p-8 flex flex-col justify-center"
            initial={false}
            animate={{ x: isLogin ? 0 : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <form onSubmit={handleSubmit}>
              {isLogin ? (
                <>
                  <h2 className="text-3xl font-bold mb-6 text-gray-800">Sign In</h2>
                  <input className="mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
                  <input className="mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
                  <button type="submit" className="mb-4 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 w-full">Sign In</button>
                  <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold mb-6">Create Account</h2>
                  <input className="mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required />
                  <input className="mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
                  <input className="mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
                  <input className="mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} required />
                  <button type="submit" className="mb-4 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 w-full">Sign Up</button>
                </>
              )}
            </form>
            {message && <p className={`mt-4 text-center text-sm font-medium ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
          </motion.div>
          <motion.div 
            className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-gradient-to-r from-blue-500 to-teal-400 text-white"
            initial={false}
            animate={{ x: isLogin ? 0 : '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {isLogin ? (
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6">Hello, Friend!</h2>
                <p className="mb-6">Enter your personal details and start your journey with us</p>
                <button onClick={toggleView} className="p-3 bg-white text-blue-600 rounded-lg hover:bg-gradient-to-r from-pink-500 to-orange-500 hover:text-white transition duration-300">Sign Up</button>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6">Welcome Back!</h2>
                <p className="mb-6">Sign in to use our full range of features</p>
                <button onClick={toggleView} className="p-3 bg-white text-blue-600 rounded-lg hover:bg-gradient-to-r from-pink-500 to-orange-500 hover:text-white transition duration-300">Sign In</button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;