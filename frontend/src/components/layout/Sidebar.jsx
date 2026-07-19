import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ArrowRightLeft, 
    PieChart, 
    Target, 
    LineChart,
    Wallet,
    LogOut,
    ReceiptText,
    CalendarDays,
    Sparkles,
    Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: ArrowRightLeft },
    { name: 'Budgets', href: '/budgets', icon: PieChart },
    { name: 'Savings Goals', href: '/goals', icon: Target },
    { name: 'Bills', href: '/bills', icon: ReceiptText },
    { name: 'Calendar', href: '/calendar', icon: CalendarDays },
    { name: 'Insights', href: '/insights', icon: Sparkles },
    { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
    const { logout } = useAuth();

    return (
        <>
            {/* Mobile backdrop */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar component */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out dark:border-slate-700 dark:bg-slate-900 lg:translate-x-0 lg:static lg:flex-shrink-0",
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-16 shrink-0 items-center border-b border-slate-100 px-6 dark:border-slate-800">
                    <Link to="/" className="flex items-center gap-2 text-teal-700">
                        <Wallet size={28} strokeWidth={2} />
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">SpendWise</span>
                    </Link>
                </div>

                <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
                    <nav className="flex-1 space-y-1">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={({ isActive }) => cn(
                                    "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                                    isActive 
                                        ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100" 
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                                )}
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon
                                            className={cn(
                                                "mr-3 h-5 w-5 shrink-0 transition-colors",
                                                isActive ? "text-teal-700" : "text-slate-400 group-hover:text-slate-600"
                                            )}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="mt-auto pt-6">
                        <button
                            onClick={() => logout()}
                            className="group flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                        >
                            <LogOut className="mr-3 h-5 w-5 shrink-0 text-slate-400 group-hover:text-slate-600" />
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
