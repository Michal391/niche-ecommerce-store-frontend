import React, { createContext, useContext, useState, useEffect } from 'react';
import jwtService from '../services/jwtService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async () => {
    const userFromToken = jwtService.getUserFromToken();
    if (userFromToken) {
      setUser(userFromToken);
    }
  };

  const logout = async () => {
    jwtService.removeToken();
    setUser(null);
  };

  useEffect(() => {
    login(); // Try to set user on mount
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
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
