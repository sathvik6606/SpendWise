import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const useCurrency = () => {
  const { user, setUser } = useAuth();
  
  // Single source of truth is the user object from AuthContext
  const currency = user?.currency || 'USD';

  const setCurrency = async (newCurrency) => {
    if (!user) return;
    
    // Optimistic update in global state
    setUser({ ...user, currency: newCurrency });
    
    try {
      await axios.put('/api/auth/profile', { currency: newCurrency });
    } catch (error) {
      toast.error('Failed to update currency in backend');
      // In a more complex app, we might revert the optimistic update here
    }
  };

  const formatCurrency = (amount) => {
    const value = Number(amount) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return useMemo(() => ({ currency, setCurrency, formatCurrency }), [currency, setUser]);
};
