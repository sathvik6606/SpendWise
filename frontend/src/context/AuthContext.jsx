import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// ✅ Set header synchronously at module load time so it's ready before any requests fire
const storedToken = localStorage.getItem('token');
if (storedToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(storedToken);
    const [loading, setLoading] = useState(true);

    const API_URL = '/api/auth';

    // Keep header and localStorage in sync whenever token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, [token]);

    // Load user profile on mount if token exists
    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get(`${API_URL}/profile`);
                setUser(res.data);
            } catch (error) {
                console.error('Error loading user:', error);
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []); // ✅ Run only once on mount — token is already set synchronously above

    const register = async (userData) => {
        try {
            const res = await axios.post(`${API_URL}/register`, userData);
            setToken(res.data.token);
            setUser(res.data);
            toast.success('Registration successful!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            return false;
        }
    };

    const login = async (userData) => {
        try {
            const res = await axios.post(`${API_URL}/login`, userData);
            setToken(res.data.token);
            setUser(res.data);
            toast.success('Logged in successfully');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        toast.success('Logged out');
    };

    const value = {
        user,
        setUser,
        token,
        loading,
        register,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
