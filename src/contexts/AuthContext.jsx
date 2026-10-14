import { useState } from 'react';
import { AuthContext } from './AuthContextValue';

const getStoredUser = () => {
  const storedUser = localStorage.getItem('videobelajar_user');
  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error('Error parsing stored user:', error);
    localStorage.removeItem('videobelajar_user');
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  const login = (email, password) => {
    // Static authentication - in real app, would call API
    // For now, accept any non-empty email/password
    if (email && password) {
      const userData = {
        email,
        name: email.split('@')[0],
        loginTime: new Date().toISOString()
      };
      setUser(userData);
      localStorage.setItem('videobelajar_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = (fullName, email, phone, password, confirmPassword) => {
    // Static registration - in real app, would call API
    // Validate that passwords match
    if (fullName && email && phone && password && password === confirmPassword) {
      const userData = {
        email,
        name: fullName,
        phone,
        loginTime: new Date().toISOString()
      };
      setUser(userData);
      localStorage.setItem('videobelajar_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const updateUser = (updates) => {
    const userData = { ...user, ...updates };
    setUser(userData);
    localStorage.setItem('videobelajar_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('videobelajar_user');
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading: false,
      login,
      register,
      updateUser,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}
