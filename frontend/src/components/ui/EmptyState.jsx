import React from 'react';
import { Button } from './Button';

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-8 py-14 text-center dark:border-slate-700 dark:bg-slate-800/70">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
        {Icon ? <Icon className="h-6 w-6 text-slate-600 dark:text-slate-300" /> : null}
      </div>
      <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {actionLabel ? (
        <Button onClick={onAction} className="mt-6" variant="secondary">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};

export { EmptyState };
