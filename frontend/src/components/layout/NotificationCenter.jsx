import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, Trash2, Sparkles } from 'lucide-react';
import axios from 'axios';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

const NotificationCenter = ({ open }) => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  const markRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}`);
      setNotifications((prev) => prev.map((item) => (item._id === id ? { ...item, read: true } : item)));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    } catch {}
  };

  const removeNotification = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((item) => item._id !== id));
    } catch {}
  };

  if (!open) return null;

  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <div className="absolute right-0 top-12 z-[70] w-[360px] rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notifications</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{unreadCount} unread</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={markAllRead} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <CheckCheck className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="max-h-[420px] overflow-y-auto p-2">
        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-10 text-center">
            <Bell className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-3 text-sm font-medium text-slate-700">No notifications yet</p>
            <p className="mt-1 text-sm text-slate-500">You’ll see bill, budget, and goal updates here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div key={notification._id} className={cn('rounded-xl border p-3', notification.read ? 'border-slate-100 bg-white' : 'border-teal-100 bg-teal-50/60')}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                      <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                  </div>
                  <button onClick={() => removeNotification(notification._id)} className="rounded-full p-1 text-slate-400 hover:bg-white hover:text-slate-700">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <button onClick={() => markRead(notification._id)} className="text-xs font-medium text-teal-700">
                    {notification.read ? 'Read' : 'Mark read'}
                  </button>
                  <span className="text-xs text-slate-400">{new Date(notification.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
