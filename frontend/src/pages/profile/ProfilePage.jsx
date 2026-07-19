import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '', currency: user?.currency || 'USD', timezone: 'UTC', theme: 'system' });

  const handleSave = async () => {
    try {
      const res = await axios.put('/api/auth/profile', form);
      setUser(res.data);
      toast.success('Profile updated');
    } catch {
      toast.error('Unable to update profile');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Display name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <Input type="password" placeholder="Leave blank to keep current" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Preferred currency</label>
              <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="INR">INR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave}>Save changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
