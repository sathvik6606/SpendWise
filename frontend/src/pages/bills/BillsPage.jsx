import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, CalendarDays, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Input } from '../../components/ui/Input';

import { useCurrency } from '../../hooks/useCurrency';

const BillsPage = () => {
  const { formatCurrency } = useCurrency();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', amount: '', dueDate: '', reminder: true, paid: false, category: 'Utilities' });

  const fetchBills = async () => {
    try {
      const res = await axios.get('/api/bills');
      setBills(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBills(); }, []);

  const addBill = async () => {
    try {
      const res = await axios.post('/api/bills', { ...form, amount: Number(form.amount) });
      setBills((prev) => [...prev, res.data]);
      setForm({ name: '', amount: '', dueDate: '', reminder: true, paid: false, category: 'Utilities' });
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Bills</h2>
          <p className="text-sm text-slate-500">Track recurring obligations and stay ahead of due dates.</p>
        </div>
        <Button variant="secondary"> <Plus className="mr-2 h-4 w-4" /> Create bill</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add a bill</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="Utilities">Utilities</option>
            <option value="Housing">Housing</option>
            <option value="Insurance">Insurance</option>
            <option value="Subscriptions">Subscriptions</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.reminder} onChange={() => setForm({ ...form, reminder: !form.reminder })} />
            Reminder enabled
          </label>
          <Button onClick={addBill}>Save bill</Button>
        </CardContent>
      </Card>

      {loading ? <div className="grid gap-4 md:grid-cols-2">{[...Array(2)].map((_, i) => <Card key={i} className="h-28 animate-pulse" />)}</div> : bills.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No bills yet" description="Add your first bill to keep upcoming payments visible and manageable." actionLabel="Add your first bill" onAction={addBill} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {bills.map((bill) => (
            <Card key={bill._id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{bill.name}</p>
                    <p className="text-xs text-slate-500">Due {new Date(bill.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${bill.paid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {bill.paid ? 'Paid' : 'Upcoming'}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{formatCurrency(bill.amount)}</p>
                    <p className="text-xs text-slate-500">{bill.category}</p>
                  </div>
                  {bill.paid ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <CalendarDays className="h-5 w-5 text-slate-400" />}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BillsPage;
