import React, { useState } from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import CommandPalette from './CommandPalette';
import NotificationCenter from './NotificationCenter';
import ProfileMenu from '../profile/ProfileMenu';

const getPageTitle = (pathname) => {
    switch (pathname) {
        case '/dashboard': return 'Dashboard';
        case '/transactions': return 'Transactions';
        case '/budgets': return 'Budgets';
        case '/goals': return 'Savings Goals';
        case '/analytics': return 'Insights';
        case '/profile': return 'Profile';
        case '/settings': return 'Settings';
        case '/bills': return 'Bills';
        case '/calendar': return 'Calendar';
        case '/insights': return 'Insights';
        default: return '';
    }
};

const Header = ({ setIsMobileOpen }) => {
    const { user } = useAuth();
    const location = useLocation();
    const title = getPageTitle(location.pathname);
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white px-4 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900 sm:gap-x-6 sm:px-6 lg:px-8">
            <button
                type="button"
                className="-m-2.5 p-2.5 text-slate-700 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 lg:hidden"
                onClick={() => setIsMobileOpen(true)}
            >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div className="flex flex-1 items-center">
                    <h1 className="hidden text-xl font-semibold leading-6 text-slate-900 transition-colors duration-300 dark:text-slate-100 sm:block">
                        {title}
                    </h1>
                </div>
                
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <button type="button" onClick={() => setIsPaletteOpen(true)} className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-500 transition-colors">
                        <span className="sr-only">Search</span>
                        <Search className="h-5 w-5" aria-hidden="true" />
                    </button>

                    <div className="relative">
                        <button type="button" onClick={() => setIsNotificationsOpen((value) => !value)} className="-m-2.5 p-2.5 text-slate-400 transition-colors hover:text-slate-500 dark:text-slate-400 dark:hover:text-slate-200">
                            <span className="sr-only">View notifications</span>
                            <Bell className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <NotificationCenter open={isNotificationsOpen} />
                    </div>

                    <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200" aria-hidden="true" />

                    <div className="relative flex items-center gap-x-4">
                        <button type="button" onClick={() => setIsProfileOpen((value) => !value)} className="-m-1.5 flex items-center rounded-full p-1.5 text-slate-900 transition-colors hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800">
                            <span className="sr-only">Open user menu</span>
                            {user?.avatar ? (
                                <img
                                    className="h-8 w-8 rounded-full bg-slate-50 object-cover ring-1 ring-slate-200"
                                    src={user.avatar}
                                    alt={user.name}
                                />
                            ) : (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-800 ring-1 ring-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:ring-teal-800">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            )}
                            <span className="hidden lg:flex lg:items-center">
                                <span className="ml-3 text-sm font-medium leading-6 text-slate-700 dark:text-slate-300" aria-hidden="true">
                                    {user?.name}
                                </span>
                            </span>
                        </button>
                        <ProfileMenu open={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
                    </div>
                </div>
            </div>
            <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
        </header>
    );
};

export default Header;
