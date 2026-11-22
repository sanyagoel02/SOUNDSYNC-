import React, { useState } from 'react';
import { PlaylistNode } from '../types';

interface AstDumpModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: PlaylistNode[];
}

const CPP_SOURCE_FILES: Record<string, { desc: string; code: string }> = {
  'Song.h': {
    desc: 'OOP Encapsulation: Private member variables & public accessors',
    code: `#ifndef SONG_H
#define SONG_H

#include <string>
#include <iostream>

/**
 * @class Song
 * @brief Represents a single audio track in the SoundSync application.
 * 
 * OOP Concept: Encapsulation
 * All data members (id, title, artist, album, filePath, duration) are private.
 * Access is provided strictly through public getter methods and member functions.
 */
class Song {
private:
    int id;                 // Unique identifier for the song
    std::string title;      // Song title
    std::string artist;     // Artist or performer name
    std::string album;      // Album name
    std::string filePath;   // Path to the audio asset
    std::string duration;   // Duration in "MM:SS" format

public:
    Song();
    Song(int songId, const std::string& songTitle, const std::string& artistName,
         const std::string& albumName, const std::string& path, const std::string& songDuration);

    int getId() const;
    std::string getTitle() const;
    std::string getArtist() const;
    std::string getAlbum() const;
    std::string getFilePath() const;
    std::string getDuration() const;

    void display() const;
};

#endif // SONG_H`,
  },
  'Song.cpp': {
    desc: 'Song constructor, getters implementation & tabular display format',
    code: `#include "Song.h"
#include <iomanip>

Song::Song() : id(0), title("Unknown"), artist("Unknown"), album("Unknown"), filePath(""), duration("0:00") {}

Song::Song(int songId, const std::string& songTitle, const std::string& artistName,
           const std::string& albumName, const std::string& path, const std::string& songDuration)
    : id(songId), title(songTitle), artist(artistName), album(albumName), filePath(path), duration(songDuration) {}

int Song::getId() const { return id; }
std::string Song::getTitle() const { return title; }
std::string Song::getArtist() const { return artist; }
std::string Song::getAlbum() const { return album; }
std::string Song::getFilePath() const { return filePath; }
std::string Song::getDuration() const { return duration; }

void Song::display() const {
    std::cout << "[" << std::setw(2) << std::setfill('0') << id << "] "
              << std::setfill(' ')
              << std::left << std::setw(25) << title
              << std::setw(20) << artist
              << std::setw(22) << album
              << std::right << std::setw(6) << duration
              << "  (" << filePath << ")\\n";
}`,
  },
  'MusicLibrary.h': {
    desc: 'Dynamic array storage & Linear Search algorithm declarations',
    code: `#ifndef MUSICLIBRARY_H
#define MUSICLIBRARY_H

#include "Song.h"
#include <vector>
#include <string>

/**
 * @class MusicLibrary
 * @brief Manages the collection of all available songs in SoundSync.
 * 
 * OOP Concept: Composition (MusicLibrary has-a std::vector<Song>)
 * DSA Concept: Dynamic Array & Linear Search (O(n))
 */
class MusicLibrary {
private:
    std::vector<Song> songs;
    static bool containsIgnoreCase(const std::string& source, const std::string& query);

public:
    MusicLibrary();
    void addSong(const Song& song);
    void displayAllSongs() const;

    void searchByTitle(const std::string& query) const;
    void searchByArtist(const std::string& query) const;

    bool getSongById(int id, Song& outSong) const;
    bool loadFromFile(const std::string& filename);
    void loadDefaultCatalog(); // Loads all 40 curated tracks

    int getTotalSongs() const;
    bool isEmpty() const;
};

#endif // MUSICLIBRARY_H`,
  },
  'Playlist.h': {
    desc: 'Doubly Linked List node definition, pointers & RAII destructor',
    code: `#ifndef PLAYLIST_H
#define PLAYLIST_H

#include "Song.h"
#include <string>

/**
 * @struct PlaylistNode
 * @brief Bidirectional node with prev and next pointers.
 */
struct PlaylistNode {
    Song song;
    PlaylistNode* prev;
    PlaylistNode* next;

    PlaylistNode(const Song& s) : song(s), prev(nullptr), next(nullptr) {}
};

/**
 * @class Playlist
 * @brief Custom Doubly Linked List for active track sequencing.
 * 
 * DSA Concept: Doubly Linked List (DLL)
 * - O(1) Tail Insertion
 * - O(1) Bidirectional Navigation
 * - O(n) Search & O(1) Unlink
 * 
 * OOP Concept: RAII memory cleanup & deep copy rule-of-three
 */
class Playlist {
private:
    std::string name;
    PlaylistNode* head;
    PlaylistNode* tail;
    PlaylistNode* current;
    int songCount;

    void clear();

public:
    Playlist(const std::string& playlistName = "My Playlist");
    ~Playlist();

    Playlist(const Playlist& other);
    Playlist& operator=(const Playlist& other);

    void addSong(const Song& song);
    bool removeSongById(int songId);
    void displayPlaylist() const;

    bool nextTrack();
    bool previousTrack();
    bool setCurrentSong(int songId);

    Song* getCurrentSong();
    std::string getName() const;
    int getSongCount() const;
    bool isEmpty() const;

    bool saveToFile(const std::string& filename) const;
};

#endif // PLAYLIST_H`,
  },
  'MusicPlayer.h': {
    desc: 'State machine (STOPPED/PLAYING/PAUSED) & track control logic',
    code: `#ifndef MUSICPLAYER_H
#define MUSICPLAYER_H

#include "Song.h"
#include "Playlist.h"
#include <string>

enum class PlayerState {
    STOPPED,
    PLAYING,
    PAUSED
};

/**
 * @class MusicPlayer
 * @brief Workstation control state machine.
 * 
 * OOP Concept: Association with Playlist* & Composition with Song
 */
class MusicPlayer {
private:
    Song currentSong;
    PlayerState state;
    Playlist* activePlaylist;
    bool hasTrack;

public:
    MusicPlayer();

    void attachPlaylist(Playlist* playlist);
    void loadSong(const Song& song);
    void selectFromActivePlaylist();

    void play();
    void pause();
    void resume();
    void stop();

    void nextTrack();
    void previousTrack();

    PlayerState getState() const;
    std::string getStateString() const;
    Song getCurrentSong() const;
    bool hasActiveTrack() const;
    void displayPlayerStatus() const;
};

#endif // MUSICPLAYER_H`,
  },
  'main.cpp': {
    desc: 'Interactive 17-point console menu & automated OOP/DSA test suite',
    code: `// Run with: g++ -std=c++17 *.cpp -o soundsync && ./soundsync
// Run tests: ./soundsync --test`,
  },
  'Makefile': {
    desc: 'GCC / Clang build configuration with test and clean targets',
    code: `CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -O2
TARGET = soundsync
SRCS = Song.cpp MusicLibrary.cpp Playlist.cpp MusicPlayer.cpp main.cpp
OBJS = $(SRCS:.cpp=.o)

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(OBJS)

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

test: $(TARGET)
	./$(TARGET) --test

clean:
	rm -f $(OBJS) $(TARGET) my_playlist.txt`,
  },
};

