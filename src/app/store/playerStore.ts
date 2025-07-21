import { create } from "zustand";

type Song = {
  id: string;
  title: string;
  artist: string;
  image_url: string;
  audio_url: string;
};

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  setCurrentSong: (song: Song) => void;
  setIsPlaying: (playing: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentSong: null,
  isPlaying: false,
  setCurrentSong: (song) => set({ currentSong: song, isPlaying: true }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
}));
