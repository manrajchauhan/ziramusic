"use client";

import {
  Play,
  Heart,
  MoreHorizontal,
  Share2,
  Download,
  Clock,
  Calendar,
  Headphones,
  Music,
  ArrowLeft,
  ExternalLink,
  Pause,
} from "lucide-react";
import { usePlayerStore } from "../../../store/playerStore";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Song = {
  id: string;
  title: string;
  artist: string;
  image_url: string;
  audio_url: string;
  album?: string;
  genre?: string;
  duration?: string;
  release_date?: string;
  plays_count?: number;
  likes_count?: number;
  description?: string;
};

// Real API call to fetch song by ID
const fetchSongById = async (songId: string): Promise<Song> => {
  if (!songId) {
    throw new Error("Song ID is required");
  }

  try {
    // Replace this with your actual API endpoint
    const res = await fetch(`/api/songs/${songId}`);

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Song not found");
      }
      throw new Error(`Failed to fetch song: ${res.statusText}`);
    }

    const song = await res.json();
    return song;
  } catch (error) {
    console.error("Error fetching song:", error);
    throw new Error("Failed to load song data");
  }
};

// Alternative: If you have an endpoint that returns all songs and you want to filter by ID
const fetchAllSongsAndFindById = async (songId: string): Promise<Song> => {
  if (!songId) {
    throw new Error("Song ID is required");
  }

  try {
    const res = await fetch("/api/zira-app/songs");

    if (!res.ok) {
      throw new Error("Failed to fetch songs");
    }

    const songs: Song[] = await res.json();
    const song = songs.find((s) => s.id === songId);

    if (!song) {
      throw new Error("Song not found");
    }

    return song;
  } catch (error) {
    console.error("Error fetching song:", error);
    throw new Error("Failed to load song data");
  }
};

