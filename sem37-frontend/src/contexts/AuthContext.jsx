import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

// Create the context, which will be available to all components
const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Function to call the backend API and log in
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        email,
        password,
      });
      const { token } = response.data;
      setToken(token);
      localStorage.setItem('token', token); // Save the token in browser storage
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  // Function to log out
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily use the auth context in other components
export const useAuth = () => {
  return useContext(AuthContext);
};