import React, { useState } from 'react';
import { audioEngine } from '../audio/audioEngine';

interface EqualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

const EQ_FREQS = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
const FREQ_LABELS = ['32Hz', '64Hz', '125Hz', '250Hz', '500Hz', '1kHz', '2kHz', '4kHz', '8kHz', '16kHz'];

export const EqualizerModal: React.FC<EqualizerModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const [gains, setGains] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [activePreset, setActivePreset] = useState<string>('flat');

  if (!isOpen) return null;

  const handleGainChange = (index: number, val: number) => {
    const updated = [...gains];
    updated[index] = val;
    setGains(updated);
    audioEngine.setEqBand(index, val);
  };

  const applyPreset = (preset: string) => {
    setActivePreset(preset);
    let newGains = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (preset === 'synthwave') {
      newGains = [5, 4, 2, -1, -2, 1, 3, 4, 5, 4];
    } else if (preset === 'bass') {
      newGains = [7, 6, 5, 2, 0, -1, -1, 0, 1, 1];
    } else if (preset === 'vocal') {
      newGains = [-2, -2, 0, 3, 5, 5, 3, 1, 0, -1];
    } else if (preset === 'electronic') {
      newGains = [4, 5, 2, 0, -2, 2, 4, 5, 4, 3];
    }
    setGains(newGains);
    newGains.forEach((g, idx) => audioEngine.setEqBand(idx, g));
    onShowToast(`Applied ${preset.toUpperCase()} EQ curve`);
  };

  const handleReset = () => {
    applyPreset('flat');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 select-none">
      <div className="w-full max-w-2xl bg-[#12131A] border border-[#2E334D] rounded-xl shadow-2xl p-6 space-y-6 glow-violet">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2E334D]/35">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6]">
              <span className="material-symbols-outlined text-[20px]">graphic_eq</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                10-Band Parametric Equalizer
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/25">
                  DSP Core
                </span>
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Real-time frequency curve processing via Web Audio BiquadFilters
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

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-[#958ea0] mr-2">Presets:</span>
          {['flat', 'synthwave', 'bass', 'vocal', 'electronic'].map((p) => (
            <button
              key={p}
              onClick={() => applyPreset(p)}
              className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-all ${
                activePreset === p
                  ? 'bg-[#8B5CF6] text-white font-semibold shadow-sm'
                  : 'bg-[#181A24] text-[#94A3B8] hover:text-white border border-[#2E334D]/40'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={handleReset}
            className="ml-auto text-xs font-mono text-[#958ea0] hover:text-white transition-colors"
          >
            Reset (0 dB)
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-10 gap-3 py-4 bg-[#0A0B10]/80 rounded-xl p-4 border border-[#2E334D]/25">
          {EQ_FREQS.map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="font-mono text-[10px] text-[#38BDF8]">
                {gains[i] > 0 ? `+${gains[i]}` : gains[i]}dB
              </span>

              {/* Vertical Slider */}
              <div className="h-36 flex items-center justify-center">
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="1"
                  value={gains[i]}
                  onChange={(e) => handleGainChange(i, Number(e.target.value))}
                  className="h-32 -rotate-90 appearance-none bg-[#1F2232] accent-[#8B5CF6] cursor-pointer rounded-lg w-2"
                />
              </div>

              <span className="font-mono text-[10px] text-[#958ea0]">
                {FREQ_LABELS[i]}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#2E334D]/35 text-xs font-mono text-[#958ea0]">
          <span>Output: Stereo DAC Direct Stream</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-white rounded-lg font-bold transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
