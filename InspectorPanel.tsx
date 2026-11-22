import React, { useState, useEffect } from 'react';
import { Track, InspectorTab } from '../types';
import { DEFAULT_INSPECT_ART, TRACK_COVER_ART_MAP } from '../data/tracks';
import { audioEngine } from '../audio/audioEngine';

interface InspectorPanelProps {
  track: Track;
  isPlaying: boolean;
  isCurrentlyPlayingTrack: boolean;
  inPlaylist: boolean;
  onPlayTrack: () => void;
  onTogglePlaylist: () => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  track,
  isPlaying,
  isCurrentlyPlayingTrack,
  inPlaylist,
  onPlayTrack,
  onTogglePlaylist,
}) => {
  const [activeTab, setActiveTab] = useState<InspectorTab>('specs');
  const [waveHeights, setWaveHeights] = useState<number[]>([12, 24, 36, 48, 28, 40, 20, 32, 44, 16, 28, 40, 24, 12]);
  const [rmsDb, setRmsDb] = useState<string>('-14.2 dB');

  const coverArt = TRACK_COVER_ART_MAP[track.id] || DEFAULT_INSPECT_ART;
  const hexPtr = `PTR_0x${(track.id < 16 ? '0' : '') + track.id.toString(16).toUpperCase()}`;

  // Animate dynamic waveform bars when playing
  useEffect(() => {
    let animId: number;
    const updateWave = () => {
      if (isPlaying && isCurrentlyPlayingTrack) {
        const freqData = audioEngine.getByteFrequencyData();
        const newBars: number[] = [];
        let sum = 0;
        for (let i = 0; i < 14; i++) {
          const val = freqData[i * 2] || Math.floor(Math.random() * 35 + 10);
          const height = Math.max(4, Math.min(52, Math.floor((val / 255) * 52)));
          newBars.push(height);
          sum += val;
        }
        setWaveHeights(newBars);
        const avg = sum / 14;
        const rms = (-10 - (255 - avg) / 10).toFixed(1);
        setRmsDb(`${rms} dB`);
      } else {
        setWaveHeights([4, 6, 8, 12, 10, 8, 6, 8, 10, 6, 4, 8, 6, 4]);
        setRmsDb('-∞ dB');
      }
      animId = requestAnimationFrame(updateWave);
    };

    animId = requestAnimationFrame(updateWave);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isCurrentlyPlayingTrack]);

  return (
    <aside className="w-[320px] flex-shrink-0 bg-[#12131A]/70 border-l border-[#2E334D]/25 flex flex-col overflow-y-auto select-none h-full">
      <div className="p-5 flex flex-col gap-4">
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#2E334D]/25">
          <span className="font-mono text-xs uppercase tracking-wider font-bold text-[#958ea0]">
            Now Inspecting
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30">
            ID: {hexPtr}
          </span>
        </div>

        {/* Album Artwork with Ambient Violet Glow */}
        <div className="relative group mx-auto w-56 h-56 rounded-xl overflow-hidden border border-[#2E334D]/60 shadow-2xl glow-violet bg-[#181A24]">
          <img
            src={coverArt}
            alt={track.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = DEFAULT_INSPECT_ART;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 justify-between">
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/60 text-[#38BDF8] border border-[#38BDF8]/20 backdrop-blur-md">
              FLAC Master
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#8B5CF6]/30 text-white border border-[#8B5CF6]/40 font-semibold">
              {track.genre}
            </span>
          </div>
        </div>

        {/* Title & Artist Info */}
        <div className="text-center flex flex-col gap-1">
          <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
            {track.title}
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#94A3B8] font-medium">
            <span className="text-[#a078ff] font-semibold">{track.artist}</span>
            <span
              className="material-symbols-outlined text-[#38BDF8] text-[15px]"
              title="Verified C++ Audio Tag"
            >
              verified
            </span>
          </div>
          <p className="text-[11px] text-[#958ea0] font-sans">
            {track.album} • 2024
          </p>
        </div>

        {/* Unmounted Audio Warning Banner if unavailable */}
        {track.audioAvailable === false && (
          <div className="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-start gap-2 text-xs">
            <span className="material-symbols-outlined text-[18px] text-amber-400 shrink-0 mt-0.5">
              warning
            </span>
            <div className="flex flex-col">
              <span className="font-mono text-[11px] font-bold text-amber-300">
                Audio Source Unavailable
              </span>
              <span className="text-[10px] text-[#94A3B8]">
                This track is unmounted or missing from the local C++ storage. Playback is disabled to prevent fake playback.
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onPlayTrack}
            disabled={track.audioAvailable === false}
            className={`col-span-1 py-2 px-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-transform ${
              track.audioAvailable === false
                ? 'bg-[#1F2232] text-amber-400/80 border border-amber-500/30 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#8B5CF6]/90 hover:to-[#6366F1]/90 text-white shadow-md shadow-[#8B5CF6]/25 active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {track.audioAvailable === false
                ? 'block'
                : isPlaying && isCurrentlyPlayingTrack
                ? 'pause'
                : 'play_arrow'}
            </span>
            <span>
              {track.audioAvailable === false
                ? 'Source Offline'
                : isPlaying && isCurrentlyPlayingTrack
                ? 'Pause Track'
                : 'Play Track'}
            </span>
          </button>

          <button
            onClick={onTogglePlaylist}
            className={`col-span-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border transition-colors ${
              inPlaylist
                ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]/50 text-[#d0bcff]'
                : 'bg-[#1F2232] hover:bg-[#282B3E] border-[#2E334D]/40 text-white'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[16px] ${
                inPlaylist ? 'text-[#8B5CF6]' : 'text-[#38BDF8]'
              }`}
            >
              {inPlaylist ? 'playlist_add_check' : 'add'}
            </span>
            <span>{inPlaylist ? 'In Playlist' : 'Add Playlist'}</span>
          </button>
        </div>

        {/* Interactive Mini Tabs */}
        <div className="bg-[#0A0B10]/80 p-1 rounded-lg border border-[#2E334D]/35 flex items-center text-[11px] font-mono">
          <button
            onClick={() => setActiveTab('specs')}
            className={`flex-1 py-1 text-center rounded transition-colors ${
              activeTab === 'specs'
                ? 'text-white bg-[#181A24] font-semibold shadow-sm'
                : 'text-[#958ea0] hover:text-white'
            }`}
          >
            Specs
          </button>
          <button
            onClick={() => setActiveTab('wave')}
            className={`flex-1 py-1 text-center rounded transition-colors ${
              activeTab === 'wave'
                ? 'text-white bg-[#181A24] font-semibold shadow-sm'
                : 'text-[#958ea0] hover:text-white'
            }`}
          >
            Waveform
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-1 text-center rounded transition-colors ${
              activeTab === 'notes'
                ? 'text-white bg-[#181A24] font-semibold shadow-sm'
                : 'text-[#958ea0] hover:text-white'
            }`}
          >
            Notes
          </button>
        </div>

        {/* Tab 1: Specs Grid */}
        {activeTab === 'specs' && (
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-[#181A24]/60 border border-[#2E334D]/30 flex flex-col">
              <span className="text-[10px] text-[#958ea0] uppercase">Duration</span>
              <span className="font-bold text-white text-sm mt-0.5">{track.duration}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#181A24]/60 border border-[#2E334D]/30 flex flex-col">
              <span className="text-[10px] text-[#958ea0] uppercase">Sample Rate</span>
              <span className="font-bold text-[#38BDF8] text-xs mt-0.5">{track.rate}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#181A24]/60 border border-[#2E334D]/30 flex flex-col">
              <span className="text-[10px] text-[#958ea0] uppercase">Bitrate</span>
              <span className="font-bold text-white text-xs mt-0.5">
                {track.bitrate || '1411 kbps'}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#181A24]/60 border border-[#2E334D]/30 flex flex-col">
              <span className="text-[10px] text-[#958ea0] uppercase">File Size</span>
              <span className="font-bold text-emerald-400 text-xs mt-0.5">{track.size}</span>
            </div>
          </div>
        )}

        {/* Tab 2: Waveform Visualizer */}
        {activeTab === 'wave' && (
          <div className="flex flex-col gap-2 p-3 rounded-lg bg-[#181A24]/60 border border-[#2E334D]/30">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#958ea0]">
              <span>FFT Spectrum Analysis</span>
              <span className="text-[#38BDF8]">RMS: {rmsDb}</span>
            </div>

            <div className="h-14 flex items-end justify-between gap-1 px-1 py-2 bg-[#0A0B10]/90 rounded border border-[#2E334D]/25">
              {waveHeights.map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}px` }}
                  className={`w-1.5 rounded-t transition-all duration-75 ${
                    i % 3 === 0
                      ? 'bg-[#8B5CF6]'
                      : i % 3 === 1
                      ? 'bg-[#38BDF8]'
                      : 'bg-[#a078ff]'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-center text-[#958ea0] font-mono">
              Live Web Audio DSP Stream (48 kHz)
            </span>
          </div>
        )}

        {/* Tab 3: Notes */}
        {activeTab === 'notes' && (
          <div className="p-3 rounded-lg bg-[#181A24]/60 border border-[#2E334D]/30 text-xs text-[#94A3B8] font-sans space-y-1">
            <p className="font-semibold text-white">Student Project Track Notes:</p>
            <p>
              Encoded with libsndfile in C++. Stored sequentially in dynamic vector buffer with LRU
              eviction cache. Zero copy latency on PCM direct stream.
            </p>
          </div>
        )}

        {/* Local Storage Asset Pointer */}
        <div className="p-2.5 rounded-lg bg-[#0A0B10]/95 border border-[#8B5CF6]/25 flex items-start gap-2 text-xs">
          <span className="material-symbols-outlined text-[16px] text-[#8B5CF6] mt-0.5 flex-shrink-0">
            folder
          </span>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-mono text-[#958ea0] uppercase font-semibold">
              Local Asset Pointer
            </span>
            <code className="text-[11px] font-mono text-[#8B5CF6]/95 truncate">
              {track.path}
            </code>
          </div>
        </div>
      </div>
    </aside>
  );
};
