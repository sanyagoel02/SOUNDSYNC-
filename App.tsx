import { useState, useEffect, useCallback, useMemo } from 'react';
import { Track, PlaylistNode, ViewTab } from './types';
import { INITIAL_TRACKS } from './data/tracks';
import { audioEngine } from './audio/audioEngine';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { LibraryView } from './components/LibraryView';
import { InspectorPanel } from './components/InspectorPanel';
import { PlaylistView } from './components/PlaylistView';
import { PlayerDock } from './components/PlayerDock';
import { EqualizerModal } from './components/EqualizerModal';
import { AstDumpModal } from './components/AstDumpModal';
import { ImportAudioModal } from './components/ImportAudioModal';

// Helper to rebuild doubly linked list pointer graph
function createDoublyLinkedList(tracks: Track[]): PlaylistNode[] {
  return tracks.map((track, idx) => {
    const hex = (idx * 0x10 + 0x10).toString(16).padStart(3, '0');
    const prevHex = idx > 0 ? ((idx - 1) * 0x10 + 0x10).toString(16).padStart(3, '0') : null;
    const nextHex = idx < tracks.length - 1 ? ((idx + 1) * 0x10 + 0x10).toString(16).padStart(3, '0') : null;

    return {
      nodeId: `Node[${idx}]`,
      ptr: `0x7ffee491c${hex}`,
      prevPtr: prevHex ? `0x7ffee491c${prevHex}` : null,
      nextPtr: nextHex ? `0x7ffee491c${nextHex}` : null,
      track,
    };
  });
}

