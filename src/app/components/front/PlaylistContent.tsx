"use client";

import React, { useState } from "react";
import { Play, Search, Filter } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

type Playlist = {
  id: string;
  title: string;
  image_url: string;
  tags: string[];
  playlistby?: string;
};

export default function PlaylistContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState<string>("all");

  // Mock data - replace with your actual data fetching
  const playlists: Playlist[] = [
    {
      id: "1",
      title: "Daily Mix 1",
      playlistby: "Manraj",
      image_url:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop",
      tags: ["daily", "personalized"],
    },
    {
      id: "2",
      title: "Top Hits 2025",
      playlistby: "Manraj",
      image_url:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=600&fit=crop",
      tags: ["trending", "popular"],
    },
    {
      id: "3",
      title: "Chill Vibes",
      playlistby: "Manraj",
      image_url:
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=600&fit=crop",
      tags: ["chill", "relaxing"],
    },
    {
      id: "4",
      title: "Workout Motivation",
      playlistby: "Manraj",
      image_url:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop",
      tags: ["workout", "energetic"],
    },
    {
      id: "5",
      title: "Focus Flow",
      playlistby: "Manraj",
      image_url:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=600&fit=crop",
      tags: ["focus", "instrumental"],
    },
    {
      id: "6",
      title: "Road Trip Classics",
      playlistby: "Manraj",
      image_url:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
      tags: ["travel", "classic"],
    },
  ];

  const allTags = [
    "all",
    ...Array.from(new Set(playlists.flatMap((p) => p.tags))),
  ];

  const filteredPlaylists = playlists.filter((playlist) => {
    const matchesSearch = playlist.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterTag === "all" || playlist.tags.includes(filterTag);
    return matchesSearch && matchesFilter;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        duration: 0.4,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="flex-1 overflow-y-auto px-4 md:px-6 pt-6 pb-24 text-white min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-1 tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Your Library
        </h1>
        <p className="text-gray-400 text-sm">
          Discover and organize your music collections
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.45 }}
        className="flex flex-col md:flex-row gap-3 mb-6"
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search playlists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 bg-neutral-900/50 border border-neutral-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400" size={18} />
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="bg-neutral-900/50  border-neutral-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          >
            {allTags.map((tag) => (
              <option key={tag} value={tag} className="bg-neutral-900">
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Grid Cards Only (smaller, with name) */}
      <motion.div
        key="grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        {filteredPlaylists.map((playlist) => (
          <motion.div
            key={playlist.id}
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="p-2 rounded-xl hover:bg-neutral-800/30 transition-all group cursor-pointer border-neutral-700/30 hover:shadow-lg"
          >
            <div className="relative overflow-hidden rounded-md h-32">
              <img
                src={playlist.image_url}
                alt={playlist.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/18 group-hover:bg-black/30 transition-colors" />

              {/* Play button overlay */}
              <Link href={`/playlist/${playlist.id}`}>
                <motion.div
                  initial={false}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <div className="bg-green-500 text-white rounded-full p-3 shadow-md hover:bg-green-400 transition-colors">
                    <Play size={18} />
                  </div>
                </motion.div>
              </Link>
            </div>

            {/* Title (small) */}
            <h3 className="mt-2 text-md font-medium text-white truncate hover:underline">
              {playlist.title}
            </h3>
            {playlist.playlistby && (
              <p className="text-xs text-gray-400 truncate">
                {playlist.playlistby}
              </p>
            )}
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
