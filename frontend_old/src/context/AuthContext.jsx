import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in (persistence)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/auth/me');
        if (res.data.success) setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await API.post('/auth/login', { email, password });
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur de connexion";
      setError(msg);
      throw new Error(msg);
    }
  };

  const signup = async (data) => {
    setError(null);
    try {
      const res = await API.post('/auth/register', data);
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur d'inscription";
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
      setUser(null);
      localStorage.removeItem('user');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, error, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);