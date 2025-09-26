"use client";

import {
  Pause,
  Play,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  Heart,
  MoreHorizontal,
  Shuffle,
  Repeat,
  Repeat1,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../../store/playerStore";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

function formatTime(seconds: number) {
  if (isNaN(seconds) || !isFinite(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(1, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

export default function PlayerBar() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    currentSong,
    isPlaying,
    setIsPlaying,
    progress,
    setProgress,
    playNext,
    playPrevious,
    nextSongs,
    previousSongs,
  } = usePlayerStore();

  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [previousVolume, setPreviousVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one
  const [volumeSliderTimeout, setVolumeSliderTimeout] =
    useState<NodeJS.Timeout | null>(null);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => playNext(),
    onSwipedRight: () => playPrevious(),
    onSwipedUp: () => setIsFullscreen(true),
    onSwipedDown: () => setIsFullscreen(false),
    trackMouse: false,
  });

  // Handle audio playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    const handleLoadStart = () => {
      setDuration(0);
      setProgress(0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleEnded = () => {
      if (repeatMode === 2) {
        // Repeat one
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        playNext();
      }
    };

    const handleError = (e: ErrorEvent) => {
      console.error("Audio error:", e);
    };

    // Set audio source and volume
    audio.src = currentSong.audio_url;
    audio.volume = volume;
    audio.muted = isMuted;

    // Add event listeners
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError as EventListener);

    // Play/pause handling
    if (isPlaying) {
      audio.play().catch((error) => {
        console.log("Playback error:", error);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError as EventListener);
    };
  }, [
    currentSong,
    isPlaying,
    volume,
    isMuted,
    repeatMode,
    playNext,
    setProgress,
    setIsPlaying,
  ]);

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setProgress(value);
    }
  };

  const togglePlayPause = () => {
    if (!currentSong) return;
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    setIsMuted(v === 0);
    if (v > 0) setPreviousVolume(v);
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => (prev + 1) % 3);
  };

  const getRepeatIcon = () => {
    if (repeatMode === 0) return <Repeat size={16} className="opacity-50" />;
    if (repeatMode === 1)
      return <Repeat size={16} className="text-green-500" />;
    return <Repeat1 size={16} className="text-green-500" />;
  };

  const handleVolumeSliderMouseEnter = () => {
    if (volumeSliderTimeout) {
      clearTimeout(volumeSliderTimeout);
      setVolumeSliderTimeout(null);
    }
    setShowVolumeSlider(true);
  };

  const handleVolumeSliderMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowVolumeSlider(false);
    }, 500);
    setVolumeSliderTimeout(timeout);
  };

  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[#121212] to-[#181818] border-t border-neutral-800 text-white shadow-2xl backdrop-blur-xl"
        {...swipeHandlers}
      >
        {/* Progress Bar at Top */}
        <div className="px-0">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={progress}
            onChange={handleSeek}
            className="w-full h-1 accent-green-500 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-track]:bg-neutral-800 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
            style={{
              background: `linear-gradient(to right, #1db954 0%, #1db954 ${progressPercentage}%, #404040 ${progressPercentage}%, #404040 100%)`,
            }}
          />
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-between h-20 px-4 md:px-6">
          {/* Song Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {currentSong ? (
              <>
                <div className="relative group">
                  <Image
                    src={currentSong.image_url}
                    alt={currentSong.title}
                    width={56}
                    height={56}
                    className="rounded-lg object-cover shadow-lg transition-transform group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="truncate min-w-0 flex-1">
                  <Link
                    href={`/songs/${currentSong.id}`}
                    className="font-medium text-sm truncate text-white hover:underline cursor-pointer"
                  >
                    {currentSong.title}
                  </Link>
                  <div className="text-xs text-gray-400 truncate hover:text-white cursor-pointer transition-colors">
                    {currentSong.artist}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsLiked(!isLiked)}
                  className="hidden md:block"
                >
                  <Heart
                    size={18}
                    className={`transition-colors ${
                      isLiked
                        ? "text-green-500 fill-green-500"
                        : "text-gray-400 hover:text-white"
                    }`}
                  />
                </motion.button>
              </>
            ) : (
              <div className="text-sm text-gray-400 italic flex items-center gap-2">
                <div className="w-14 h-14 bg-neutral-800 rounded-lg animate-pulse" />
                <span>Select a song to play</span>
              </div>
            )}
          </div>

          {/* Center Controls */}
          <div className="flex items-center gap-2 md:gap-4 justify-center flex-1 max-w-sm">
            <div className="hidden md:flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsShuffled(!isShuffled)}
                className={`transition-colors ${
                  isShuffled
                    ? "text-green-500"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Shuffle size={16} />
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={playPrevious}
              disabled={previousSongs.length === 0}
              className={`transition-colors ${
                previousSongs.length === 0
                  ? "opacity-30 cursor-not-allowed"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <SkipBack size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlayPause}
              disabled={!currentSong}
              className={`p-2 rounded-full transition-all ${
                !currentSong
                  ? "opacity-50 cursor-not-allowed bg-neutral-800"
                  : "bg-white hover:bg-gray-200 text-black hover:scale-110 shadow-lg"
              }`}
            >
              {isPlaying ? (
                <Pause size={20} />
              ) : (
                <Play size={20} className="ml-0.5" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={playNext}
              disabled={nextSongs.length === 0}
              className={`transition-colors ${
                nextSongs.length === 0
                  ? "opacity-30 cursor-not-allowed"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <SkipForward size={20} />
            </motion.button>

            <div className="hidden md:block">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleRepeat}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {getRepeatIcon()}
              </motion.button>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 md:gap-3 justify-end flex-1">
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
              <span className="min-w-[35px] text-right">
                {formatTime(progress)}
              </span>
              <span>/</span>
              <span className="min-w-[35px] text-left">
                {formatTime(duration)}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <div
                className="relative"
                onMouseEnter={handleVolumeSliderMouseEnter}
                onMouseLeave={handleVolumeSliderMouseLeave}
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMute}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX size={18} />
                  ) : (
                    <Volume2 size={18} />
                  )}
                </motion.button>

                <AnimatePresence>
                  {showVolumeSlider && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-neutral-900 rounded-lg p-3 shadow-xl border border-neutral-700"
                    >
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={handleVolumeChange}
                        className="h-24 accent-green-500 appearance-none bg-neutral-700 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFullscreen(true)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Maximize2 size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-400 hover:text-white transition-colors md:hidden"
            >
              <MoreHorizontal size={18} />
            </motion.button>
          </div>
        </div>

        {/* Audio Element */}
        <audio
          ref={audioRef}
          preload="metadata"
          onError={(e) => console.error("Audio loading error:", e)}
        />
      </div>

      {/* Fullscreen Mode */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 text-white flex flex-col"
            style={{
              backgroundImage: currentSong?.image_url
                ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${currentSong.image_url})`
                : "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            {/* Header */}
            <div className="relative z-10 flex justify-between items-center p-6">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-lg font-medium tracking-tight"
              >
                Now Playing
              </motion.h1>
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
              {currentSong ? (
                <>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                  >
                    <Image
                      src={currentSong.image_url}
                      alt={currentSong.title}
                      width={320}
                      height={320}
                      className="rounded-2xl object-cover shadow-2xl"
                      priority
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mb-8 max-w-md"
                  >
                    <h2 className="text-3xl font-bold mb-2 text-white">
                      {currentSong.title}
                    </h2>
                    <p className="text-xl text-gray-300">
                      {currentSong.artist}
                    </p>
                  </motion.div>

                  {/* Progress Bar */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="w-full max-w-md mb-6"
                  >
                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      step={0.1}
                      value={progress}
                      onChange={handleSeek}
                      className="w-full h-2 accent-green-500 appearance-none bg-white/20 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                    />
                    <div className="flex justify-between text-sm text-gray-300 mt-2">
                      <span>{formatTime(progress)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </motion.div>

                  {/* Controls */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-8"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={playPrevious}
                      disabled={previousSongs.length === 0}
                      className={`transition-colors ${
                        previousSongs.length === 0
                          ? "opacity-30 cursor-not-allowed"
                          : "text-white hover:text-green-500"
                      }`}
                    >
                      <SkipBack size={32} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={togglePlayPause}
                      disabled={!currentSong}
                      className={`p-4 rounded-full transition-all ${
                        !currentSong
                          ? "opacity-50 cursor-not-allowed bg-neutral-800"
                          : "bg-white hover:bg-gray-200 text-black hover:scale-110 shadow-lg"
                      }`}
                    >
                      {isPlaying ? (
                        <Pause size={32} />
                      ) : (
                        <Play size={32} className="ml-1" />
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={playNext}
                      disabled={nextSongs.length === 0}
                      className={`transition-colors ${
                        nextSongs.length === 0
                          ? "opacity-30 cursor-not-allowed"
                          : "text-white hover:text-green-500"
                      }`}
                    >
                      <SkipForward size={32} />
                    </motion.button>
                  </motion.div>

                  {/* Additional Controls */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-6 mt-8"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart
                        size={24}
                        className={`transition-colors ${
                          isLiked
                            ? "text-green-500 fill-green-500"
                            : "text-white/70 hover:text-white"
                        }`}
                      />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsShuffled(!isShuffled)}
                      className={`transition-colors ${
                        isShuffled
                          ? "text-green-500"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      <Shuffle size={20} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleRepeat}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {getRepeatIcon()}
                    </motion.button>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <div className="w-64 h-64 bg-neutral-800 rounded-2xl mb-8 flex items-center justify-center">
                    <Play size={48} className="text-gray-600" />
                  </div>
                  <p className="text-xl text-gray-400">No song selected</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
