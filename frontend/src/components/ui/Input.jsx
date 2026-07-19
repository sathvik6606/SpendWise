import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, type, error, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
