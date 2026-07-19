import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Modal = ({ isOpen, onClose, title, children, className }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    <div className={cn("relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all dark:bg-slate-900 sm:my-8 sm:w-full sm:max-w-lg", className)}>
                        
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                            <h3 className="text-lg font-semibold text-slate-900">
                                {title}
                            </h3>
                            <button
                                type="button"
                                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-500 transition-colors"
                                onClick={onClose}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-4">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
