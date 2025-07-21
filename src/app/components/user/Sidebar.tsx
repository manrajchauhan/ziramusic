'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Upload,
    Music,
    LifeBuoy,
} from 'lucide-react';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/user/dashboard' },
    { icon: Users, label: 'Users', href: '/user/users' },
    { icon: Music, label: 'Songs', href: '/user/songs' },
    { icon: Upload, label: 'Upload Music', href: '/user/upload' },
    { icon: Music, label: 'Playlists', href: '/user/playlists' },
    { icon: BarChart3, label: 'Reports', href: '/user/reports' },
    { icon: Settings, label: 'Settings', href: '/user/settings' },
];

const tools = [
    { icon: LifeBuoy, label: 'Support', href: '/user/support' },
];

export default function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-[#121212] text-sm text-gray-300 flex flex-col px-4 pt-5 pb-4 select-none h-screen border-r border-gray-800">
            <div className="text-white font-semibold text-4xl tracking-tight px-2 mb-10">
                ZIRA
            </div>
            {/* Navigation */}
            <nav className="space-y-1 mb-6 flex flex-col">
                {navItems.map(({ icon: Icon, label, href }) => {
                    const isActive = pathname.startsWith(href);
                    return (
                        <Link
                            key={label}
                            href={href}
                            className={`group flex items-center gap-3 w-full px-3 py-2 rounded-lg transition ${isActive
                                    ? 'bg-[#00A63E] text-white font-medium'
                                    : 'hover:bg-[#282828] hover:text-white'
                                }`}
                        >
                            <Icon size={20} className="shrink-0" />
                            <span className="truncate">{label}</span>
                        </Link>
                    );
                })}
            </nav>

            <hr className="border-gray-700 mb-4" />

            {/* Tools */}
            <div className="space-y-2 mb-4 flex flex-col">
                {tools.map(({ icon: Icon, label, href }) => (
                    <Link
                        key={label}
                        href={href}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-[#282828] hover:text-white transition"
                    >
                        <Icon size={20} />
                        <span className="truncate font-medium">{label}</span>
                    </Link>
                ))}
            </div>

            <hr className="border-gray-700 mb-3" />

            {/* Extra Section - example: quick links or status */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {/* You can add other dashboard links or components here */}
                {/* For demo, adding some placeholders */}
                <button
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#282828] hover:text-white truncate transition"
                    title="Recent Activity"
                >
                    Recent Activity
                </button>
                <button
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#282828] hover:text-white truncate transition"
                    title="Notifications"
                >
                    Notifications
                </button>
                <button
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#282828] hover:text-white truncate transition"
                    title="System Status"
                >
                    System Status
                </button>
            </div>
        </aside>
    );
}
