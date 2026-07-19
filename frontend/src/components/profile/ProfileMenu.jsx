import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle2, Settings, Palette, DollarSign, Download, Upload, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ExportImportModals from './ExportImportModals';
import { toast } from 'react-hot-toast';

const ProfileMenu = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [modalType, setModalType] = useState(null);

  const handleAction = (target) => {
    if (target === 'settings') {
      navigate('/settings');
      onClose?.();
      return;
    }
    if (target === 'appearance') {
      navigate('/settings#appearance');
      onClose?.();
      return;
    }
    if (target === 'currency') {
      navigate('/settings#currency');
      onClose?.();
      return;
    }
    if (target === 'export') {
      setModalType('export');
      return;
    }
    if (target === 'import') {
      setModalType('import');
      return;
    }
    if (target === 'profile') {
      navigate('/profile');
      onClose?.();
      return;
    }
    if (target === 'logout') {
      logout();
      onClose?.();
      navigate('/login');
      toast.success('Logged out successfully');
    }
  };

  const items = [
    { label: 'Profile', icon: UserCircle2, target: 'profile' },
    { label: 'Settings', icon: Settings, target: 'settings' },
    { label: 'Appearance', icon: Palette, target: 'appearance' },
    { label: 'Currency', icon: DollarSign, target: 'currency' },
    { label: 'Export Data', icon: Download, target: 'export' },
    { label: 'Import Data', icon: Upload, target: 'import' },
  ];

  if (!open) return null;

  return (
    <>
      <div className="absolute right-0 top-12 z-[70] w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name || 'Account'}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email || 'Premium plan'}</p>
      </div>
      <div className="mt-2 space-y-1">
        {items.map((item) => (
          <button key={item.label} onClick={() => handleAction(item.target)} className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">
            <span className="flex items-center gap-2">
              <item.icon className="h-4 w-4 text-slate-400" />
              {item.label}
            </span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>
        ))}
      </div>
      <button onClick={() => handleAction('logout')} className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/40">
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </div>
    <ExportImportModals open={Boolean(modalType)} type={modalType} onClose={() => setModalType(null)} />
    </>
  );
};

export default ProfileMenu;
