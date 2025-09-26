"use client";

import {
  Play,
  Heart,
  MoreHorizontal,
  Clock,
  Music,
  Shuffle,
  Download,
} from "lucide-react";
import { usePlayerStore } from "../../../store/playerStore";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useParams } from "next/navigation";

type Song = {
  id: string;
  title: string;
  artist: string;
  image_url: string;
  audio_url: string;
  duration?: string; // Added for playlist view
  album?: string; // Added for playlist view
};

type Playlist = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  songs: Song[];
  total_duration: string;
  created_by: string;
};

const fetchPlaylist = async (playlistId: string): Promise<Playlist> => {
  const res = await fetch(`/api/playlist/${playlistId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch playlist");
  }
  return res.json();
};

const fetchSongs = async (): Promise<Song[]> => {
  const res = await fetch("/api/zira-app/songs");
  if (!res.ok) {
    throw new Error("Failed to fetch songs");
  }
  return res.json();
};

export default function PlaylistID() {
  const params = useParams();
  const playlistId = params?.id as string;
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());
  const { currentSong, setCurrentSong } = usePlayerStore();

  // For demo purposes, we'll use the songs endpoint since playlist endpoint might not exist
  const {
    data: songs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["playlist-songs", playlistId],
    queryFn: fetchSongs, // In real app, this would be () => fetchPlaylist(playlistId)
  });

  // Mock playlist data for demo
  const playlistInfo = {
    // title: getPlaylistTitle(playlistId),
    // description: getPlaylistDescription(playlistId),
    image_url: "/zira-app/playlists/1.png",
    total_duration: "2h 34min",
    created_by: "Zira Music",
    song_count: songs.length,
  };

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

  const formatDuration = (index: number) => {
    // Mock duration for demo
    const minutes = Math.floor(Math.random() * 4) + 2;
    const seconds = Math.floor(Math.random() * 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <main className="flex-1 overflow-y-auto px-4 md:px-6 pt-6 pb-24 text-white min-h-screen">
        <div className="animate-pulse">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-64 h-64 bg-neutral-700 rounded-xl" />
            <div className="flex-1 space-y-4">
              <div className="h-12 bg-neutral-700 rounded w-1/2" />
              <div className="h-4 bg-neutral-700 rounded w-3/4" />
              <div className="h-4 bg-neutral-700 rounded w-1/4" />
            </div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 rounded-lg bg-neutral-800/50"
              >
                <div className="w-12 h-12 bg-neutral-700 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-700 rounded w-1/3" />
                  <div className="h-3 bg-neutral-700 rounded w-1/4" />
                </div>
                <div className="h-4 bg-neutral-700 rounded w-12" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex-1 overflow-y-auto px-4 md:px-6 pt-6 pb-24 text-white min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 px-6 bg-red-950/20 border border-red-800/30 rounded-xl"
        >
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <p className="text-red-400 text-lg font-medium mb-2">
            Failed to load playlist
          </p>
          <p className="text-gray-400">Please try again later.</p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto px-4 md:px-6 pt-6 pb-24 text-white min-h-screen">
      {/* Playlist Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row gap-6 mb-8"
      >
        <div className="w-64 h-64 rounded-xl overflow-hidden shadow-2xl">
          <img
            src={playlistInfo.image_url}
            // alt={playlistInfo.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-end space-y-4">
          <div className="text-sm text-gray-400 font-medium">PLAYLIST</div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            {/* {playlistInfo.title} */}
          </h1>
          {/* <p className="text-gray-300 max-w-md">{playlistInfo.description}</p> */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="text-white font-medium">
              {playlistInfo.created_by}
            </span>
            <span>•</span>
            <span>{playlistInfo.song_count} songs</span>
            <span>•</span>
            <span>{playlistInfo.total_duration}</span>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex items-center gap-4 mb-8"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-500 hover:bg-green-400 text-black rounded-full p-4 transition-colors duration-200 shadow-lg"
        >
          <Play size={24} className="ml-1" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          <Shuffle size={24} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          <Download size={24} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          <MoreHorizontal size={24} />
        </motion.button>
      </motion.div>

      {/* Songs List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {/* List Header */}
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-2 text-sm text-gray-400 border-b border-neutral-700 mb-4">
          <div className="w-8">#</div>
          <div>TITLE</div>
          <div className="hidden md:block">ALBUM</div>
          <div>
            <Clock size={16} />
          </div>
        </div>

        {/* Songs */}
        <div className="space-y-1">
          {songs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 px-6"
            >
              <Music className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-300 text-xl font-medium mb-2">
                No songs in this playlist
              </p>
              <p className="text-gray-500">
                Start adding songs to build your perfect playlist!
              </p>
            </motion.div>
          ) : (
            songs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.3 }}
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                className={`grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-3 rounded-lg group cursor-pointer transition-colors duration-200 ${
                  currentSong?.id === song.id
                    ? "bg-green-500/10 border-l-4 border-green-500"
                    : ""
                }`}
                onClick={() => setCurrentSong(song)}
              >
                {/* Track Number / Play Button */}
                <div className="w-8 flex items-center justify-center">
                  <span className="text-gray-400 text-sm group-hover:hidden">
                    {index + 1}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="hidden group-hover:block text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSong(song);
                    }}
                  >
                    <Play size={16} />
                  </motion.button>
                </div>

                {/* Song Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={song.image_url}
                    alt={song.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div
                      className={`font-medium truncate ${
                        currentSong?.id === song.id
                          ? "text-green-400"
                          : "text-white"
                      }`}
                    >
                      {song.title}
                    </div>
                    <div className="text-sm text-gray-400 truncate">
                      {song.artist}
                    </div>
                  </div>
                </div>

                {/* Album (hidden on mobile) */}
                <div className="hidden md:flex items-center">
                  <span className="text-gray-400 text-sm truncate">
                    {song.title} - Single
                  </span>
                </div>

                {/* Duration & Actions */}
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(song.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all duration-200"
                  >
                    <Heart
                      size={16}
                      className={
                        likedSongs.has(song.id)
                          ? "fill-red-400 text-red-400 opacity-100"
                          : ""
                      }
                    />
                  </motion.button>

                  <span className="text-gray-400 text-sm min-w-[3rem] text-right">
                    {formatDuration(index)}
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all duration-200"
                  >
                    <MoreHorizontal size={16} />
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </main>
  );
}
