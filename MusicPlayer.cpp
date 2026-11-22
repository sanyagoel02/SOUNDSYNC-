#include "MusicPlayer.h"
#include <iostream>

// Constructor initializing default stopped state
MusicPlayer::MusicPlayer()
    : state(PlayerState::STOPPED), activePlaylist(nullptr), hasTrack(false) {}

// Connect player to a playlist
void MusicPlayer::attachPlaylist(Playlist* playlist) {
    activePlaylist = playlist;
    if (activePlaylist != nullptr && !activePlaylist->isEmpty()) {
        Song* s = activePlaylist->getCurrentSong();
        if (s != nullptr) {
            loadSong(*s);
        }
    }
}

// Manually load a single song
void MusicPlayer::loadSong(const Song& song) {
    currentSong = song;
    hasTrack = true;
    state = PlayerState::STOPPED;
    std::cout << "\n[Player] Loaded track: \"" << currentSong.getTitle() << "\" by " << currentSong.getArtist() << "\n";
}

// Sync current song from attached playlist
void MusicPlayer::selectFromActivePlaylist() {
    if (activePlaylist == nullptr || activePlaylist->isEmpty()) {
        std::cout << "[Player] No active playlist or playlist is empty.\n";
        return;
    }
    Song* s = activePlaylist->getCurrentSong();
    if (s != nullptr) {
        loadSong(*s);
    }
}

// Play command
void MusicPlayer::play() {
    if (!hasTrack) {
        std::cout << "[Player] Error: No song is currently selected to play. Please select a song first.\n";
        return;
    }

    if (state == PlayerState::PLAYING) {
        std::cout << "[Player] Song \"" << currentSong.getTitle() << "\" is already playing.\n";
        return;
    }

    state = PlayerState::PLAYING;
    std::cout << "\n>>> [PLAYING] Now streaming: \"" << currentSong.getTitle() << "\" by " << currentSong.getArtist() << " <<<\n";
    std::cout << "    Album: " << currentSong.getAlbum() << " | Duration: " << currentSong.getDuration() << "\n";
    std::cout << "    Audio Sink: Local buffer -> [" << currentSong.getFilePath() << "]\n";
}

// Pause command
void MusicPlayer::pause() {
    if (!hasTrack) {
        std::cout << "[Player] Error: No song is loaded.\n";
        return;
    }

    if (state == PlayerState::PAUSED) {
        std::cout << "[Player] Already paused.\n";
        return;
    }

    if (state != PlayerState::PLAYING) {
        std::cout << "[Player] Cannot pause: Song is not playing.\n";
        return;
    }

    state = PlayerState::PAUSED;
    std::cout << "||| [PAUSED] Playhead suspended at current buffer offset: \"" << currentSong.getTitle() << "\"\n";
}

// Resume command
void MusicPlayer::resume() {
    if (state == PlayerState::PAUSED) {
        play();
    } else {
        std::cout << "[Player] Player is not in paused state.\n";
    }
}

// Stop command
void MusicPlayer::stop() {
    if (!hasTrack) {
        std::cout << "[Player] No song loaded.\n";
        return;
    }

    state = PlayerState::STOPPED;
    std::cout << "--- [STOPPED] Playback stopped for: \"" << currentSong.getTitle() << "\". Buffer reset to 0:00.\n";
}

// Move to next track in active playlist (Doubly Linked List next pointer)
void MusicPlayer::nextTrack() {
    if (activePlaylist == nullptr || activePlaylist->isEmpty()) {
        std::cout << "[Player] Cannot skip: No active playlist loaded.\n";
        return;
    }

    if (activePlaylist->nextTrack()) {
        Song* nextSong = activePlaylist->getCurrentSong();
        if (nextSong != nullptr) {
            currentSong = *nextSong;
            hasTrack = true;
            std::cout << "\n[Player] Advanced to next node in Doubly Linked List.\n";
            play();
        }
    } else {
        std::cout << "[Player] Reached end of playlist (Tail pointer -> nullptr). No next song.\n";
    }
}

// Move to previous track in active playlist (Doubly Linked List prev pointer)
void MusicPlayer::previousTrack() {
    if (activePlaylist == nullptr || activePlaylist->isEmpty()) {
        std::cout << "[Player] Cannot skip: No active playlist loaded.\n";
        return;
    }

    if (activePlaylist->previousTrack()) {
        Song* prevSong = activePlaylist->getCurrentSong();
        if (prevSong != nullptr) {
            currentSong = *prevSong;
            hasTrack = true;
            std::cout << "\n[Player] Moved to previous node in Doubly Linked List.\n";
            play();
        }
    } else {
        std::cout << "[Player] At beginning of playlist (Head pointer -> nullptr). No previous song.\n";
    }
}

PlayerState MusicPlayer::getState() const {
    return state;
}

std::string MusicPlayer::getStateString() const {
    switch (state) {
        case PlayerState::PLAYING: return "PLAYING";
        case PlayerState::PAUSED:  return "PAUSED";
        case PlayerState::STOPPED: return "STOPPED";
        default:                   return "UNKNOWN";
    }
}

Song MusicPlayer::getCurrentSong() const {
    return currentSong;
}

bool MusicPlayer::hasActiveTrack() const {
    return hasTrack;
}

// Display player status dashboard
void MusicPlayer::displayPlayerStatus() const {
    std::cout << "\n+-------------------------------------------------------------+\n";
    std::cout << "|                 SOUNDSYNC DOCK PLAYER STATUS                |\n";
    std::cout << "+-------------------------------------------------------------+\n";
    std::cout << "  State:          [" << getStateString() << "]\n";
    if (hasTrack) {
        std::cout << "  Title:          " << currentSong.getTitle() << "\n";
        std::cout << "  Artist:         " << currentSong.getArtist() << "\n";
        std::cout << "  Album:          " << currentSong.getAlbum() << "\n";
        std::cout << "  Duration:       " << currentSong.getDuration() << "\n";
        std::cout << "  Local Pointer:  " << currentSong.getFilePath() << "\n";
    } else {
        std::cout << "  No song currently selected.\n";
    }
    if (activePlaylist != nullptr) {
        std::cout << "  Active DLL:     \"" << activePlaylist->getName() << "\" (" 
                  << activePlaylist->getSongCount() << " tracks)\n";
    } else {
        std::cout << "  Active DLL:     None (Standalone Mode)\n";
    }
    std::cout << "+-------------------------------------------------------------+\n\n";
}
