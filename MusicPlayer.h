#ifndef MUSICPLAYER_H
#define MUSICPLAYER_H

#include "Song.h"
#include "Playlist.h"
#include <string>

/**
 * @enum PlayerState
 * @brief Represents the playback state of the SoundSync engine.
 */
enum class PlayerState {
    STOPPED,
    PLAYING,
    PAUSED
};

/**
 * @class MusicPlayer
 * @brief Implements the audio workstation control logic and state machine.
 * 
 * OOP Concept: Composition & Association
 * - MusicPlayer coordinates a currently selected Song and optionally navigates a Playlist.
 * 
 * IMPORTANT ARCHITECTURAL NOTE:
 * Standard C++ (ISO C++) lacks built-in hardware audio playback in its standard library.
 * In a native production desktop environment, real audio decoding requires an external
 * audio backend such as:
 *   - miniaudio (public domain single-file audio library)
 *   - SDL2 / SDL_mixer (cross-platform multimedia library)
 *   - Windows Multimedia API (<windows.h> mciSendString / PlaySound)
 * 
 * This C++ MusicPlayer class faithfully implements the complete control state machine:
 * track switching, status diagnostics, play/pause/stop toggling, and DLL buffer movement.
 */
class MusicPlayer {
private:
    Song currentSong;           // Currently loaded song
    PlayerState state;          // Current playback state (STOPPED, PLAYING, PAUSED)
    Playlist* activePlaylist;   // Pointer to active playlist (optional association)
    bool hasTrack;              // Flag indicating whether a track is currently loaded

public:
    // Constructor
    MusicPlayer();

    // Association with Playlist
    void attachPlaylist(Playlist* playlist);

    // Track Selection
    void loadSong(const Song& song);
    void selectFromActivePlaylist();

    // Playback Controls
    void play();
    void pause();
    void resume();
    void stop();

    // Navigation Controls (moves across Doubly Linked List)
    void nextTrack();
    void previousTrack();

    // Getters & Status Diagnostics
    PlayerState getState() const;
    std::string getStateString() const;
    Song getCurrentSong() const;
    bool hasActiveTrack() const;
    void displayPlayerStatus() const;
};

#endif // MUSICPLAYER_H
