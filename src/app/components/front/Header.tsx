"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, Search, ChevronDown } from "lucide-react";
import Image from "next/image";
import UserModal from "@/app/components/front/modals/userModal";
import Link from "next/link";
type HeaderProps = {
  onToggleSidebar: () => void;
};

export default function Header({ onToggleSidebar }: HeaderProps) {
  const [showModal, setShowModal] = useState(false);
  const userRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-neutral-800 bg-[#181818] sticky top-0 z-50">
      {/* Left: Logo & Menu */}
      <div className="flex items-center gap-3">
        <button
          className="p-2 rounded-md hover:bg-[#2a2a2a] transition sm:hidden"
          aria-label="Toggle Menu"
          onClick={onToggleSidebar}
        >
          <Menu size={20} className="text-white" />
        </button>
        <Link
        href={"/"}
        className="hidden sm:block text-white font-semibold text-lg tracking-tight">
          ZIRA
        </Link>
      </div>

      {/* Center: Search */}
      <div className="flex items-center gap-2 bg-[#282828] rounded-full px-4 py-2 w-full max-w-sm text-sm focus-within:ring-1 focus-within:ring-green-500 transition mx-2">
        <Search size={18} className="text-gray-400" />
        <input
          type="search"
          placeholder="Search songs, artists..."
          className="bg-transparent text-white placeholder-gray-400 outline-none w-full"
        />
      </div>

      {/* Right: User Info */}
      <div
        className="relative"
        ref={userRef}
      >
        <div
          className="flex items-center gap-2 hover:bg-[#2a2a2a] rounded-full pl-2 pr-3 py-1 cursor-pointer transition"
          onClick={() => setShowModal((prev) => !prev)}
        >
          <Image
            src="https://i.pravatar.cc/32"
            alt="User Avatar"
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
          <span className="text-sm font-medium text-white hidden sm:block">Manraj</span>
          <ChevronDown size={16} className="text-gray-400" />
        </div>

        {showModal && <UserModal />}
      </div>
    </header>
  );
}
