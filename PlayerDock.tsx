import React from 'react';
import { Track } from '../types';
import { PLAYER_THUMB_ART, TRACK_COVER_ART_MAP } from '../data/tracks';

interface PlayerDockProps {
  currentTrack: Track;
  isPlaying: boolean;
  isLiked: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  currentSeconds: number;
  volume: number;
  isMuted: boolean;
  onTogglePlay: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleLike: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onOpenQueue: () => void;
  onOpenEqualizer: () => void;
  onSelectCurrentTrack: () => void;
}

export const PlayerDock: React.FC<PlayerDockProps> = ({
  currentTrack,
  isPlaying,
  isLiked,
  isShuffle,
  isRepeat,
  currentSeconds,
  volume,
  isMuted,
  onTogglePlay,
  onPrevTrack,
  onNextTrack,
  onToggleShuffle,
  onToggleRepeat,
  onToggleLike,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onOpenQueue,
  onOpenEqualizer,
  onSelectCurrentTrack,
}) => {
  const mins = Math.floor(currentSeconds / 60);
  const secs = String(currentSeconds % 60).padStart(2, '0');
  const elapsedFormatted = `${mins}:${secs}`;
  const totalSeconds = currentTrack.seconds || 231;
  const progressPercent = Math.min(100, Math.max(0, (currentSeconds / totalSeconds) * 100));

  const coverArt = TRACK_COVER_ART_MAP[currentTrack.id] || PLAYER_THUMB_ART;

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(Math.floor(ratio * totalSeconds));
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onVolumeChange(ratio);
  };

  return (
    <footer className="h-[88px] w-full bg-[#12131A]/95 backdrop-blur-xl border-t border-[#2E334D]/35 px-6 flex items-center justify-between z-50 relative select-none shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
      {/* Player Left: Current Track Thumbnail & Metadata */}
      <div className="flex items-center gap-3.5 w-1/4 min-w-[220px]">
        <div
          onClick={onSelectCurrentTrack}
          className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#181A24] border border-[#2E334D]/50 shadow-md flex-shrink-0 cursor-pointer group"
        >
          <img
            src={coverArt}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = PLAYER_THUMB_ART;
            }}
          />
          {isPlaying && (
            <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/75 backdrop-blur rounded flex items-end gap-[1.5px] h-3">
              <span className="w-[2px] bg-[#38BDF8] eq-bar-1 rounded-full"></span>
              <span className="w-[2px] bg-[#8B5CF6] eq-bar-2 rounded-full"></span>
              <span className="w-[2px] bg-[#38BDF8] eq-bar-3 rounded-full"></span>
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              onClick={onSelectCurrentTrack}
              className="text-sm font-bold text-white truncate hover:underline cursor-pointer"
            >
              {currentTrack.title}
            </span>
            {currentTrack.audioAvailable === false && (
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                Offline
              </span>
            )}
          </div>
          <span className="text-xs text-[#94A3B8] truncate">
            {currentTrack.artist} · <span className="text-[#38BDF8]">{currentTrack.genre}</span>
          </span>
        </div>

        <button
          onClick={onToggleLike}
          className={`transition-colors ml-1 p-1 ${
            isLiked ? 'text-rose-500' : 'text-[#958ea0] hover:text-rose-500'
          }`}
          title="Favorite"
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={isLiked ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            favorite
          </span>
        </button>
      </div>

      {/* Player Center: Transport Controls & Scrubber */}
      <div className="flex flex-col items-center gap-1.5 w-2/4 max-w-xl">
        {/* Transport Buttons */}
        <div className="flex items-center gap-5">
          <button
            onClick={onToggleShuffle}
            className={`transition-colors ${
              isShuffle ? 'text-[#38BDF8]' : 'text-[#958ea0] hover:text-white'
            }`}
            title="Fisher-Yates Shuffle"
          >
            <span className="material-symbols-outlined text-[19px]">shuffle</span>
          </button>

          <button
            onClick={onPrevTrack}
            className="text-[#958ea0] hover:text-white transition-colors p-1"
            title="Previous Track (DLL prev pointer)"
          >
            <span className="material-symbols-outlined text-[24px]">skip_previous</span>
          </button>

          {/* Master Play / Pause Button */}
          <button
            onClick={onTogglePlay}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95 ${
              currentTrack.audioAvailable === false
                ? 'bg-[#1F2232] text-amber-400 border border-amber-500/30'
                : 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#8B5CF6]/90 hover:to-[#6366F1]/90 text-white glow-violet shadow-lg'
            }`}
            title={currentTrack.audioAvailable === false ? 'Audio source unavailable' : 'Play / Pause'}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {currentTrack.audioAvailable === false
                ? 'block'
                : isPlaying
                ? 'pause'
                : 'play_arrow'}
            </span>
          </button>

          <button
            onClick={onNextTrack}
            className="text-[#958ea0] hover:text-white transition-colors p-1"
            title="Next Track (DLL next pointer)"
          >
            <span className="material-symbols-outlined text-[24px]">skip_next</span>
          </button>

          <button
            onClick={onToggleRepeat}
            className={`transition-colors ${
              isRepeat ? 'text-[#8B5CF6]' : 'text-[#958ea0] hover:text-white'
            }`}
            title="Repeat Mode"
          >
            <span className="material-symbols-outlined text-[19px]">repeat</span>
          </button>
        </div>

        {/* Scrubber Timeline & Stamps */}
        <div className="w-full flex items-center gap-3">
          <span className="font-mono text-[11px] text-[#958ea0] w-8 text-right">
            {elapsedFormatted}
          </span>

          <div
            onClick={handleScrubberClick}
            className="relative flex-1 group cursor-pointer h-4 flex items-center"
          >
            <div className="w-full h-1 bg-[#1F2232] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8] rounded-full transition-[width] duration-100"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            {/* Glowing thumb handle */}
            <div
              className="absolute w-3 h-3 rounded-full bg-white shadow-md glow-cyan-sm pointer-events-none group-hover:scale-125 transition-transform"
              style={{ left: `calc(${progressPercent}% - 6px)` }}
            ></div>
          </div>

          <span className="font-mono text-[11px] text-[#958ea0] w-8">
            {currentTrack.duration}
          </span>
        </div>
      </div>

      {/* Player Right: Output Selector, Volume, Extra Tools */}
      <div className="flex items-center justify-end gap-3 w-1/4 min-w-[220px]">
        {/* Output Device Selector Badge */}
        <div
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#181A24] border border-[#2E334D]/35 text-xs text-[#94A3B8] font-mono cursor-pointer hover:border-[#8B5CF6]/40 transition-colors"
          title="Web Audio / ALSA Stereo DAC Sink"
        >
          <span className="material-symbols-outlined text-[14px] text-[#38BDF8]">speaker</span>
          <span className="text-[10px] text-white truncate max-w-[100px]">Stereo DAC</span>
        </div>

        {/* Queue Trigger */}
        <button
          onClick={onOpenQueue}
          className="text-[#958ea0] hover:text-white transition-colors p-1"
          title="Current Queue / DLL Playlist"
        >
          <span className="material-symbols-outlined text-[20px]">queue_music</span>
        </button>

        {/* Volume Slider Control */}
        <div className="flex items-center gap-2 group">
          <button
            onClick={onToggleMute}
            className="text-[#958ea0] hover:text-white transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            <span className="material-symbols-outlined text-[19px]">
              {isMuted || volume === 0
                ? 'volume_off'
                : volume < 0.5
                ? 'volume_down'
                : 'volume_up'}
            </span>
          </button>

          <div
            onClick={handleVolumeClick}
            className="w-20 h-2 py-0.5 bg-transparent relative cursor-pointer flex items-center"
          >
            <div className="w-full h-1 bg-[#1F2232] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#38BDF8] rounded-full"
                style={{ width: `${isMuted ? 0 : volume * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Equalizer Modal Trigger */}
        <button
          onClick={onOpenEqualizer}
          className="text-[#958ea0] hover:text-[#8B5CF6] transition-colors p-1"
          title="10-Band Graphic Equalizer"
        >
          <span className="material-symbols-outlined text-[20px]">tune</span>
        </button>
      </div>
    </footer>
  );
};
