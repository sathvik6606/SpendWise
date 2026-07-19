import React from 'react';
import { cn } from '../../lib/utils';

export const Card = ({ className, children, ...props }) => {
    return (
        <div className={cn("rounded-xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900", className)} {...props}>
            {children}
        </div>
    );
};

export const CardHeader = ({ className, children, ...props }) => {
    return (
        <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
            {children}
        </div>
    );
};

export const CardTitle = ({ className, children, ...props }) => {
    return (
        <h3 className={cn("text-lg font-semibold leading-none tracking-tight text-slate-900 transition-colors duration-300 dark:text-slate-100", className)} {...props}>
            {children}
        </h3>
    );
};

export const CardContent = ({ className, children, ...props }) => {
    return (
        <div className={cn("p-6 pt-0", className)} {...props}>
            {children}
        </div>
    );
};
