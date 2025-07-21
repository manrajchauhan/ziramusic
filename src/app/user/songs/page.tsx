'use client';

import {
    MoreHorizontal,
    Pencil,
    Trash2,
    BarChart3,
} from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

type Song = {
    id: string;
    title: string;
    artist: string;
    image_url: string;
    audio_url: string;
};

const fetchSongs = async (): Promise<Song[]> => {
    const res = await fetch('/api/songs');
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to fetch songs');
    }
    return res.json();
};

export default function Songs() {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const {
        data: songs = [],
        isLoading,
        isError,
        error,
    } = useQuery<Song[]>({
        queryKey: ['songs'],
        queryFn: fetchSongs,
        staleTime: 1000 * 60 * 2,
    });

    const toggleMenu = (id: string) => {
        setOpenMenuId((prev) => (prev === id ? null : id));
    };

const SkeletonRow = () => (
        <tr className="border-t border-[#2a2a2a] animate-pulse">
            <td className="px-4 py-3">
                <div className="h-4 w-6 bg-[#333] rounded"></div>
            </td>
            <td className="px-4 py-3">
                <div className="w-10 h-10 bg-[#333] rounded"></div>
            </td>
            <td className="px-4 py-3">
                <div className="h-4 w-24 bg-[#333] rounded"></div>
            </td>
            <td className="px-4 py-3">
                <div className="h-4 w-20 bg-[#333] rounded"></div>
            </td>
            <td className="px-4 py-3 text-right">
                <div className="h-4 w-6 bg-[#333] rounded ml-auto"></div>
            </td>
        </tr>
    );


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-white">Songs</h1>
            <p className="text-gray-400 mt-2 mb-6">Manage your uploaded songs here.</p>

            <div className="rounded-lg bg-[#1a1a1a]">
                <table className="w-full table-auto text-sm text-left text-gray-400">
                    <thead className="bg-[#121212] text-gray-300 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Sr</th>
                            <th className="px-4 py-3">Thumbnail</th>
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Artist</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                        ) : (
                            songs.map((song) => (
                                <tr
                                    key={song.id}
                                    className="border-t border-[#2a2a2a] hover:bg-[#2a2a2a] transition"
                                >
                                    <td className="px-4 py-3">{songs.indexOf(song) + 1}</td>
                                    <td className="px-4 py-3 flex items-center gap-3">
                                        <img
                                            src={song.image_url}
                                            alt={song.title}
                                            className="w-10 h-10 rounded object-cover"
                                        />
                                    </td>
                                    <td className="px-4 py-3 font-medium text-white">{song.title}</td>
                                    <td className="px-4 py-3">{song.artist}</td>
                                    <td className="px-4 py-3 text-right relative">
                                        <button
                                            onClick={() => toggleMenu(song.id)}
                                            className="p-2 rounded hover:bg-[#333333]"
                                        >
                                            <MoreHorizontal size={18} />
                                        </button>

                                        {openMenuId === song.id && (
                                            <div className="absolute right-4 mt-2 w-40 bg-[#222] text-gray-200 rounded-lg shadow-lg z-50 border border-[#333]">
                                                <button
                                                    onClick={() => alert(`Edit ${song.title}`)}
                                                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-[#333]"
                                                >
                                                    <Pencil size={16} />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => alert(`Delete ${song.title}`)}
                                                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-[#333] text-red-400"
                                                >
                                                    <Trash2 size={16} />
                                                    Delete
                                                </button>
                                                <button
                                                    onClick={() => alert(`Stats for ${song.title}`)}
                                                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-[#333]"
                                                >
                                                    <BarChart3 size={16} />
                                                    View Stats
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    );
}
