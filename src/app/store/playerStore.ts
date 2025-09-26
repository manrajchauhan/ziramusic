import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// --- Song type ---
export type Song = {
  id: string;
  title: string;
  artist: string;
  image_url: string;
  audio_url: string;
};

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  previousSongs: Song[];
  nextSongs: Song[];

  setCurrentSong: (song: Song) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlay: () => void; // ← add this
  setProgress: (time: number) => void;
  playPrevious: () => void;
  playNext: () => void;
}

// --- Broadcast channel for multi-tab sync ---
const playerChannel = new BroadcastChannel("player_channel");

// --- Create Zustand store ---
export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => {
      // Listen to other tabs
      playerChannel.onmessage = (event) => {
        const { currentSong, progress, isPlaying } = event.data;
        if (!currentSong) return;
        set({
          currentSong,
          progress,
          // Do NOT autoplay in this tab
          isPlaying: false,
        });
      };

      return {
        currentSong: null,
        isPlaying: false,
        progress: 0,
        previousSongs: [],
        nextSongs: [],

        // --- Actions ---
        setCurrentSong: (song) => {
          set((state) => ({
            previousSongs: state.currentSong
              ? [...state.previousSongs, state.currentSong]
              : state.previousSongs,
            currentSong: song,
            isPlaying: true,
            progress: 0,
            nextSongs: [],
          }));

          // Broadcast to other tabs
          playerChannel.postMessage({
            currentSong: song,
            progress: 0,
            isPlaying: true,
          });
        },

        setIsPlaying: (playing) => {
          set({ isPlaying: playing });

          // Broadcast only play/pause state
          playerChannel.postMessage({
            currentSong: get().currentSong,
            progress: get().progress,
            isPlaying: playing,
          });
        },

        setProgress: (time) => {
          set({ progress: time });

          // Broadcast progress update
          playerChannel.postMessage({
            currentSong: get().currentSong,
            progress: time,
            isPlaying: get().isPlaying,
          });
        },

        playPrevious: () => {
          const { previousSongs, currentSong, nextSongs } = get();
          if (!currentSong || previousSongs.length === 0) return;

          const lastSong = previousSongs[previousSongs.length - 1];
          set({
            currentSong: lastSong,
            previousSongs: previousSongs.slice(0, -1),
            nextSongs: [...nextSongs, currentSong],
            isPlaying: true,
            progress: 0,
          });

          playerChannel.postMessage({
            currentSong: lastSong,
            progress: 0,
            isPlaying: true,
          });
        },

        playNext: () => {
          const { nextSongs, currentSong, previousSongs } = get();
          if (!currentSong || nextSongs.length === 0) return;

          const nextSong = nextSongs[nextSongs.length - 1];
          set({
            currentSong: nextSong,
            nextSongs: nextSongs.slice(0, -1),
            previousSongs: [...previousSongs, currentSong],
            isPlaying: true,
            progress: 0,
          });

          playerChannel.postMessage({
            currentSong: nextSong,
            progress: 0,
            isPlaying: true,
          });
        },
        togglePlay: () => {
          const current = get().isPlaying;
          set({ isPlaying: !current });

          // Broadcast to other tabs
          playerChannel.postMessage({
            currentSong: get().currentSong,
            progress: get().progress,
            isPlaying: !current,
          });
        },
      };
    },

    {
      name: "player-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