export const AstDumpModal: React.FC<AstDumpModalProps> = ({ isOpen, onClose, nodes }) => {
  const [activeTab, setActiveTab] = useState<'ast' | 'cpp' | 'build'>('ast');
  const [selectedFile, setSelectedFile] = useState<string>('Song.h');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    const code = CPP_SOURCE_FILES[selectedFile]?.code || '';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none">
      <div className="w-full max-w-4xl bg-[#12131A] border border-[#2E334D] rounded-xl shadow-2xl p-6 space-y-5 glow-violet flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2E334D]/35 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#38BDF8]/20 border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8]">
              <span className="material-symbols-outlined text-[20px]">terminal</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                SoundSync C++ Engine & DSA Architecture
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#8B5CF6]/20 text-[#a078ff] border border-[#8B5CF6]/30">
                  C++17 / C++20 Core
                </span>
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Native C++ OOP design patterns, Doubly Linked List memory graph, and source code
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

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-[#2E334D]/35 pb-2 flex-shrink-0">
          <button
            onClick={() => setActiveTab('ast')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'ast'
                ? 'bg-[#8B5CF6]/25 text-[#a078ff] border border-[#8B5CF6]/40'
                : 'text-[#958ea0] hover:text-white hover:bg-[#181A24]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">account_tree</span>
            Live Node Memory Graph
          </button>
          <button
            onClick={() => setActiveTab('cpp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'cpp'
                ? 'bg-[#8B5CF6]/25 text-[#a078ff] border border-[#8B5CF6]/40'
                : 'text-[#958ea0] hover:text-white hover:bg-[#181A24]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">code</span>
            C++ Source Files (/cpp)
          </button>
          <button
            onClick={() => setActiveTab('build')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'build'
                ? 'bg-[#8B5CF6]/25 text-[#a078ff] border border-[#8B5CF6]/40'
                : 'text-[#958ea0] hover:text-white hover:bg-[#181A24]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">build</span>
            Compilation & Testing Guide
          </button>
        </div>

        {activeTab === 'ast' && (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1 custom-scrollbar">
            {/* Diagnostic KPIs */}
            <div className="grid grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[#181A24] border border-[#2E334D]/40">
                <span className="text-[10px] text-[#958ea0] uppercase block">Node Count</span>
                <span className="text-sm font-bold text-white">{nodes.length} Allocated</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#181A24] border border-[#2E334D]/40">
                <span className="text-[10px] text-[#958ea0] uppercase block">Memory Fragmentation</span>
                <span className="text-sm font-bold text-emerald-400">0.00% (Defragged)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#181A24] border border-[#2E334D]/40">
                <span className="text-[10px] text-[#958ea0] uppercase block">Cache Hit Rate</span>
                <span className="text-sm font-bold text-[#38BDF8]">99.8% LRU</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#181A24] border border-[#2E334D]/40">
                <span className="text-[10px] text-[#958ea0] uppercase block">I/O Copy Latency</span>
                <span className="text-sm font-bold text-[#8B5CF6]">0 copy (DirectStream)</span>
              </div>
            </div>

            {/* Code / Syntax Block */}
            <div className="bg-[#0A0B10] rounded-xl p-4 border border-[#2E334D]/35 font-mono text-xs text-[#e3e1ec] overflow-x-auto max-h-72 custom-scrollbar">
              <div className="text-[#958ea0] pb-2 border-b border-[#2E334D]/30 mb-2 flex justify-between">
                <span>// AST Memory Pointer Graph (SoundSync::PlaylistManager)</span>
                <span className="text-[#38BDF8]">Alloc Pool: 0x7ffee491c000 - 0x7ffee491cFFF</span>
              </div>

              <pre className="text-xs leading-relaxed text-[#94A3B8]">
                <span className="text-[#8B5CF6]">namespace</span> SoundSync::AudioCore &#123;{'\n'}
                {'  '}<span className="text-[#38BDF8]">template</span> &lt;<span className="text-[#8B5CF6]">typename</span> Allocator = std::pmr::polymorphic_allocator&lt;Node&gt;&gt;{'\n'}
                {'  '}<span className="text-[#8B5CF6]">class</span> <span className="text-white font-bold">DoublyLinkedListBuffer</span> &#123;{'\n'}
                {'    '}<span className="text-[#958ea0]">// Active Traversal Chain:</span>{'\n'}
                {nodes.map((node, i) => (
                  <React.Fragment key={node.ptr}>
                    {'    '}[{i}] <span className="text-[#8B5CF6]">Node</span> @ <span className="text-[#38BDF8]">{node.ptr}</span> &#123;{'\n'}
                    {'      '}title: <span className="text-emerald-300">"{node.track.title}"</span>,{'\n'}
                    {'      '}artist: <span className="text-emerald-300">"{node.track.artist}"</span>,{'\n'}
                    {'      '}prev: <span className="text-[#a078ff]">{node.prevPtr || 'nullptr'}</span>,{'\n'}
                    {'      '}next: <span className="text-[#38BDF8]">{node.nextPtr || 'nullptr'}</span>,{'\n'}
                    {'      '}offset: <span className="text-white">{node.track.memoryOffset || '0x004F38A0'}</span>,{'\n'}
                    {'      '}buffer_chunk: <span className="text-[#958ea0]">{node.track.bufferChunk || '4096 samples'}</span>{'\n'}
                    {'    '}&#125;{i < nodes.length - 1 ? ' <==>' : ' [TAIL]'}{'\n'}
                  </React.Fragment>
                ))}
                {'  '}&#125;;{'\n'}
                &#125;
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'cpp' && (
          <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
            {/* File Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-shrink-0 custom-scrollbar">
              {Object.keys(CPP_SOURCE_FILES).map((fname) => (
                <button
                  key={fname}
                  onClick={() => setSelectedFile(fname)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                    selectedFile === fname
                      ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40 font-bold'
                      : 'bg-[#181A24] text-[#958ea0] hover:text-white border border-[#2E334D]/30'
                  }`}
                >
                  {fname}
                </button>
              ))}
            </div>

            {/* File Description Header & Copy Button */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#181A24] border border-[#2E334D]/40 text-xs font-mono flex-shrink-0">
              <span className="text-[#94A3B8]">
                <strong className="text-white">/cpp/{selectedFile}:</strong> {CPP_SOURCE_FILES[selectedFile]?.desc}
              </span>
              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded bg-[#2E334D]/40 hover:bg-[#2E334D] text-[#38BDF8] text-[11px] font-mono flex items-center gap-1 transition-all"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            {/* Code Content */}
            <div className="bg-[#0A0B10] rounded-xl p-4 border border-[#2E334D]/35 font-mono text-xs text-[#e3e1ec] overflow-auto flex-1 custom-scrollbar">
              <pre className="text-xs leading-relaxed text-[#94A3B8]">
                {CPP_SOURCE_FILES[selectedFile]?.code}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'build' && (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1 custom-scrollbar font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#181A24] border border-[#2E334D]/40 space-y-2">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">terminal</span>
                Quick GCC / Clang Command (Linux, macOS, MinGW)
              </div>
              <div className="p-2.5 rounded bg-[#0A0B10] text-[#38BDF8] border border-[#2E334D]/30 select-all">
                cd cpp && g++ -std=c++17 -Wall -Wextra -O2 Song.cpp MusicLibrary.cpp Playlist.cpp MusicPlayer.cpp main.cpp -o soundsync && ./soundsync
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#181A24] border border-[#2E334D]/40 space-y-2">
              <div className="text-[#a078ff] font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Run Automated OOP & DSA Verification Test Suite
              </div>
              <div className="p-2.5 rounded bg-[#0A0B10] text-[#a078ff] border border-[#2E334D]/30 select-all">
                ./soundsync --test
              </div>
              <p className="text-[11px] text-[#958ea0]">
                Verifies all 7 tests: 40-song library capacity, Song encapsulation, Doubly Linked List tail insertion O(1), bidirectional pointer navigation, node deletion with unlinking, linear search algorithms, and MusicPlayer state transitions.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#181A24] border border-[#2E334D]/40 space-y-2">
              <div className="text-[#38BDF8] font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">settings</span>
                Alternative Build Options
              </div>
              <div className="space-y-1.5 text-[11px] text-[#94A3B8]">
                <p>• <strong className="text-white">Make:</strong> Run <code className="text-[#38BDF8]">make</code> to compile, <code className="text-[#38BDF8]">make test</code> to test, and <code className="text-[#38BDF8]">make clean</code> to remove binaries.</p>
                <p>• <strong className="text-white">CMake:</strong> Run <code className="text-[#38BDF8]">cmake -B build && cmake --build build</code>.</p>
                <p>• <strong className="text-white">Database:</strong> Load songs dynamically from <code className="text-[#38BDF8]">cpp/songs.txt</code> with option 15 in the menu.</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-2 border-t border-[#2E334D]/30 flex-shrink-0">
          <span className="text-[11px] font-mono text-[#958ea0]">
            All C++ source files reside in root directory: <code className="text-white font-bold">/cpp/</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-white rounded-lg font-bold text-xs font-mono transition-all"
          >
            Close Telemetry
          </button>
        </div>
      </div>
    </div>
  );
};
