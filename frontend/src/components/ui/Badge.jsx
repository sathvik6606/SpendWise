import React from 'react';
import { cn } from '../../lib/utils';

export const Badge = ({ className, variant = 'default', children, ...props }) => {
    const variants = {
        default: 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100',
        primary: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300',
        success: 'bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300',
        danger: 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300',
    };

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
