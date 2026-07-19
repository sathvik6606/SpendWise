import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useTheme } from '../../hooks/useTheme';
import { useCurrency } from '../../hooks/useCurrency';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const SettingsPage = () => {
  const { user } = useAuth();
  const [theme, setTheme] = useTheme();
  const { currency, setCurrency } = useCurrency();
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage('spendwise-notifications', true);

  // Removed buggy useEffect that was overwriting state

  const handleThemeChange = (value) => {
    setTheme(value);
    toast.success(`Theme set to ${value}`);
  };

  const handleCurrencyChange = async (value) => {
    await setCurrency(value);
    toast.success('Currency updated');
  };

  return (
    <div className="space-y-6">
      <Card id="appearance">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            {['light', 'dark', 'system'].map((option) => (
              <button key={option} onClick={() => handleThemeChange(option)} className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${theme === option ? 'border-teal-600 bg-teal-50 text-teal-700 dark:border-teal-400 dark:bg-teal-950/40 dark:text-teal-300' : 'border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200'}`}>
                {option.charAt(0).toUpperCase() + option.slice(1)} mode
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700">
            <span className="text-sm text-slate-700 dark:text-slate-200">Enable desktop reminders</span>
            <input type="checkbox" checked={notificationsEnabled} onChange={() => setNotificationsEnabled((value) => !value)} className="h-4 w-4" />
          </label>
        </CardContent>
      </Card>

      <Card id="currency">
        <CardHeader>
          <CardTitle>Currency</CardTitle>
        </CardHeader>
        <CardContent>
          <select value={currency} onChange={(e) => handleCurrencyChange(e.target.value)} className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="INR">INR</option>
            <option value="GBP">GBP</option>
          </select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="secondary">Export data</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
