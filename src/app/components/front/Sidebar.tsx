import {
  Home,
  Search,
  Library,
  PlusSquare,
  Heart,
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: Search, label: 'Search', active: false },
  { icon: Library, label: 'Your Library', active: false },
];

const playlists = [
  'Daily Mix 1',
  'Top Hits 2025',
  'Chill Vibes',
  'Workout',
  'Focus',
  'Discover Weekly',
  'RapCaviar',
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#121212] text-sm text-gray-300 flex flex-col px-4 pt-5 pb-4 select-none">
      {/* Navigation */}
      <nav className="space-y-1 mb-6">
        {navItems.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={`group flex items-center gap-3 w-full px-3 py-2 rounded-lg transition ${
              active
                ? 'bg-green-600 text-white font-medium'
                : 'hover:bg-[#282828] hover:text-white'
            }`}
          >
            <Icon size={20} className="shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </nav>

      <hr className="border-gray-700 mb-4" />

      {/* Tools */}
      <div className="space-y-2 mb-4">
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-[#282828] hover:text-white transition">
          <PlusSquare size={20} />
          <span className="truncate font-medium">Create Playlist</span>
        </button>
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-[#282828] hover:text-white transition">
          <Heart size={20} />
          <span className="truncate font-medium">Liked Songs</span>
        </button>
      </div>

      <hr className="border-gray-700 mb-3" />

      {/* Playlist Scroll Area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {playlists.map((name) => (
          <button
            key={name}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#282828] hover:text-white truncate transition"
            title={name}
          >
            {name}
          </button>
        ))}
      </div>
    </aside>
  );
}
