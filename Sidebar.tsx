import React from 'react';
import { ViewTab } from '../types';
import { BRAND_LOGO_URL } from '../data/tracks';

interface SidebarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  playlistCount: number;
  totalTracksCount: number;
  onOpenTelemetry: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  playlistCount,
  totalTracksCount,
  onOpenTelemetry,
  onOpenSettings,
}) => {
  return (
    <aside className="w-[260px] flex-shrink-0 bg-[#12131A] border-r border-[#2E334D]/35 flex flex-col justify-between py-4 px-3.5 z-40 select-none h-full overflow-y-auto">
      {/* Top Section */}
      <div className="flex flex-col gap-4">
        {/* Brand Header with Logo from Image DataStore */}
        <div className="flex items-center gap-3 px-1.5 pt-1">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#8B5CF6]/40 bg-[#181A24] flex items-center justify-center glow-violet shadow-md flex-shrink-0">
            <img
              alt="SoundSync Logo"
              className="w-full h-full object-cover p-1"
              src={BRAND_LOGO_URL}
              onError={(e) => {
                // Inline SVG fallback if network blocks external asset
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Fallback graphic if image fails */}
            <span className="material-symbols-outlined text-[#8B5CF6] text-[22px] pointer-events-none">graphic_eq</span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-white text-base">SoundSync</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase bg-[#8B5CF6]/20 text-[#a078ff] border border-[#8B5CF6]/30">
                C++20
              </span>
            </div>
            <span className="text-xs text-[#94A3B8] tracking-wide truncate">
              Your Personal Music Space
            </span>
          </div>
        </div>

        {/* C++ DSA Architecture Core Badge */}
        <div className="mx-0.5 px-2.5 py-1.5 rounded-lg bg-[#0A0B10]/90 border border-[#2E334D]/50 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse glow-cyan-sm"></span>
          <span className="font-mono text-[10px] text-[#38BDF8] tracking-wider font-semibold">
            C++ DSA Core Engine (Local File Stream)
          </span>
        </div>

        {/* Main Navigation Links */}
        <nav className="flex flex-col space-y-1">
          <div className="px-2 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-[#958ea0]">
            Library
          </div>

          {/* Home */}
          <button
            onClick={() => onSelectTab('home')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all group ${
              currentTab === 'home'
                ? 'text-white bg-[#8B5CF6]/15 border-l-4 border-[#8B5CF6] shadow-sm font-semibold'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#181A24]'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[19px] ${
                currentTab === 'home' ? 'text-[#8B5CF6]' : 'text-[#958ea0] group-hover:text-[#8B5CF6]'
              }`}
            >
              home
            </span>
            <span>Home</span>
          </button>

          {/* All Songs */}
          <button
            onClick={() => onSelectTab('all')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-all group ${
              currentTab === 'all'
                ? 'text-white bg-[#8B5CF6]/15 border-l-4 border-[#8B5CF6] shadow-sm font-semibold'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#181A24]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`material-symbols-outlined text-[19px] ${
                  currentTab === 'all' ? 'text-[#8B5CF6]' : 'text-[#958ea0] group-hover:text-[#8B5CF6]'
                }`}
                style={currentTab === 'all' ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                library_music
              </span>
              <span>All Songs</span>
            </div>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#a078ff] border border-[#8B5CF6]/30">
              {totalTracksCount}
            </span>
          </button>

          {/* Search Music */}
          <button
            onClick={() => onSelectTab('search')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-all group ${
              currentTab === 'search'
                ? 'text-white bg-[#8B5CF6]/15 border-l-4 border-[#8B5CF6] shadow-sm font-semibold'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#181A24]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`material-symbols-outlined text-[19px] ${
                  currentTab === 'search' ? 'text-[#38BDF8]' : 'text-[#958ea0] group-hover:text-[#38BDF8]'
                }`}
              >
                search
              </span>
              <span>Search Music</span>
            </div>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#1F2232] text-[#94A3B8] border border-[#2E334D]">
              ⌘K
            </span>
          </button>

          {/* My Playlist */}
          <button
            onClick={() => onSelectTab('playlist')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-all group ${
              currentTab === 'playlist'
                ? 'text-[#d0bcff] bg-[#8B5CF6]/15 border-l-4 border-[#8B5CF6] shadow-sm font-semibold'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#181A24]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`material-symbols-outlined text-[19px] ${
                  currentTab === 'playlist' ? 'text-[#8B5CF6]' : 'text-[#958ea0] group-hover:text-[#8B5CF6]'
                }`}
                style={currentTab === 'playlist' ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                queue_music
              </span>
              <span>My Playlist</span>
            </div>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-[#1F2232] border border-[#2E334D] text-[#38BDF8]">
              {playlistCount} tracks
            </span>
          </button>

          {/* Recently Played */}
          <button
            onClick={() => onSelectTab('recent')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all group ${
              currentTab === 'recent'
                ? 'text-white bg-[#8B5CF6]/15 border-l-4 border-[#8B5CF6] shadow-sm font-semibold'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#181A24]'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[19px] ${
                currentTab === 'recent' ? 'text-[#38BDF8]' : 'text-[#958ea0] group-hover:text-[#38BDF8]'
              }`}
            >
              history
            </span>
            <span>Recently Played</span>
          </button>
        </nav>

        {/* Playlist Quick Selector & DLL Nodes */}
        <div className="flex flex-col space-y-1 pt-2 border-t border-[#2E334D]/30">
          <div className="px-2 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-[#958ea0] flex items-center justify-between">
            <span>Playlists & Nodes</span>
            <span className="text-[10px] text-[#38BDF8]">DLL</span>
          </div>

          <button
            onClick={() => onSelectTab('playlist')}
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded text-[13px] text-left transition-colors group ${
              currentTab === 'playlist'
                ? 'text-[#38BDF8] bg-[#181A24] border border-[#38BDF8]/30 font-medium'
                : 'text-[#94A3B8] hover:text-[#38BDF8] hover:bg-[#181A24]/60'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#38BDF8]">alt_route</span>
            <span className="truncate">Study & Focus Session</span>
          </button>

          <button
            onClick={() => onSelectTab('favorites')}
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded text-[13px] text-left transition-colors group ${
              currentTab === 'favorites'
                ? 'text-[#8B5CF6] bg-[#181A24] border border-[#8B5CF6]/30 font-medium'
                : 'text-[#94A3B8] hover:text-[#8B5CF6] hover:bg-[#181A24]/60'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]/60 group-hover:bg-[#8B5CF6]"></span>
            <span className="truncate">Student Favorites</span>
          </button>

          <button
            onClick={() => onSelectTab('focus')}
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded text-[13px] text-left transition-colors group ${
              currentTab === 'focus'
                ? 'text-[#38BDF8] bg-[#181A24] border border-[#38BDF8]/30 font-medium'
                : 'text-[#94A3B8] hover:text-[#38BDF8] hover:bg-[#181A24]/60'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]/60 group-hover:bg-[#38BDF8]"></span>
            <span className="truncate">Focus Chillout</span>
          </button>

          <button
            onClick={() => onSelectTab('synthwave')}
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded text-[13px] text-left transition-colors group ${
              currentTab === 'synthwave'
                ? 'text-[#a078ff] bg-[#181A24] border border-[#a078ff]/30 font-medium'
                : 'text-[#94A3B8] hover:text-[#a078ff] hover:bg-[#181A24]/60'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#a078ff]/60 group-hover:bg-[#a078ff]"></span>
            <span className="truncate">Synthwave Drive</span>
          </button>
        </div>
      </div>

      {/* Bottom Status & Telemetry */}
      <div className="flex flex-col gap-2 pt-3 border-t border-[#2E334D]/40">
        <div className="p-2.5 rounded-lg bg-[#0A0B10]/95 border border-[#2E334D]/40 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-[10px] font-semibold text-emerald-300">
                C++ Audio Streamer
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#958ea0]">v2.4.1</span>
          </div>

          <div className="flex justify-between text-[10px] font-mono text-[#94A3B8] pt-0.5">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px] text-[#38BDF8]">database</span>
              RAM Pool ({totalTracksCount} Files)
            </span>
            <span className="text-[#8B5CF6] font-semibold">29.6 MB</span>
          </div>

          <div className="w-full bg-[#1F2232] h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8] h-full rounded-full w-[24%]"></div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex items-center justify-between pt-1 border-t border-[#2E334D]/25 px-1">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 text-[11px] font-mono text-[#94A3B8] hover:text-[#8B5CF6] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">settings</span>
            <span>Settings</span>
          </button>

          <button
            onClick={onOpenTelemetry}
            className="flex items-center gap-1 text-[10px] font-mono text-[#38BDF8] hover:text-white bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 px-2 py-0.5 rounded border border-[#38BDF8]/25 transition-all"
          >
            <span className="material-symbols-outlined text-[14px]">terminal</span>
            <span>Telemetry</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
