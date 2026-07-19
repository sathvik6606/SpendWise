import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const ModalShell = ({ open, title, onClose, children, size = 'md' }) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const sizeClass = size === 'lg' ? 'max-w-3xl' : 'max-w-2xl';

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 px-4 py-8">
      <div className={`w-full ${sizeClass} rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900`}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default ModalShell;
