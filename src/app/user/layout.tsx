'use client';

import { useState } from 'react';
import DashboardSidebar from '@/app/components/user/Sidebar';
import DashboardHeader from '@/app/components/user/Header';
import Providers from '../Providers';


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <Providers>
    <div className="flex h-screen bg-[#121212] text-white overflow-hidden">
      <aside className="hidden sm:block w-64">
        <DashboardSidebar />
      </aside>

      <div
        className={`fixed inset-0 z-40 bg-black/50 sm:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      >
        <div
          className={`absolute top-0 left-0 w-64 h-full bg-[#1a1a1a] shadow-xl p-4 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <DashboardSidebar />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 bg-[#121212] border-b border-neutral-800">
          <DashboardHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        </div>

        {/* Main Content Scrollable */}
        <main className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
          {children}
        </main>
      </div>
    </div>
    </Providers>
  );
}
