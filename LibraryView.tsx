import React from 'react';
import { Track } from '../types';
import { TRACK_COVER_ART_MAP } from '../data/tracks';

interface LibraryViewProps {
  tracks: Track[];
  selectedTrackId: number;
  playingTrackId: number | null;
  isPlaying: boolean;
  playlistIds: Set<number>;
  onSelectTrack: (track: Track) => void;
  onPlayTrack: (track: Track) => void;
  onTogglePlaylist: (trackId: number) => void;
  onSortBy: (criterion: 'title' | 'album' | 'time') => void;
  onClearSearch: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  tracks,
  selectedTrackId,
  playingTrackId,
  isPlaying,
  playlistIds,
  onSelectTrack,
  onPlayTrack,
  onTogglePlaylist,
  onSortBy,
  onClearSearch,
}) => {
  return (
    <section className="flex-1 flex flex-col min-w-0 bg-[#090A0F] overflow-hidden border-r border-[#2E334D]/25 select-none">
      {/* Subheader / Column Headers */}
      <div className="px-6 py-3 bg-[#0A0B10]/85 border-b border-[#2E334D]/30 flex items-center justify-between text-xs text-[#958ea0] font-mono">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-white">
            All Songs · {tracks.length} Tracks
          </span>
          <span className="w-1 h-1 rounded-full bg-[#494454]"></span>
          <span className="text-[#94A3B8]">Heap-Sort by Title</span>
        </div>

        {/* Column Headers */}
        <div className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-wider font-semibold">
          <span className="w-8 text-center">#</span>
          <button
            onClick={() => onSortBy('title')}
            className="cursor-pointer hover:text-[#8B5CF6] transition-colors flex items-center gap-1"
          >
            <span>Title</span>
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>
          <button
            onClick={() => onSortBy('album')}
            className="w-36 text-left cursor-pointer hover:text-[#8B5CF6] transition-colors"
          >
            Album
          </button>
          <button
            onClick={() => onSortBy('time')}
            className="w-16 text-right cursor-pointer hover:text-[#8B5CF6] transition-colors"
          >
            Duration
          </button>
          <span className="w-24 text-center">Action</span>
        </div>
      </div>

      {/* Empty State Container */}
      {tracks.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-[#1F2232] border border-[#2E334D]/50 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[28px] text-[#8B5CF6]">music_off</span>
          </div>
          <h4 className="text-sm text-white font-bold mb-1">No song found. Try another title.</h4>
          <p className="text-xs text-[#94A3B8] max-w-sm mb-4">
            No match was found in the in-memory C++ BST (Binary Search Tree) directory.
          </p>
          <button
            onClick={onClearSearch}
            className="px-4 py-1.5 rounded-full bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 border border-[#8B5CF6]/40 text-[#8B5CF6] text-xs font-semibold transition-all"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Scrollable Song List */}
      {tracks.length > 0 && (
        <div className="flex-1 overflow-y-auto px-4 py-2 divide-y divide-[#2E334D]/15">
          {tracks.map((track) => {
            const isSelected = track.id === selectedTrackId;
            const isCurrentlyPlaying = track.id === playingTrackId && isPlaying;
            const inPlaylist = playlistIds.has(track.id);
            const coverArt = TRACK_COVER_ART_MAP[track.id] || TRACK_COVER_ART_MAP[4];

            return (
              <div
                key={track.id}
                onClick={() => onSelectTrack(track)}
                className={`group flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#8B5CF6]/15 border border-[#8B5CF6]/60 glow-violet shadow-sm'
                    : 'hover:bg-[#181A24] border border-transparent'
                }`}
              >
                {/* Left: Index / Animated Equalizer + Thumbnail + Meta */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div
                    className={`w-7 text-center flex items-center justify-center font-mono text-xs ${
                      isSelected ? 'text-[#38BDF8]' : 'text-[#958ea0] group-hover:text-white'
                    }`}
                  >
                    {isCurrentlyPlaying ? (
                      <div className="flex items-end gap-[2px] h-3.5">
                        <span className="w-[3px] bg-[#38BDF8] eq-bar-1 rounded-full"></span>
                        <span className="w-[3px] bg-[#8B5CF6] eq-bar-2 rounded-full"></span>
                        <span className="w-[3px] bg-[#38BDF8] eq-bar-3 rounded-full"></span>
                      </div>
                    ) : (
                      <span>{track.id}</span>
                    )}
                  </div>

                  {/* Album Art Frame */}
                  <div className="w-10 h-10 rounded-md overflow-hidden bg-[#1F2232] border border-[#2E334D]/40 flex-shrink-0 relative">
                    <img
                      src={coverArt}
                      alt={track.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = TRACK_COVER_ART_MAP[4];
                      }}
                    />
                    <div
                      className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                        isCurrentlyPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px] text-white">
                        {track.audioAvailable === false
                          ? 'music_off'
                          : isCurrentlyPlaying
                          ? 'pause'
                          : 'play_arrow'}
                      </span>
                    </div>
                  </div>

                  {/* Title & Artist */}
                  <div className="flex flex-col min-w-0 pr-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-sm font-bold truncate ${
                          isSelected ? 'text-[#8B5CF6]' : 'text-white group-hover:text-white'
                        }`}
                      >
                        {track.title}
                      </span>
                      {track.audioAvailable === false && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                          No Audio File
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#94A3B8] truncate">
                      <span>{track.artist}</span>
                      <span className="text-[#958ea0]">·</span>
                      <span className="text-[#38BDF8] text-[11px] font-mono">{track.genre}</span>
                      {track.mood && (
                        <>
                          <span className="text-[#958ea0]">·</span>
                          <span className="text-[#a078ff] text-[11px] font-mono">{track.mood}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Center: Album */}
                <div className="hidden md:block w-36 truncate text-xs text-[#958ea0] pr-2">
                  {track.album}
                </div>

                {/* Right: Duration */}
                <div className="hidden md:block w-16 text-right font-mono text-xs text-[#94A3B8] pr-4">
                  {track.audioAvailable === false ? (
                    <span className="text-amber-400/80 text-[11px]">Unmounted</span>
                  ) : (
                    track.duration
                  )}
                </div>

                {/* Quick Actions */}
                <div
                  className="w-24 flex items-center justify-end gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onTogglePlaylist(track.id)}
                    className="p-1.5 rounded-md hover:bg-[#1F2232] text-[#958ea0] hover:text-[#8B5CF6] transition-colors"
                    title={inPlaylist ? 'Remove from Playlist' : '+ Add to Playlist'}
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        inPlaylist ? 'text-[#8B5CF6]' : ''
                      }`}
                    >
                      {inPlaylist ? 'playlist_add_check' : 'add'}
                    </span>
                  </button>

                  <button
                    onClick={() => onPlayTrack(track)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      track.audioAvailable === false
                        ? 'bg-[#1F2232]/50 text-amber-500/60 cursor-not-allowed'
                        : 'bg-[#1F2232] group-hover:bg-[#8B5CF6]/20 text-[#958ea0] group-hover:text-[#8B5CF6]'
                    }`}
                    title={
                      track.audioAvailable === false
                        ? 'Audio file unmounted or missing'
                        : isCurrentlyPlaying
                        ? 'Pause'
                        : 'Play'
                    }
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {track.audioAvailable === false
                        ? 'block'
                        : isCurrentlyPlaying
                        ? 'pause'
                        : 'play_arrow'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
