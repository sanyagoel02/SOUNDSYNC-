import React from 'react';
import { Track, PlaylistNode } from '../types';
import { PLAYLIST_HERO_ART_URL, TRACK_COVER_ART_MAP } from '../data/tracks';

interface PlaylistViewProps {
  nodes: PlaylistNode[];
  playingTrackId: number | null;
  isPlaying: boolean;
  onPlayNode: (track: Track) => void;
  onPlayAll: () => void;
  onShufflePlaylist: () => void;
  onRemoveNode: (nodeIndex: number) => void;
  onAppendNodeToTail: () => void;
  onClearPlaylist: () => void;
  onReverseList: () => void;
  onSortByBpm: () => void;
  onDefragNodes: () => void;
  onDumpAst: () => void;
  onGoToAllSongs: () => void;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({
  nodes,
  playingTrackId,
  isPlaying,
  onPlayNode,
  onPlayAll,
  onShufflePlaylist,
  onRemoveNode,
  onAppendNodeToTail,
  onClearPlaylist,
  onReverseList,
  onSortByBpm,
  onDefragNodes,
  onDumpAst,
  onGoToAllSongs,
}) => {
  // Compute total duration
  const totalSeconds = nodes.reduce((sum, n) => sum + n.track.seconds, 0);
  const totalMins = Math.floor(totalSeconds / 60);
  const remainingSecs = totalSeconds % 60;
  const formattedTotalDuration = `${totalMins} min ${remainingSecs} sec`;

  // Active head node
  const activeNode = nodes.find(n => n.track.id === playingTrackId) || nodes[0];
  const tailPointer = nodes.length > 0 ? nodes[nodes.length - 1].ptr : '0x000000000000';

  return (
    <div className="flex-1 flex overflow-hidden select-none bg-[#090A0F]">
      {/* Center Column: Stage & Track Listing */}
      <section className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        {/* Breadcrumbs & Context Path */}
        <div className="flex items-center justify-between text-xs font-mono text-[#958ea0]">
          <div className="flex items-center gap-2">
            <span>Offline Node</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#94A3B8]">Playlists</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#8B5CF6] font-medium">Study & Focus Session</span>
          </div>
          <div className="flex items-center gap-2 text-[#38BDF8] bg-[#38BDF8]/5 px-2.5 py-1 rounded border border-[#38BDF8]/20">
            <span className="material-symbols-outlined text-[14px]">sync</span>
            <span>Fast-IO C++ RAM Pool: 0 copy latency</span>
          </div>
        </div>

        {/* Playlist Hero Header Card */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1F2232]/90 via-[#181A24] to-[#0A0B10] border border-[#2E334D]/45 p-6 shadow-xl">
          {/* Ambient Glows */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#8B5CF6]/10 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#38BDF8]/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Cover Art */}
            <div className="relative w-40 h-40 rounded-xl overflow-hidden shadow-2xl border border-[#8B5CF6]/40 group flex-shrink-0">
              <img
                src={PLAYLIST_HERO_ART_URL}
                alt="Study & Focus Session"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10]/90 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[11px] font-mono text-[#38BDF8] bg-[#0A0B10]/80 px-2 py-0.5 rounded backdrop-blur-sm border border-[#38BDF8]/30">
                  DLL :: Ring
                </span>
              </div>
              <button
                onClick={onPlayAll}
                className="absolute inset-0 bg-[#0A0B10]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm"
              >
                <span
                  className="material-symbols-outlined text-[42px] text-[#8B5CF6]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  play_circle
                </span>
              </button>
            </div>

            {/* Header Metadata & Titles */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#38BDF8] font-bold bg-[#38BDF8]/15 px-2 py-0.5 rounded border border-[#38BDF8]/30">
                  Doubly Linked List Structure
                </span>
                <span className="text-xs font-mono text-[#958ea0]">
                  • Offline Storage Local
                </span>
              </div>

              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                My Playlist · Study & Focus Session
              </h1>

              <p className="text-sm text-[#94A3B8] max-w-2xl">
                Curated local tracks · Custom linked-list order · {nodes.length} tracks, {formattedTotalDuration}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
                <span className="bg-[#1F2232]/80 text-[#38BDF8] border border-[#38BDF8]/20 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">sd_card</span>
                  42.8 MB (Cached in RAM)
                </span>
                <span className="bg-[#1F2232]/80 text-white border border-[#2E334D]/35 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[#8B5CF6]">memory</span>
                  Zero-Heap Fragmentation
                </span>
                <span className="bg-[#1F2232]/80 text-[#958ea0] border border-[#2E334D]/35 px-2.5 py-1 rounded-md">
                  Alloc: std::pmr::list
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons Strip */}
          <div className="mt-6 pt-5 border-t border-[#2E334D]/25 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={onPlayAll}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8] text-white font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-[0_0_20px_-4px_rgba(139,92,246,0.5)] hover:brightness-110 active:scale-95 transition-all text-sm"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  play_arrow
                </span>
                <span>Play All</span>
              </button>

              <button
                onClick={onShufflePlaylist}
                className="bg-[#1F2232] hover:bg-[#282B3E] text-white border border-[#2E334D]/45 px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm transition-all hover:border-[#8B5CF6]/50 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px] text-[#38BDF8]">shuffle</span>
                <span>Shuffle Playlist</span>
              </button>

              <button
                onClick={onAppendNodeToTail}
                className="bg-[#181A24] hover:bg-[#1F2232] text-[#94A3B8] hover:text-white border border-[#2E334D]/35 px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">library_add</span>
                <span>Add More Songs</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClearPlaylist}
                className="text-[#958ea0] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10 border border-transparent hover:border-[#ffb4ab]/25 px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
                <span>Clear Playlist</span>
              </button>

              <button
                onClick={onDumpAst}
                className="p-2 text-[#958ea0] hover:text-white hover:bg-[#181A24] rounded-lg border border-[#2E334D]/35 transition-colors"
                title="View AST Memory Graph"
              >
                <span className="material-symbols-outlined text-[18px]">more_vert</span>
              </button>
            </div>
          </div>
        </div>

        {/* Playable Track Data Table (DLL Pointer Sequence) */}
        <div className="bg-[#12131A] border border-[#2E334D]/35 rounded-xl overflow-hidden shadow-lg">
          {/* Table Filter Bar */}
          <div className="px-5 py-3 border-b border-[#2E334D]/25 flex items-center justify-between bg-[#181A24]/40">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#958ea0] uppercase tracking-wider">
                Node Index
              </span>
              <span className="text-xs font-mono text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/25">
                Order: DLL Pointer Sequence
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-[#958ea0]">
              <span>Filter: Lossless FLAC</span>
              <span className="material-symbols-outlined text-[16px] cursor-pointer hover:text-white">
                tune
              </span>
            </div>
          </div>

          {/* Table Headers */}
          <div className="grid grid-cols-12 gap-3 px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-[#958ea0] border-b border-[#2E334D]/25 bg-[#0A0B10]/60">
            <div className="col-span-1 flex items-center justify-center"># / Node</div>
            <div className="col-span-5 flex items-center">Title & Artist</div>
            <div className="col-span-3 flex items-center">Album / Context</div>
            <div className="col-span-1 flex items-center justify-center">Duration</div>
            <div className="col-span-2 flex items-center justify-end pr-2">Linked Actions</div>
          </div>

          {/* Nodes Rows */}
          {nodes.map((node, index) => {
            const isCurrentlyPlaying = node.track.id === playingTrackId && isPlaying;
            const coverArt = TRACK_COVER_ART_MAP[node.track.id] || TRACK_COVER_ART_MAP[4];

            return (
              <div
                key={node.ptr}
                className={`grid grid-cols-12 gap-3 px-5 py-3.5 items-center transition-all group border-b border-[#2E334D]/20 relative ${
                  isCurrentlyPlaying
                    ? 'bg-[#8B5CF6]/15 border-l-4 border-[#8B5CF6] hover:bg-[#8B5CF6]/20'
                    : 'hover:bg-[#181A24]'
                }`}
              >
                {/* Col 1: Equalizer / Reorder Handle */}
                <div className="col-span-1 flex items-center justify-center gap-2">
                  <span
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[#958ea0] hover:text-[#8B5CF6] cursor-grab"
                    title="Drag node"
                  >
                    <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
                  </span>

                  {isCurrentlyPlaying ? (
                    <div className="flex items-end gap-[3px] h-4 w-4 justify-center" title="Currently Playing">
                      <div className="w-[3px] bg-[#38BDF8] eq-bar-1 rounded-t-sm"></div>
                      <div className="w-[3px] bg-[#8B5CF6] eq-bar-2 rounded-t-sm"></div>
                      <div className="w-[3px] bg-[#38BDF8] eq-bar-3 rounded-t-sm"></div>
                    </div>
                  ) : (
                    <span className="text-xs font-mono text-[#958ea0] group-hover:hidden">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  )}

                  {!isCurrentlyPlaying && (
                    <button
                      onClick={() => onPlayNode(node.track)}
                      className="hidden group-hover:inline-flex text-[#8B5CF6] hover:scale-110 transition-transform"
                    >
                      <span className="material-symbols-outlined text-[18px]">play_circle</span>
                    </button>
                  )}
                </div>

                {/* Col 2: Title & Artist */}
                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 border border-[#8B5CF6]/40 shadow-sm">
                    <img
                      src={coverArt}
                      alt={node.track.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div
                      onClick={() => onPlayNode(node.track)}
                      className="absolute inset-0 bg-[#8B5CF6]/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <span
                        className="material-symbols-outlined text-white text-[20px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {isCurrentlyPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </div>
                  </div>

                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold truncate ${
                          isCurrentlyPlaying ? 'text-[#8B5CF6]' : 'text-white'
                        }`}
                      >
                        {node.track.title}
                      </span>
                      {isCurrentlyPlaying && (
                        <span className="text-[10px] font-mono bg-[#8B5CF6]/25 text-[#d0bcff] px-1.5 py-0.2 rounded border border-[#8B5CF6]/35">
                          CURRENT
                        </span>
                      )}
                      {node.track.audioAvailable === false ? (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          No Audio File
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[#38BDF8] bg-[#38BDF8]/10 px-1 py-0.2 rounded">
                          FLAC 24b
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#94A3B8] truncate">{node.track.artist}</p>
                  </div>
                </div>

                {/* Col 3: Album */}
                <div className="col-span-3 text-xs text-[#94A3B8] truncate">
                  {node.track.album}
                </div>

                {/* Col 4: Duration */}
                <div
                  className={`col-span-1 text-xs font-mono text-center font-medium ${
                    isCurrentlyPlaying ? 'text-[#8B5CF6]' : 'text-[#958ea0]'
                  }`}
                >
                  {node.track.audioAvailable === false ? (
                    <span className="text-amber-400/80 text-[11px]">Unmounted</span>
                  ) : (
                    node.track.duration
                  )}
                </div>

                {/* Col 5: Linked Actions & Prominent Remove Action */}
                <div className="col-span-2 flex items-center justify-end gap-1.5 pr-2">
                  <button
                    onClick={() => onPlayNode(node.track)}
                    disabled={node.track.audioAvailable === false}
                    className={`p-1.5 rounded-lg transition-colors ${
                      node.track.audioAvailable === false
                        ? 'text-amber-500/50 cursor-not-allowed'
                        : 'text-[#8B5CF6] hover:bg-[#8B5CF6]/20'
                    }`}
                    title={
                      node.track.audioAvailable === false
                        ? 'Audio file unmounted or missing'
                        : isCurrentlyPlaying
                        ? 'Pause'
                        : 'Play Node'
                    }
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {node.track.audioAvailable === false
                        ? 'block'
                        : isCurrentlyPlaying
                        ? 'pause'
                        : 'play_arrow'}
                    </span>
                  </button>

                  {/* Prominent Remove Action Button with Hover/Tooltip */}
                  <button
                    onClick={() => onRemoveNode(index)}
                    className="p-1.5 rounded-lg text-[#958ea0] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/20 border border-transparent hover:border-[#ffb4ab]/30 transition-all group/del relative"
                    title="Remove track from linked list"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    <span className="absolute right-0 -top-7 hidden group-hover/del:block bg-[#1F2232] text-[#ffb4ab] text-[11px] font-mono px-2 py-0.5 rounded shadow whitespace-nowrap z-20 border border-[#ffb4ab]/30">
                      Remove Node
                    </span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Node Add Bar / End of List Pointer */}
          <div className="px-5 py-3 bg-[#0A0B10]/45 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-[#958ea0]">
              <span className="material-symbols-outlined text-[16px] text-[#8B5CF6]">
                arrow_downward
              </span>
              <span>
                Tail Pointer: <code className="text-[#38BDF8]">{tailPointer}</code> (Node #{nodes.length} -&gt; nullptr)
              </span>
            </div>

            <button
              onClick={onAppendNodeToTail}
              className="text-[#8B5CF6] hover:text-[#38BDF8] flex items-center gap-1 transition-colors font-medium"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Append New Node to Tail</span>
            </button>
          </div>
        </div>

        {/* Empty State Preview Container */}
        {nodes.length === 0 && (
          <div className="rounded-xl border border-dashed border-[#2E334D]/50 bg-[#12131A]/40 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#38BDF8] text-[20px]">info</span>
                <h3 className="text-base font-semibold text-white">
                  Empty State Specification Preview
                </h3>
              </div>
              <span className="text-xs font-mono bg-[#181A24] px-2 py-0.5 rounded text-[#958ea0] border border-[#2E334D]/35">
                Node Count: 0 Fallback
              </span>
            </div>

            <div className="bg-[#0A0B10]/60 rounded-lg p-6 border border-[#2E334D]/30 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#181A24] flex items-center justify-center border border-[#2E334D]/40 text-[#958ea0]">
                <span className="material-symbols-outlined text-[24px]">music_off</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">
                  Your playlist is waiting for its first track.
                </p>
                <p className="text-xs text-[#94A3B8] max-w-md">
                  Add songs from <span className="text-[#8B5CF6] font-medium">All Songs</span> or append offline audio files from your student repository.
                </p>
              </div>

              <button
                onClick={onGoToAllSongs}
                className="mt-2 text-xs font-mono text-[#8B5CF6] hover:text-white bg-[#8B5CF6]/15 hover:bg-[#8B5CF6] px-3.5 py-2 rounded-lg border border-[#8B5CF6]/35 transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">explore</span>
                <span>Browse Local Library</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Right Panel: Playlist Inspector & DSA Telemetry (Fixed width 320px) */}
      <aside className="w-80 bg-[#12131A] border-l border-[#2E334D]/35 overflow-y-auto custom-scrollbar p-5 flex flex-col space-y-6 select-none h-full">
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2E334D]/25">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#38BDF8] text-[20px]">account_tree</span>
              Playlist Inspector
            </h2>
            <p className="text-xs font-mono text-[#958ea0]">Doubly Linked List Structure</p>
          </div>
          <span className="text-xs font-mono bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/25 px-2 py-0.5 rounded">
            O(1) Insertion
          </span>
        </div>

        {/* Doubly Linked List Memory Node Graph (Head -> 1 <-> 2 <-> 3 -> Tail) */}
        <div className="bg-[#0A0B10] rounded-xl p-4 border border-[#2E334D]/35 space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#958ea0] uppercase tracking-wider">
              Memory Node Graph
            </span>
            <span className="text-[10px] font-mono text-[#8B5CF6] bg-[#8B5CF6]/15 px-1.5 py-0.2 rounded border border-[#8B5CF6]/25">
              Active Head
            </span>
          </div>

          {nodes.slice(0, 3).map((n, i) => (
            <React.Fragment key={n.ptr}>
              <div
                className={`p-2.5 rounded-lg space-y-1 transition-all ${
                  n.track.id === playingTrackId
                    ? 'bg-[#8B5CF6]/15 border border-[#8B5CF6]/50 shadow-sm'
                    : 'bg-[#181A24] border border-[#2E334D]/35'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span
                    className={`font-bold flex items-center gap-1.5 ${
                      n.track.id === playingTrackId ? 'text-[#8B5CF6]' : 'text-white'
                    }`}
                  >
                    {n.track.id === playingTrackId && (
                      <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse"></span>
                    )}
                    {n.nodeId} {i === 0 ? '· Head' : i === nodes.length - 1 ? '· Tail' : ''}
                  </span>
                  <span className="text-[#958ea0] text-[10px]">{n.ptr}</span>
                </div>

                <p className="text-xs text-white font-medium truncate">{n.track.title}</p>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8] pt-1 border-t border-[#2E334D]/25">
                  <span>prev: {n.prevPtr || 'nullptr'}</span>
                  <span className="text-[#38BDF8]">next: {n.nextPtr ? n.nextPtr.slice(0, 7) + '..' : 'nullptr'}</span>
                </div>
              </div>

              {i < Math.min(nodes.length - 1, 2) && (
                <div className="flex justify-center items-center py-0.5 text-[#38BDF8]">
                  <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Selected Node Properties / Audio Diagnostics */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono text-[#958ea0] uppercase tracking-wider">
            Active Node Telemetry
          </h3>

          <div className="bg-[#181A24] rounded-xl p-3.5 border border-[#2E334D]/35 space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-[#2E334D]/25">
              <span className="text-[#958ea0]">Codec</span>
              <span className="text-[#8B5CF6] font-bold">FLAC 24-bit / 96kHz</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#2E334D]/25">
              <span className="text-[#958ea0]">Bitrate</span>
              <span className="text-white">{activeNode?.track.bitrate || '2,840 kbps VBR'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#2E334D]/25">
              <span className="text-[#958ea0]">Buffer Chunk</span>
              <span className="text-[#38BDF8]">
                {activeNode?.track.bufferChunk || '4,096 samples (42ms)'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#2E334D]/25">
              <span className="text-[#958ea0]">Memory Offset</span>
              <span className="text-white">
                {activeNode?.track.memoryOffset || '0x004F38A0'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#958ea0]">Thread ID</span>
              <span className="text-white">
                {activeNode?.track.threadId || '0x70000a89b000 [AUDIO_RT]'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick C++ Operations */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-mono text-[#958ea0] uppercase tracking-wider">
            Mutations
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onReverseList}
              className="bg-[#181A24] hover:bg-[#1F2232] border border-[#2E334D]/40 p-2 rounded text-xs font-mono text-white text-center transition-colors hover:border-[#8B5CF6]/50"
            >
              Reverse List
            </button>

            <button
              onClick={onSortByBpm}
              className="bg-[#181A24] hover:bg-[#1F2232] border border-[#2E334D]/40 p-2 rounded text-xs font-mono text-white text-center transition-colors hover:border-[#8B5CF6]/50"
            >
              Sort by BPM
            </button>

            <button
              onClick={onDefragNodes}
              className="bg-[#181A24] hover:bg-[#1F2232] border border-[#2E334D]/40 p-2 rounded text-xs font-mono text-white text-center transition-colors hover:border-[#38BDF8]/50"
            >
              Defrag Nodes
            </button>

            <button
              onClick={onDumpAst}
              className="bg-[#181A24] hover:bg-[#1F2232] border border-[#2E334D]/40 p-2 rounded text-xs font-mono text-[#38BDF8] text-center transition-colors hover:border-[#38BDF8]"
            >
              Dump AST
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};
