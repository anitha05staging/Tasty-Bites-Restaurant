import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-admin-bg flex">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-h-screen max-w-full md:ml-72 transition-all duration-300">
                <TopBar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="p-4 md:p-10 flex-1">
                    <Outlet />
                </main>
                <footer className="p-10 text-center text-[11px] text-slate-400 font-bold uppercase tracking-widest border-t border-slate-100 bg-white">
                    &copy; 2026 Tasty Bites Admin • Simple & Powerful Management
                </footer>
            </div>
        </div>
    );
};

export default AdminLayout;
