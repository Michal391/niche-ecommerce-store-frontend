import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserProfile } from '../services/api'; // Assuming you'll write this function to fetch the user profile

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null); // Store the user ID

  const login = async (userId) => {
    setUserId(userId);
    // Optionally fetch user profile upon login
    const userProfile = await getUserProfile(userId);
    setUser(userProfile); // Store the user profile in state
  };

  const logout = async () => {
    setUserId(null);
    setUser(null); // Clear the user profile when logging out
  };

  useEffect(() => {
    if (userId) {
      getUserProfile(userId).then((userProfile) => setUser(userProfile)); // Fetch the profile if the user ID is set
    }
  }, [userId]);

  return (
    <UserContext.Provider value={{ user, userId, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
