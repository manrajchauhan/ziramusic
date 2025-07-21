"use client";

import { motion } from "framer-motion";

export default function UserModal() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-0 top-full mt-2 w-48 bg-[#1f1f1f] rounded-md shadow-lg z-50 border border-neutral-700"
    >
      <div className="flex flex-col py-2 text-sm text-white">
        <button className="px-4 py-2 hover:bg-[#2a2a2a] text-left">Profile</button>
        <button className="px-4 py-2 hover:bg-[#2a2a2a] text-left">Settings</button>
        <button className="px-4 py-2 hover:bg-[#2a2a2a] text-left text-red-400">Logout</button>
      </div>
    </motion.div>
  );
}