export default function SongPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const songId = params?.id as string;
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { currentSong, setCurrentSong, isPlaying, togglePlay } =
    usePlayerStore();

  const {
    data: song,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["song", songId], // Cache by song ID
    queryFn: () => fetchSongById(songId),
    enabled: !!songId, // Only fetch if songId exists
    retry: 2,
  });

  // Alternative approach if you prefer to fetch all songs and filter
  // const {
  //   data: song,
  //   isLoading,
  //   isError,
  // } = useQuery({
  //   queryKey: ["songs"],
  //   queryFn: () => fetchAllSongsAndFindById(songId),
  //   enabled: !!songId,
  // });

  // Check if this song is currently playing
  const isCurrentSong = currentSong?.id === songId;

  const handlePlayPause = () => {
    if (isCurrentSong) {
      togglePlay();
    } else if (song) {
      setCurrentSong(song);
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    // API call to update like status
    // await fetch(`/api/zira-app/songs/${songId}/like`, { method: 'POST' });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        handlePlayPause();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isCurrentSong, isPlaying, song]);

  if (isLoading) {
    return (
      <main className="flex-1 overflow-y-auto px-4 md:px-6 pt-6 pb-24 text-white min-h-screen bg-gradient-to-b from-neutral-900 to-black">
        <div className="animate-pulse">
          {/* Back button */}
          <div className="mb-6">
            <div className="w-24 h-8 bg-neutral-800 rounded-lg" />
          </div>

          {/* Hero section */}
          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            <div className="w-full max-w-sm mx-auto lg:mx-0">
              <div className="aspect-square w-full bg-neutral-800 rounded-2xl" />
            </div>
            <div className="flex-1 space-y-6 pt-4">
              <div className="space-y-4">
                <div className="h-8 bg-neutral-800 rounded w-1/4" />
                <div className="h-12 bg-neutral-800 rounded w-3/4" />
                <div className="h-6 bg-neutral-800 rounded w-1/2" />
                <div className="h-4 bg-neutral-800 rounded w-1/3" />
              </div>
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-neutral-800 rounded-full" />
                <div className="w-12 h-12 bg-neutral-800 rounded-full" />
                <div className="w-12 h-12 bg-neutral-800 rounded-full" />
                <div className="w-12 h-12 bg-neutral-800 rounded-full" />
                <div className="w-12 h-12 bg-neutral-800 rounded-full" />
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <div className="h-8 bg-neutral-800 rounded w-1/3" />
              <div className="h-32 bg-neutral-800 rounded-xl" />
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-neutral-800 rounded w-1/3" />
              <div className="h-32 bg-neutral-800 rounded-xl" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex-1 overflow-y-auto px-4 md:px-6 pt-6 pb-24 text-white min-h-screen bg-gradient-to-b from-neutral-900 to-black">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 px-6 bg-red-950/20 border border-red-800/30 rounded-xl max-w-md mx-auto mt-20"
        >
          <div className="text-red-400 text-6xl mb-4">🚫</div>
          <p className="text-red-400 text-lg font-medium mb-2">
            Error loading song
          </p>
          <p className="text-gray-400 mb-4">
            {error?.message || "There was an error loading the song."}
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors text-sm"
            >
              Retry
            </button>
            <button
              onClick={() => router.back()}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors text-sm"
            >
              Go Back
            </button>
            <button
              onClick={() => router.push("/tools/zira-app")}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full transition-colors text-sm text-black font-medium"
            >
              Browse Songs
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  if (!song) {
    return (
      <main className="flex-1 overflow-y-auto px-4 md:px-6 pt-6 pb-24 text-white min-h-screen bg-gradient-to-b from-neutral-900 to-black">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 px-6 bg-yellow-950/20 border border-yellow-800/30 rounded-xl max-w-md mx-auto mt-20"
        >
          <div className="text-yellow-400 text-6xl mb-4">❓</div>
          <p className="text-yellow-400 text-lg font-medium mb-2">
            Song not found
          </p>
          <p className="text-gray-400 mb-6">
            The song you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/tools/zira-app")}
            className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full transition-colors"
          >
            Browse Songs
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto px-4 md:px-6 pt-6 pb-24 text-white min-h-screen bg-gradient-to-b from-neutral-900 to-black">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform duration-200"
          />
          <span>Back</span>
        </button>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col lg:flex-row gap-8 mb-12"
      >
        {/* Album Art */}
        <div className="w-full max-w-sm mx-auto lg:mx-0">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="aspect-square w-full rounded-2xl overflow-hidden shadow-2xl relative group"
          >
            <Image
              src={song.image_url}
              alt={`Album cover for ${song.title}`}
              width={400}
              height={400}
              className="w-full h-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <AnimatePresence>
              {isCurrentSong && isPlaying && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute top-4 right-4 bg-green-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                  NOW PLAYING
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Song Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-gray-400 font-medium uppercase tracking-wider"
              >
                Song
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent break-words"
              >
                {song.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-300 font-medium"
              >
                by {song.artist}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap items-center gap-3 text-sm text-gray-400"
              >
                <span className="px-3 py-1 bg-gray-800 rounded-full text-xs font-medium">
                  {song.genre || "Music"}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {song.duration || "0:00"}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {song.release_date
                    ? formatDate(song.release_date)
                    : "Unknown date"}
                </span>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-6 text-sm text-gray-400"
            >
              <div className="flex items-center gap-2">
                <Headphones size={16} />
                <span>{formatNumber(song.plays_count || 0)} plays</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart size={16} />
                <span>{formatNumber(song.likes_count || 0)} likes</span>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap items-center gap-4 mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayPause}
              className="flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-400 text-black rounded-full font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!song.audio_url}
            >
              {isCurrentSong && isPlaying ? (
                <>
                  <Pause size={20} />
                  Pause
                </>
              ) : (
                <>
                  <Play size={20} className="ml-1" />
                  Play
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleLike}
              className={`p-4 rounded-full border-2 transition-all duration-200 ${
                isLiked
                  ? "border-red-500 bg-red-500/20 text-red-400"
                  : "border-gray-500 hover:border-red-400 hover:text-red-400 text-gray-400"
              }`}
            >
              <Heart size={20} className={isLiked ? "fill-current" : ""} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 rounded-full border-2 border-gray-500 hover:border-white hover:text-white text-gray-400 transition-all duration-200"
              title="Share song"
            >
              <Share2 size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 rounded-full border-2 border-gray-500 hover:border-white hover:text-white text-gray-400 transition-all duration-200"
              title="Download song"
            >
              <Download size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 rounded-full border-2 border-gray-500 hover:border-white hover:text-white text-gray-400 transition-all duration-200"
              title="More options"
            >
              <MoreHorizontal size={20} />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Rest of your component remains the same, just replace enhancedSong with song */}
      {/* Song Details Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mb-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* About */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Music size={24} className="text-green-500" />
              About this song
            </h2>
            <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-800/50 p-6 rounded-xl border border-neutral-700/50 backdrop-blur-sm">
              <p className="text-gray-300 leading-relaxed">
                {showFullDescription
                  ? song.description || "No description available."
                  : `${(
                      song.description || "No description available."
                    ).substring(0, 200)}${
                      song.description && song.description.length > 200
                        ? "..."
                        : ""
                    }`}
              </p>
              {song.description && song.description.length > 200 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-green-400 hover:text-green-300 mt-3 text-sm font-medium"
                >
                  {showFullDescription ? "Show less" : "Show more"}
                </motion.button>
              )}
            </div>
          </div>

          {/* Song Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Calendar size={24} className="text-blue-500" />
              Song Details
            </h2>
            <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-800/50 p-6 rounded-xl border border-neutral-700/50 backdrop-blur-sm space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-neutral-700/30">
                <span className="text-gray-400 font-medium">Album</span>
                <span className="text-white font-semibold">
                  {song.album || `${song.title} - Single`}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-700/30">
                <span className="text-gray-400 font-medium">Genre</span>
                <span className="text-white font-semibold">
                  {song.genre || "Music"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-700/30">
                <span className="text-gray-400 font-medium">Duration</span>
                <span className="text-white font-semibold flex items-center gap-2">
                  <Clock size={16} />
                  {song.duration || "0:00"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400 font-medium">Release Date</span>
                <span className="text-white font-semibold">
                  {song.release_date
                    ? formatDate(song.release_date)
                    : "Unknown"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Lyrics Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Music size={24} className="text-purple-500" />
          Lyrics
        </h2>
        <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-800/50 p-8 rounded-xl border border-neutral-700/50 backdrop-blur-sm text-center">
          <div className="text-gray-400 text-4xl mb-4">🎵</div>
          <p className="text-gray-400 text-lg">
            Lyrics for this song are not available yet.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Check back later for updates!
          </p>
        </div>
      </motion.section>

      {/* More from Artist */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <Headphones size={28} className="text-orange-500" />
            More from {song.artist}
          </h2>
          <Link
            href={`/tools/zira-app/artist/${encodeURIComponent(song.artist)}`}
            className="text-green-400 hover:text-green-300 text-sm font-medium flex items-center gap-2 group transition-colors duration-200"
          >
            View all
            <ExternalLink
              size={14}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </div>

        <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-800/50 p-12 rounded-xl border border-neutral-700/50 backdrop-blur-sm text-center">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="text-gray-400 text-6xl mb-6"
          >
            🎤
          </motion.div>
          <p className="text-gray-300 text-xl font-medium mb-2">
            Discover more from {song.artist}
          </p>
          <p className="text-gray-500">
            More songs and albums from this artist coming soon!
          </p>
        </div>
      </motion.section>

      {/* Keyboard Shortcut Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-24 right-6 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-400 border border-gray-700/50"
      >
        Press <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Space</kbd>{" "}
        to play/pause
      </motion.div>
    </main>
  );
}
