import React from 'react';
import { ViewTab } from '../types';

interface TopHeaderProps {
  currentTab: ViewTab;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onClearSearch: () => void;
  onOpenImport: () => void;
  onOpenEqualizer: () => void;
  onOpenTelemetry: () => void;
  onSortGraph: () => void;
  totalTracks: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentTab,
  searchQuery,
  onSearchChange,
  onClearSearch,
  onOpenImport,
  onOpenEqualizer,
  onOpenTelemetry,
  onSortGraph,
  totalTracks,
}) => {
  const getHeaderTitle = () => {
    switch (currentTab) {
      case 'playlist':
        return {
          title: 'SoundSync · My Playlist',
          tag: 'Study & Focus Session',
          subtitle: 'Curated local tracks in custom doubly linked-list sequence.',
        };
      case 'search':
        return {
          title: 'SoundSync · Search',
          tag: 'Instant Query',
          subtitle: 'Filter title, artist, album, and audio format.',
        };
      case 'recent':
        return {
          title: 'SoundSync · Recently Played',
          tag: 'History Buffer',
          subtitle: 'Cached history log loaded from high-speed memory ring.',
        };
      case 'favorites':
        return {
          title: 'SoundSync · Student Favorites',
          tag: 'Curated',
          subtitle: 'Top rated tracks across diverse genres and moods.',
        };
      case 'focus':
        return {
          title: 'SoundSync · Focus Chillout',
          tag: 'Downbeat',
          subtitle: 'Downbeat ambient soundscapes designed for deep study.',
        };
      case 'synthwave':
        return {
          title: 'SoundSync · Synthwave Drive',
          tag: 'Arpeggios',
          subtitle: 'Retro-futuristic analog lead and basslines.',
        };
      default:
        return {
          title: 'SoundSync',
          tag: 'Music Library',
          subtitle: `Find your favourite track and make it yours. ${totalTracks} tracks loaded.`,
        };
    }
  };

  const { title, tag, subtitle } = getHeaderTitle();

  return (
    <header className="h-20 flex-shrink-0 bg-[#12131A]/80 backdrop-blur-md border-b border-[#2E334D]/35 px-6 flex items-center justify-between gap-6 z-20 select-none">
      {/* Main Brand Heading */}
      <div className="flex flex-col min-w-[200px]">
        <h1 className="text-xl font-bold text-white tracking-tight">
          SoundSync
        </h1>
        <p className="text-xs text-[#94A3B8] font-normal">{subtitle}</p>
      </div>

      {/* Prominent Pill Search Bar */}
      <div className="flex-1 max-w-xl relative">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-4 text-[#958ea0] text-[20px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Enter a song name, artist, or album..."
            className="w-full pl-11 pr-16 py-2.5 rounded-full bg-[#0A0B10]/95 border border-[#2E334D]/60 text-white placeholder-[#958ea0] text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/30 transition-all font-sans shadow-inner"
          />
          <div className="absolute right-3 flex items-center gap-1.5">
            {searchQuery && (
              <button
                onClick={onClearSearch}
                className="w-5 h-5 rounded-full bg-[#1F2232] hover:bg-[#282B3E] flex items-center justify-center text-[#94A3B8] hover:text-white transition-colors"
                title="Clear Search"
              >
                <span className="material-symbols-outlined text-[13px]">close</span>
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-[#1F2232]/80 text-[#958ea0] border border-[#2E334D]/60 rounded">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Controls & Telemetry */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Quick Stats Chips */}
        <div className="hidden xl:flex items-center gap-2">
          <div className="px-2.5 py-1.5 rounded-md bg-[#0A0B10] border border-[#2E334D]/35 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#8B5CF6] text-[14px]">library_music</span>
            <span className="font-mono text-[11px] text-[#e3e1ec]">
              Library: <strong className="text-white">{totalTracks} Tracks</strong>
            </span>
          </div>

          <div className="px-2.5 py-1.5 rounded-md bg-[#0A0B10] border border-[#2E334D]/35 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#38BDF8] text-[14px]">memory</span>
            <span className="font-mono text-[11px] text-[#e3e1ec]">
              Memory: <strong className="text-[#38BDF8]">18.4 MB</strong>
            </span>
          </div>

          <div className="px-2.5 py-1.5 rounded-md bg-[#0A0B10] border border-[#2E334D]/35 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-emerald-400 text-[14px]">graphic_eq</span>
            <span className="font-mono text-[11px] text-[#e3e1ec]">PCM / FLAC 24-bit</span>
          </div>
        </div>

        {/* Trailing Actions */}
        <button
          onClick={onSortGraph}
          className="hidden md:flex items-center gap-1.5 bg-[#1F2232] hover:bg-[#282B3E] border border-[#2E334D]/40 px-3 py-1.5 rounded-lg text-xs font-mono text-[#e3e1ec] transition-all active:scale-95"
          title="Topological Graph Sort"
        >
          <span className="material-symbols-outlined text-[15px] text-[#38BDF8]">account_tree</span>
          <span>Sort: Graph</span>
        </button>

        <button
          onClick={onOpenImport}
          className="flex items-center gap-1.5 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white font-bold text-xs px-3.5 py-2 rounded-lg hover:brightness-110 transition-all active:scale-95 shadow-[0_0_12px_rgba(139,92,246,0.35)]"
        >
          <span className="material-symbols-outlined text-[17px]">add_circle</span>
          <span className="hidden sm:inline">Import Audio</span>
        </button>

        {/* Icon Actions */}
        <div className="flex items-center gap-1 pl-1 border-l border-[#2E334D]/35">
          <button
            onClick={onOpenEqualizer}
            className="p-1.5 rounded-lg text-[#958ea0] hover:text-white hover:bg-[#181A24] transition-colors"
            title="10-Band Equalizer"
          >
            <span className="material-symbols-outlined text-[19px]">graphic_eq</span>
          </button>

          <button
            onClick={onOpenTelemetry}
            className="p-1.5 rounded-lg text-[#958ea0] hover:text-white hover:bg-[#181A24] transition-colors"
            title="C++ Engine Telemetry"
          >
            <span className="material-symbols-outlined text-[19px]">tune</span>
          </button>

          {/* Profile Badge */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#38BDF8] p-[1.5px] cursor-pointer ml-1">
            <div className="w-full h-full rounded-full bg-[#181A24] flex items-center justify-center overflow-hidden">
              <span className="material-symbols-outlined text-[#8B5CF6] text-[18px]">person</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
