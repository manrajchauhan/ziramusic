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
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/app/store/playerStore";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

export default function PlayerBar() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { currentSong, isPlaying, setIsPlaying } = usePlayerStore();

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => console.log("Swipe left"),
    onSwipedRight: () => console.log("Swipe right"),
    trackMouse: true,
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    if (currentSong) {
      if (isPlaying) audio.play().catch(console.error);
      else audio.pause();
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong, volume]);

  // Sync time & duration
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", update);
    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("loadedmetadata", update);
    };
  }, []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setProgress(value);
    }
  };

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#181818] border-t border-neutral-700 text-white"
        {...swipeHandlers}
      >
        {/* Top Controls */}
        <div className="flex items-center justify-between h-20 px-6">
          {/* Song Info */}
          <div className="flex items-center gap-4 min-w-0">
            {currentSong ? (
              <>
                <Image
                  src={currentSong.image_url}
                  alt={currentSong.title}
                  width={48}
                  height={48}
                  className="rounded-md object-cover"
                />
                <div className="truncate md:block hidden">
                  <div className="font-semibold text-sm truncate">{currentSong.title}</div>
                  <div className="text-xs text-gray-400 truncate">{currentSong.artist}</div>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-400 italic">No song selected</div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center md:gap-6 gap-2">
            <button disabled className="opacity-50 cursor-not-allowed">
              <SkipBack size={20} />
            </button>

            {isPlaying ? (
              <button
                onClick={() => setIsPlaying(false)}
                disabled={!currentSong}
                className={!currentSong ? "opacity-50 cursor-not-allowed" : ""}
              >
                <Pause size={32} />
              </button>
            ) : (
              <button
                onClick={() => setIsPlaying(true)}
                disabled={!currentSong}
                className={!currentSong ? "opacity-50 cursor-not-allowed" : ""}
              >
                <Play size={32} />
              </button>
            )}

            <button disabled className="opacity-50 cursor-not-allowed">
              <SkipForward size={20} />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMuted(!isMuted)}>
              {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setVolume(v);
                setIsMuted(v === 0);
              }}
              className="w-20 h-1 bg-gray-500 rounded-lg appearance-none accent-green-500 cursor-pointer"
            />

            <button onClick={() => setIsFullscreen(true)}>
              <Maximize2 size={20} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center text-xs text-gray-400 px-4 pb-2 gap-2 mx-auto max-w-lg mb-1">
          <span className="w-10 text-right">{formatTime(progress)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={progress}
            onChange={handleSeek}
            className="flex-1 h-1 accent-green-500 appearance-none bg-neutral-700 rounded-md cursor-pointer"
          />
          <span className="w-10 text-left">{formatTime(duration)}</span>
        </div>

        {/* Audio Element */}
        <audio ref={audioRef} src={currentSong?.audio_url} preload="auto" />
      </div>

      {/* Fullscreen Mode */}
      <AnimatePresence>
        {isFullscreen && (
         <motion.div
            className={`fixed inset-0 z-50 text-white flex flex-col items-center justify-center`}
            style={{
              backgroundImage: currentSong?.image_url
                ? `url(${currentSong.image_url})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 backdrop-blur-3xl bg-black/50" />
            <h1
              className="absolute top-10 left-10 text-xl tracking-tighter font-medium"
            >
             Now Playing
            </h1>

            <button
              className="absolute top-10 right-10"
              onClick={() => setIsFullscreen(false)}
              aria-label="Close"
            >
              <X size={28} />
            </button>

            {currentSong ? (
              <>
                <Image
                  src={currentSong.image_url}
                  alt={currentSong.title}
                  width={300}
                  height={300}
                  className="rounded-xl object-cover mb-6 shadow-2xl z-50 "
                />
                <h2 className="text-2xl font-semibold text-white z-50">{currentSong.title}</h2>
                <p className="text-gray-400 mb-8 z-50">{currentSong.artist}</p>
              </>
            ) : (
              <p className="text-gray-400 mb-8">No song selected</p>
            )}


            <div className="flex items-center gap-8 z-50">
              <button disabled className="opacity-50">
                <SkipBack size={28} />
              </button>
              {isPlaying ? (
                <button onClick={() => setIsPlaying(false)}>
                  <Pause size={48} />
                </button>
              ) : (
                <button onClick={() => setIsPlaying(true)}>
                  <Play size={48} />
                </button>
              )}
              <button disabled className="opacity-50">
                <SkipForward size={28} />
              </button>
            </div>

              {/* Progress Bar */}
              <div className="md:flex items-center text-xs text-gray-400 px-4 pb-2 gap-2 mx-auto max-w-4xl mt-10 z-50">
        <div className="flex items-center text-xs text-gray-400 px-4 gap-2 mx-auto max-w-4xl">
          <span className="w-10 text-right">{formatTime(progress)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={progress}
            onChange={handleSeek}
            className="flex-1 h-1 accent-green-500 appearance-none bg-neutral-700 rounded-md cursor-pointer"
          />
          <span className="w-10 text-left">{formatTime(duration)}</span>
        </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
