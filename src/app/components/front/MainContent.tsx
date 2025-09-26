"use client";

import { Play, Heart, MoreHorizontal, Clock, TrendingUp } from "lucide-react";
import { usePlayerStore } from "../../store/playerStore";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

type Song = {
  id: string;
  title: string;
  artist: string;
  image_url: string;
  audio_url: string;
};

const fetchSongs = async (): Promise<Song[]> => {
  const res = await fetch("/api/songs");
  if (!res.ok) {
    throw new Error("Failed to fetch songs");
  }
  return res.json();
};

export default function MainContent() {
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());
  const { currentSong, setCurrentSong } = usePlayerStore();

  const {
    data: songs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["songs"],
    queryFn: fetchSongs,
  });

  const greeting = (() => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning!";
    if (hours < 18) return "Good Afternoon!";
    return "Good Evening!";
  })();

  const quickPlaylists = [
    {
      id: 1,
      title: "Daily Mix 1",
      href: "/playlist/daily-mix-1",
      color: "from-purple-600 to-blue-600",
      icon: "🎵",
    },
    {
      id: 2,
      title: "Top Hits 2025",
      href: "/playlist/top-hits-2025",
      color: "from-green-600 to-teal-600",
      icon: "🔥",
    },
    {
      id: 3,
      title: "Chill Vibes",
      href: "/playlist/chill-vibes",
      color: "from-blue-600 to-cyan-600",
      icon: "🌊",
    },
    {
      id: 4,
      title: "Workout",
      href: "/playlist/workout",
      color: "from-red-600 to-orange-600",
      icon: "💪",
    },
    {
      id: 5,
      title: "Focus",
      href: "/playlist/focus",
      color: "from-indigo-600 to-purple-600",
      icon: "🎯",
    },
    {
      id: 6,
      title: "Recent Plays",
      href: "/playlist/recent",
      color: "from-gray-600 to-gray-800",
      icon: "⏰",
    },
  ];

  const toggleLike = (songId: string) => {
    setLikedSongs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(songId)) {
        newSet.delete(songId);
      } else {
        newSet.add(songId);
      }
      return newSet;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="flex-1 overflow-y-auto px-4 md:px-6 pt-6 pb-24 text-white min-h-screen">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          {greeting}
        </h1>
        <p className="text-gray-400 text-lg">
          Ready to discover your next favorite song?
        </p>
      </motion.div>

      {/* Quick Access Playlists */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-12"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickPlaylists.map(({ id, title, href, color, icon }, index) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={href}
                className={`relative flex items-center gap-4 bg-gradient-to-r ${color} p-4 rounded-xl group hover:shadow-lg transition-all duration-300 overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="text-2xl">{icon}</div>
                <div className="flex-1 font-semibold text-white truncate relative z-10">
                  {title}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Play ${title}`}
                  className="bg-white/90 text-black rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:bg-white relative z-10"
                >
                  <Play size={16} className="ml-0.5" />
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* New Uploads Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="text-green-500" size={24} />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            New Uploads
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * i, duration: 0.3 }}
                className="bg-gradient-to-br from-neutral-800 to-neutral-900 p-4 rounded-xl animate-pulse space-y-4 border border-neutral-700/50"
              >
                <div className="aspect-square w-full bg-neutral-700 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-4 bg-neutral-600 rounded w-3/4" />
                  <div className="h-3 bg-neutral-700 rounded w-1/2" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : isError ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 px-6 bg-red-950/20 border border-red-800/30 rounded-xl"
          >
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <p className="text-red-400 text-lg font-medium mb-2">
              Oops! Something went wrong
            </p>
            <p className="text-gray-400">
              Failed to load songs. Please try again later.
            </p>
          </motion.div>
        ) : songs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-6 bg-neutral-900/50 border border-neutral-700/50 rounded-xl"
          >
            <div className="text-gray-400 text-6xl mb-4">🎵</div>
            <p className="text-gray-300 text-xl font-medium mb-2">
              No songs yet
            </p>
            <p className="text-gray-500">
              Upload your first song to get started!
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            {songs.map((song, index) => (
              <motion.div
                key={song.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`relative bg-gradient-to-br from-neutral-900 to-neutral-800 p-4 rounded-xl hover:from-neutral-800 hover:to-neutral-700 transition-all duration-300 group cursor-pointer border border-neutral-700/50 hover:border-neutral-600/50 shadow-lg hover:shadow-xl ${
                  currentSong?.id === song.id
                    ? "ring-2 ring-green-500 border-green-500/50"
                    : ""
                }`}
              >
                {/* Image Container */}
                <div className="relative mb-4 aspect-square overflow-hidden rounded-lg">
                  <img
                    src={song.image_url}
                    alt={song.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

                  {/* Play button overlay */}
                  <motion.button
                    initial={false}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentSong(song)}
                    aria-label={`Play ${song.title}`}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <div className="bg-green-500 text-white rounded-full p-3 shadow-xl hover:bg-green-400 transition-colors">
                      <Play size={20} className="ml-0.5" />
                    </div>
                  </motion.button>

                  {/* Now playing indicator */}
                  <AnimatePresence>
                    {currentSong?.id === song.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                      >
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        Playing
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Song Info */}
                <div className="space-y-1 mb-3">
                  <Link href={`/songs/${song.id}`}>
                    <div className="font-semibold text-white truncate group-hover:text-green-400 transition-colors duration-200 hover:underline">
                      {song.title}
                    </div>
                  </Link>
                  <div className="text-gray-400 text-sm truncate hover:text-gray-300 transition-colors">
                    {song.artist}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(song.id);
                    }}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Heart
                      size={16}
                      className={
                        likedSongs.has(song.id)
                          ? "fill-red-400 text-red-400"
                          : ""
                      }
                    />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <MoreHorizontal size={16} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>

      {/* Recently Played Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Clock className="text-blue-500" size={24} />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Made For You
          </h2>
        </div>

        <div className="text-center py-12 px-6 bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 border border-neutral-700/30 rounded-xl">
          <div className="text-gray-400 text-4xl mb-3">🎨</div>
          <p className="text-gray-400">
            Personalized recommendations coming soon!
          </p>
        </div>
      </motion.section>
    </main>
  );
}