export default function App() {
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [currentTab, setCurrentTab] = useState<ViewTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected track for the Inspector panel (defaults to Track 4: Violet Horizon)
  const [selectedTrack, setSelectedTrack] = useState<Track>(INITIAL_TRACKS[3]);

  // Currently playing track
  const [currentTrack, setCurrentTrack] = useState<Track>(INITIAL_TRACKS[3]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(0);

  // Playback settings
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [likedTrackIds, setLikedTrackIds] = useState<Set<number>>(new Set([4]));

  // Playlist state (Doubly Linked List Structure initialized with Violet Horizon, Midnight Pulse, Echoes of Eternity)
  const [playlistNodes, setPlaylistNodes] = useState<PlaylistNode[]>(() =>
    createDoublyLinkedList([INITIAL_TRACKS[3], INITIAL_TRACKS[0], INITIAL_TRACKS[1]])
  );

  // Recently played history IDs
  const [recentIds, setRecentIds] = useState<number[]>([4, 1, 2, 7, 11, 25]);

  // Modals state
  const [isEqOpen, setIsEqOpen] = useState(false);
  const [isAstOpen, setIsAstOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Playlist track IDs set for fast check
  const playlistIds = useMemo(() => {
    return new Set(playlistNodes.map((n) => n.track.id));
  }, [playlistNodes]);

  // Master play track handler
  const handlePlayTrack = useCallback(
    (track: Track) => {
      setSelectedTrack(track);
      setCurrentTrack(track);

      // Guard against fake playback if audio source is unmounted/unavailable
      if (track.audioAvailable === false) {
        setIsPlaying(false);
        audioEngine.stopPlayback();
        setCurrentSeconds(0);
        showToast(`Cannot play "${track.title}": Audio source is unmounted or missing.`);
        return;
      }

      if (currentTrack.id === track.id && isPlaying) {
        // Toggle pause
        setIsPlaying(false);
        audioEngine.stopPlayback();
        return;
      }

      setCurrentSeconds(0);
      const played = audioEngine.playTrack(track);
      if (played) {
        setIsPlaying(true);
        // Add to recent
        setRecentIds((prev) => [track.id, ...prev.filter((id) => id !== track.id)].slice(0, 15));
        showToast(`Playing ${track.title} [${track.genre}]`);
      } else {
        setIsPlaying(false);
        showToast(`Cannot play "${track.title}": Audio source is unavailable.`);
      }
    },
    [currentTrack.id, isPlaying, showToast]
  );

  // Master play/pause toggle
  const handleTogglePlay = useCallback(() => {
    if (currentTrack.audioAvailable === false) {
      setIsPlaying(false);
      audioEngine.stopPlayback();
      showToast(`Cannot play "${currentTrack.title}": Audio source is unmounted or missing.`);
      return;
    }

    if (isPlaying) {
      setIsPlaying(false);
      audioEngine.stopPlayback();
    } else {
      const played = audioEngine.playTrack(currentTrack);
      if (played) {
        setIsPlaying(true);
        showToast(`Streaming ${currentTrack.title} [${currentTrack.genre}]`);
      } else {
        setIsPlaying(false);
        showToast(`Audio source unavailable for "${currentTrack.title}"`);
      }
    }
  }, [isPlaying, currentTrack, showToast]);

  // Scrubber progress ticker
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSeconds((prev) => {
        if (prev >= currentTrack.seconds) {
          // Track ended: next track or repeat
          if (isRepeat) {
            audioEngine.playTrack(currentTrack);
            return 0;
          }
          // Next track
          handleNextTrack();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentTrack, isRepeat]);

  // Next / Prev Track Handlers
  const handleNextTrack = useCallback(() => {
    if (currentTab === 'playlist' && playlistNodes.length > 0) {
      const idx = playlistNodes.findIndex((n) => n.track.id === currentTrack.id);
      const nextIdx = (idx + 1) % playlistNodes.length;
      handlePlayTrack(playlistNodes[nextIdx].track);
    } else {
      let idx = tracks.findIndex((t) => t.id === currentTrack.id);
      if (isShuffle) {
        idx = Math.floor(Math.random() * tracks.length);
      } else {
        idx = (idx + 1) % tracks.length;
      }
      handlePlayTrack(tracks[idx]);
    }
  }, [currentTab, playlistNodes, currentTrack.id, tracks, isShuffle, handlePlayTrack]);

  const handlePrevTrack = useCallback(() => {
    if (currentTab === 'playlist' && playlistNodes.length > 0) {
      const idx = playlistNodes.findIndex((n) => n.track.id === currentTrack.id);
      const prevIdx = (idx - 1 + playlistNodes.length) % playlistNodes.length;
      handlePlayTrack(playlistNodes[prevIdx].track);
    } else {
      const idx = tracks.findIndex((t) => t.id === currentTrack.id);
      const prevIdx = (idx - 1 + tracks.length) % tracks.length;
      handlePlayTrack(tracks[prevIdx]);
    }
  }, [currentTab, playlistNodes, currentTrack.id, tracks, handlePlayTrack]);

  // Toggle Track in Playlist
  const handleTogglePlaylist = useCallback(
    (trackId: number) => {
      const track = tracks.find((t) => t.id === trackId);
      if (!track) return;

      const existingIndex = playlistNodes.findIndex((n) => n.track.id === trackId);
      if (existingIndex >= 0) {
        // Remove from DLL
        const remainingTracks = playlistNodes
          .filter((_, i) => i !== existingIndex)
          .map((n) => n.track);
        setPlaylistNodes(createDoublyLinkedList(remainingTracks));
        showToast(`Removed "${track.title}" from My Playlist`);
      } else {
        // Append to DLL
        const newTracks = [...playlistNodes.map((n) => n.track), track];
        setPlaylistNodes(createDoublyLinkedList(newTracks));
        showToast(`Appended "${track.title}" to DLL Tail`);
      }
    },
    [tracks, playlistNodes, showToast]
  );

  // Remove node at index from DLL
  const handleRemoveNode = useCallback(
    (nodeIndex: number) => {
      const removedNode = playlistNodes[nodeIndex];
      const remaining = playlistNodes.filter((_, i) => i !== nodeIndex).map((n) => n.track);
      setPlaylistNodes(createDoublyLinkedList(remaining));
      showToast(`Removed node "${removedNode.track.title}" from DLL`);
    },
    [playlistNodes, showToast]
  );

  // Append next available song to DLL
  const handleAppendNodeToTail = useCallback(() => {
    const unadded = tracks.find((t) => !playlistIds.has(t.id));
    if (unadded) {
      const newTracks = [...playlistNodes.map((n) => n.track), unadded];
      setPlaylistNodes(createDoublyLinkedList(newTracks));
      showToast(`Appended Node "${unadded.title}" to DLL Tail`);
    } else {
      showToast(`All ${tracks.length} library tracks already queued in DLL pool`);
    }
  }, [tracks, playlistIds, playlistNodes, showToast]);

  // Clear Playlist
  const handleClearPlaylist = useCallback(() => {
    setPlaylistNodes([]);
    showToast('Cleared all nodes from DLL buffer');
  }, [showToast]);

  // DLL Mutations
  const handleReverseList = useCallback(() => {
    if (playlistNodes.length === 0) return;
    const reversedTracks = [...playlistNodes.map((n) => n.track)].reverse();
    setPlaylistNodes(createDoublyLinkedList(reversedTracks));
    showToast('Reversed Doubly Linked List via C++ pointer swap');
  }, [playlistNodes, showToast]);

  const handleSortByBpm = useCallback(() => {
    if (playlistNodes.length === 0) return;
    const sorted = [...playlistNodes.map((n) => n.track)].sort((a, b) => a.bpm - b.bpm);
    setPlaylistNodes(createDoublyLinkedList(sorted));
    showToast('Sorted DLL nodes by Synthesizer BPM (Ascending)');
  }, [playlistNodes, showToast]);

  const handleDefragNodes = useCallback(() => {
    if (playlistNodes.length === 0) return;
    // Reallocate clean sequential memory addresses
    setPlaylistNodes(createDoublyLinkedList(playlistNodes.map((n) => n.track)));
    showToast('Memory defragmentation complete: 0.00% fragmentation');
  }, [playlistNodes, showToast]);

  // Sort Library Tracks
  const handleSortBy = useCallback(
    (criterion: 'title' | 'album' | 'time') => {
      const sorted = [...tracks];
      if (criterion === 'title') {
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        showToast('Sorted library by Title via C++ Quicksort');
      } else if (criterion === 'album') {
        sorted.sort((a, b) => a.album.localeCompare(b.album));
        showToast('Sorted library by Album');
      } else if (criterion === 'time') {
        sorted.sort((a, b) => a.seconds - b.seconds);
        showToast('Sorted library by Duration (Ascending)');
      }
      setTracks(sorted);
    },
    [tracks, showToast]
  );

  // Filtered tracks for Library view
  const filteredTracks = useMemo(() => {
    let pool = tracks;
    if (currentTab === 'favorites') {
      pool = tracks.filter((t) => [1, 4, 7, 9, 14, 20, 26, 28, 31, 37, 38].includes(t.id));
    } else if (currentTab === 'focus') {
      pool = tracks.filter((t) => [2, 3, 6, 8, 12, 15, 19, 22, 29, 36, 40].includes(t.id));
    } else if (currentTab === 'synthwave') {
      pool = tracks.filter((t) => [1, 4, 5, 9, 16, 18, 20, 23, 24, 30, 32, 34, 39].includes(t.id));
    } else if (currentTab === 'recent') {
      pool = tracks.filter((t) => recentIds.includes(t.id));
    }

    if (!searchQuery.trim()) return pool;
    const q = searchQuery.toLowerCase().trim();
    return pool.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q) ||
        t.genre.toLowerCase().includes(q)
    );
  }, [tracks, currentTab, searchQuery, recentIds]);

  // Volume & Mute Handlers
  const handleVolumeChange = useCallback((newVol: number) => {
    setVolume(newVol);
    setIsMuted(false);
    audioEngine.setVolume(newVol);
  }, []);

  const handleToggleMute = useCallback(() => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  }, []);

  // Keyboard shortcut listener (⌘K and Spacebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCurrentTab('search');
        const input = document.querySelector('header input') as HTMLInputElement;
        if (input) input.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Import New Track Handler
  const handleImportNewTrack = useCallback(
    (newTrack: Track) => {
      setTracks((prev) => [newTrack, ...prev]);
      // Append to playlist as well
      setPlaylistNodes((prev) => createDoublyLinkedList([...prev.map((n) => n.track), newTrack]));
      setSelectedTrack(newTrack);
      showToast(`Imported "${newTrack.title}" into C++ Fast-IO Pool`);
    },
    [showToast]
  );

  return (
    <div className="bg-[#090A0F] text-[#e3e1ec] font-sans select-none overflow-hidden h-screen w-screen flex flex-col antialiased">
      {/* Top and Center Workspace Wrapper (calc 100vh - 88px) */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* A. Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            if (tab === 'search') {
              const input = document.querySelector('header input') as HTMLInputElement;
              if (input) input.focus();
            }
          }}
          playlistCount={playlistNodes.length}
          totalTracksCount={tracks.length}
          onOpenTelemetry={() => setIsAstOpen(true)}
          onOpenSettings={() => setIsEqOpen(true)}
        />

        {/* Center & Right Container */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#090A0F] overflow-hidden relative">
          {/* B. Top Header */}
          <TopHeader
            currentTab={currentTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
            onOpenImport={() => setIsImportOpen(true)}
            onOpenEqualizer={() => setIsEqOpen(true)}
            onOpenTelemetry={() => setIsAstOpen(true)}
            onSortGraph={() => {
              handleSortBy('title');
              showToast('Evaluated DAG topological graph sort order');
            }}
            totalTracks={tracks.length}
          />

          {/* C & D. Main Stage Viewport */}
          {currentTab === 'playlist' ? (
            /* Screen 2: My Playlist View with DLL Structure & Memory Node Graph */
            <PlaylistView
              nodes={playlistNodes}
              playingTrackId={currentTrack.id}
              isPlaying={isPlaying}
              onPlayNode={handlePlayTrack}
              onPlayAll={() => {
                if (playlistNodes.length > 0) {
                  handlePlayTrack(playlistNodes[0].track);
                }
              }}
              onShufflePlaylist={() => {
                const shuffled = [...playlistNodes.map((n) => n.track)].sort(
                  () => Math.random() - 0.5
                );
                setPlaylistNodes(createDoublyLinkedList(shuffled));
                showToast('Applied Fisher-Yates Circular Pointer Shuffle');
              }}
              onRemoveNode={handleRemoveNode}
              onAppendNodeToTail={handleAppendNodeToTail}
              onClearPlaylist={handleClearPlaylist}
              onReverseList={handleReverseList}
              onSortByBpm={handleSortByBpm}
              onDefragNodes={handleDefragNodes}
              onDumpAst={() => setIsAstOpen(true)}
              onGoToAllSongs={() => setCurrentTab('all')}
            />
          ) : (
            /* Screen 1: Library View + Now Inspecting Right Panel */
            <div className="flex-1 flex overflow-hidden min-h-0">
              <LibraryView
                tracks={filteredTracks}
                selectedTrackId={selectedTrack.id}
                playingTrackId={currentTrack.id}
                isPlaying={isPlaying}
                playlistIds={playlistIds}
                onSelectTrack={(t) => setSelectedTrack(t)}
                onPlayTrack={handlePlayTrack}
                onTogglePlaylist={handleTogglePlaylist}
                onSortBy={handleSortBy}
                onClearSearch={() => setSearchQuery('')}
              />

              <InspectorPanel
                track={selectedTrack}
                isPlaying={isPlaying}
                isCurrentlyPlayingTrack={currentTrack.id === selectedTrack.id}
                inPlaylist={playlistIds.has(selectedTrack.id)}
                onPlayTrack={() => handlePlayTrack(selectedTrack)}
                onTogglePlaylist={() => handleTogglePlaylist(selectedTrack.id)}
              />
            </div>
          )}
        </main>
      </div>

      {/* E. Persistent Bottom Audio Player Dock (Fixed height 88px) */}
      <PlayerDock
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        isLiked={likedTrackIds.has(currentTrack.id)}
        isShuffle={isShuffle}
        isRepeat={isRepeat}
        currentSeconds={currentSeconds}
        volume={volume}
        isMuted={isMuted}
        onTogglePlay={handleTogglePlay}
        onPrevTrack={handlePrevTrack}
        onNextTrack={handleNextTrack}
        onToggleShuffle={() => {
          setIsShuffle((prev) => !prev);
          showToast(`Shuffle ${!isShuffle ? 'Enabled' : 'Disabled'}`);
        }}
        onToggleRepeat={() => {
          setIsRepeat((prev) => !prev);
          showToast(`Repeat mode ${!isRepeat ? 'One-Track Active' : 'Off'}`);
        }}
        onToggleLike={() => {
          setLikedTrackIds((prev) => {
            const next = new Set(prev);
            if (next.has(currentTrack.id)) {
              next.delete(currentTrack.id);
              showToast(`Removed "${currentTrack.title}" from Favorites`);
            } else {
              next.add(currentTrack.id);
              showToast(`Added "${currentTrack.title}" to Favorites`);
            }
            return next;
          });
        }}
        onSeek={(sec) => {
          setCurrentSeconds(sec);
          if (!isPlaying) {
            handleTogglePlay();
          }
        }}
        onVolumeChange={handleVolumeChange}
        onToggleMute={handleToggleMute}
        onOpenQueue={() => setCurrentTab('playlist')}
        onOpenEqualizer={() => setIsEqOpen(true)}
        onSelectCurrentTrack={() => setSelectedTrack(currentTrack)}
      />

      {/* Modals */}
      <EqualizerModal
        isOpen={isEqOpen}
        onClose={() => setIsEqOpen(false)}
        onShowToast={showToast}
      />

      <AstDumpModal
        isOpen={isAstOpen}
        onClose={() => setIsAstOpen(false)}
        nodes={playlistNodes}
      />

      <ImportAudioModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImportNewTrack}
        nextTrackId={tracks.length + 1}
      />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 bg-[#1F2232] border border-[#8B5CF6]/50 text-white px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2.5 text-xs font-semibold z-50 animate-bounce">
          <span className="material-symbols-outlined text-[#8B5CF6] text-[18px]">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
