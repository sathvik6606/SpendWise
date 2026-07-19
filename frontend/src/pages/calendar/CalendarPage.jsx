import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const load = async () => {
      try {
        const [transactionsRes, goalsRes, billsRes] = await Promise.all([
          axios.get('/api/transactions'),
          axios.get('/api/goals'),
          axios.get('/api/bills'),
        ]);

        const mapped = [
          ...transactionsRes.data.map((item) => ({ date: item.date.split('T')[0], title: item.title, type: 'expense' })),
          ...goalsRes.data.map((goal) => ({ date: goal.deadline.split('T')[0], title: goal.title, type: 'goal' })),
          ...billsRes.data.map((bill) => ({ date: bill.dueDate.split('T')[0], title: bill.name, type: 'bill' })),
        ];
        setEvents(mapped);
      } catch {
        // ignore
      }
    };
    load();
  }, []);

  const selectedEvents = useMemo(() => events.filter((event) => event.date === selectedDate), [events, selectedDate]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">Select a date</label>
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="flex h-10 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">{selectedDate}</p>
              {selectedEvents.length === 0 ? <p className="mt-2 text-sm text-slate-500">No financial events for this day.</p> : selectedEvents.map((event, index) => (
                <div key={`${event.title}-${index}`} className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">{event.title} • {event.type}</div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPage;
