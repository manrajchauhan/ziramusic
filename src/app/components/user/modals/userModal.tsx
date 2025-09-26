"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";

interface UserModalProps {
  onClose: () => void;
}

export default function UserModal({ onClose }: UserModalProps) {
  const pathname = usePathname();

  const segments = pathname.split("/");
  const basePath = segments[1] ? `/${segments[1]}` : "";

  const handleLinkClick = () => {
    onClose();
  };

  const menuItems = [
    { href: `${basePath}/user/dashboard`, label: "Dashboard", icon: "📊" },
    { href: `${basePath}/user/settings`, label: "Settings", icon: "⚙️" },
    { href: `${basePath}/user/profile`, label: "Profile", icon: "👤" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -5, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -5, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="absolute right-0 top-full mt-2 w-60 bg-[#1f1f1f]/90 backdrop-blur-md rounded-xl shadow-2xl z-50 border border-neutral-700"
    >
      {/* User Info Section */}
      <div className="px-4 py-3 border-b border-neutral-700">
        <p className="font-semibold text-white">Welcome back!</p>
        <p className="text-xs text-gray-400">user@example.com</p>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        {menuItems.map((item) => (
          <motion.div
            key={item.href}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Link
              href={item.href}
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#2a2a2a] rounded-lg text-white text-sm transition-colors"
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Logout Section */}
      <div className="border-t border-neutral-700 pt-2 pb-2">
        <motion.button
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={() => {
            // your logout logic
            onClose();
          }}
          className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-red-500/10 rounded-lg text-left text-red-400 hover:text-red-300 text-sm transition-colors"
        >
          <span className="text-base">🚪</span>
          <span>Logout</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
