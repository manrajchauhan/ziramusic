"use client";

import { useState } from "react";
import Sidebar from "@/app/components/front/Sidebar";
import Header from "@/app/components/front/Header";
import MainContent from "@/app/components/front/MainContent";
import PlayerBar from "@/app/components/front/PlayerBar";

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#121212] text-white overflow-hidden">
      {/* Sidebar for large screens */}
      <aside className="hidden sm:block w-64">
        <Sidebar />
      </aside>

      {/* Slide-in Sidebar for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="absolute left-0 top-0 w-64 h-full bg-[#1a1a1a] shadow-xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto">
          <MainContent />
        </main>
         <PlayerBar />
      </div>
    </div>
  );
}
