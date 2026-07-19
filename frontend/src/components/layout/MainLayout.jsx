import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950 flex">
            <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
            
            <div className="flex-1 flex flex-col min-w-0">
                <Header setIsMobileOpen={setIsMobileOpen} />
                
                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
