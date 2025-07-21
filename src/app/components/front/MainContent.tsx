"use client";

import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { usePlayerStore } from "@/app/store/playerStore";

type Song = {
    id: string;
    title: string;
    artist: string;
    image_url: string;
    audio_url: string;
};

export default function MainContent() {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const res = await fetch("/api/songs");
                const data = await res.json();

                if (res.ok) {
                    setSongs(data);
                } else {
                    console.error("API Error:", data.error);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, []);

    const greeting = "Good afternoon";
    const quickPlaylists = [
        { id: 1, title: "Daily Mix 1" },
        { id: 2, title: "Top Hits 2025" },
        { id: 3, title: "Chill Vibes" },
        { id: 4, title: "Workout" },
        { id: 5, title: "Focus" },
    ];

    return (
        <main className="flex-1 overflow-y-auto px-6 pt-6 pb-24 text-white bg-[#0d0d0d]">
            {/* Greeting */}
            <h1 className="text-3xl font-bold mb-8 tracking-tight">{greeting}</h1>

            {/* New Uploads (from API) */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">New Uploads</h2>

                {loading ? (
                    <p className="text-gray-400">Loading songs...</p>
                ) : songs.length === 0 ? (
                    <p className="text-gray-500">No songs uploaded yet.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-5">
                        {songs.map((song) => (
                            <div
                                key={song.id}
                                className="relative bg-[#1a1a1a] p-4 rounded-xl hover:bg-[#2a2a2a] transition-colors duration-200 group cursor-pointer"
                            >
                                <img
                                    src={song.image_url}
                                    alt={song.title}
                                    className="h-32 w-full object-cover rounded-md mb-4"
                                />
                                <div className="text-sm space-y-0.5">
                                    <div className="font-semibold truncate">{song.title}</div>
                                    <div className="text-gray-400 truncate">{song.artist}</div>
                                </div>
                                <button
                                    onClick={() => usePlayerStore.getState().setCurrentSong(song)}
                                    aria-label={`Play ${song.title}`}
                                    className="absolute bottom-4 right-4 bg-white text-black rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md"
                                >
                                    <Play size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Quick Playlists (Static for now) */}
            <section className="mb-12">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                    {quickPlaylists.map(({ id, title }) => (
                        <div
                            key={id}
                            className="relative flex items-center gap-4 bg-[#1a1a1a] p-4 rounded-xl group hover:bg-[#2a2a2a] transition-colors duration-200"
                        >
                            <div className="flex-1 font-medium text-white truncate">{title}</div>
                            <button
                                aria-label={`Play ${title}`}
                                className="bg-white text-black rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md"
                            >
                                <Play size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
