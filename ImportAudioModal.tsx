import React, { useState } from 'react';
import { Track } from '../types';

interface ImportAudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newTrack: Track) => void;
  nextTrackId: number;
}

export const ImportAudioModal: React.FC<ImportAudioModalProps> = ({
  isOpen,
  onClose,
  onImport,
  nextTrackId,
}) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('Synthwave');
  const [format, setFormat] = useState('FLAC 24-bit / 96kHz');
  const [bpm, setBpm] = useState(120);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim()) return;

    const hexId = nextTrackId.toString(16).padStart(2, '0');
    const newTrack: Track = {
      id: nextTrackId,
      title: title.trim(),
      artist: artist.trim(),
      album: album.trim() || 'Custom Student Import',
      duration: '3:30',
      seconds: 210,
      rate: format,
      size: '42.5 MB Local',
      path: `/assets/audio/${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.flac`,
      genre,
      rootFreq: 130.81,
      scale: [0, 3, 7, 10, 12, 14],
      bpm: Number(bpm) || 120,
      bitrate: '2,840 kbps VBR',
      bufferChunk: '4,096 samples (42ms)',
      memoryOffset: `0x005${hexId}000`,
      threadId: '0x70000a89b000 [AUDIO_RT]',
      memoryAddress: `0x7ffee491c${hexId}`,
    };

    onImport(newTrack);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 select-none">
      <div className="w-full max-w-lg bg-[#12131A] border border-[#2E334D] rounded-xl shadow-2xl p-6 space-y-5 glow-violet">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2E334D]/35">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6]">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Import Audio to C++ Heap
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Allocate new direct-memory PCM stream into the offline library
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#181A24] hover:bg-[#1F2232] text-[#958ea0] hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="text-[#958ea0] uppercase tracking-wider block mb-1">
              Track Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Cyber Horizon"
              className="w-full px-3 py-2 rounded-lg bg-[#0A0B10] border border-[#2E334D]/60 text-white placeholder-[#958ea0] focus:outline-none focus:border-[#8B5CF6] transition-colors"
            />
          </div>

          <div>
            <label className="text-[#958ea0] uppercase tracking-wider block mb-1">
              Artist Name *
            </label>
            <input
              type="text"
              required
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="e.g., Kaelen Brooks"
              className="w-full px-3 py-2 rounded-lg bg-[#0A0B10] border border-[#2E334D]/60 text-white placeholder-[#958ea0] focus:outline-none focus:border-[#8B5CF6] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#958ea0] uppercase tracking-wider block mb-1">
                Album
              </label>
              <input
                type="text"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                placeholder="e.g., Neon Reverie"
                className="w-full px-3 py-2 rounded-lg bg-[#0A0B10] border border-[#2E334D]/60 text-white placeholder-[#958ea0] focus:outline-none focus:border-[#8B5CF6] transition-colors"
              />
            </div>

            <div>
              <label className="text-[#958ea0] uppercase tracking-wider block mb-1">
                Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0B10] border border-[#2E334D]/60 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
              >
                <option value="Synthwave">Synthwave</option>
                <option value="Ambient">Ambient</option>
                <option value="Cyberpunk">Cyberpunk</option>
                <option value="Lofi">Lofi</option>
                <option value="Orchestral">Orchestral</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#958ea0] uppercase tracking-wider block mb-1">
                Codec / Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0B10] border border-[#2E334D]/60 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
              >
                <option value="FLAC 24-bit / 96kHz">FLAC 24-bit / 96kHz</option>
                <option value="48.0 kHz / 24-bit">48.0 kHz / 24-bit WAV</option>
                <option value="44.1 kHz / 16-bit">44.1 kHz / 16-bit PCM</option>
                <option value="DSD 2.8MHz 1-bit">DSD 2.8MHz 1-bit</option>
              </select>
            </div>

            <div>
              <label className="text-[#958ea0] uppercase tracking-wider block mb-1">
                Synthesizer BPM ({bpm})
              </label>
              <input
                type="number"
                min="50"
                max="180"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0B10] border border-[#2E334D]/60 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#181A24] border border-[#2E334D]/35 text-[#94A3B8] text-[11px]">
            <span className="text-[#38BDF8] font-bold block mb-0.5">Allocation Notice:</span>
            File pointer will be mapped into C++ fast-IO buffer with zero copy overhead. Direct PCM
            synthesis will start automatically on play.
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#2E334D]/35">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#181A24] text-[#958ea0] hover:text-white font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white font-bold font-mono hover:brightness-110 shadow-md transition-all"
            >
              Allocate & Import
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
