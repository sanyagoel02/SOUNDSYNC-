#ifndef PLAYLIST_H
#define PLAYLIST_H

#include "Song.h"
#include <string>

/**
 * @struct PlaylistNode
 * @brief Node element of the Doubly Linked List.
 * 
 * DSA Concept: Doubly Linked List Node
 * Contains data (Song) and two bidirectional pointers:
 * - prev: points to the preceding song in the playlist (or nullptr if head)
 * - next: points to the succeeding song in the playlist (or nullptr if tail)
 */
struct PlaylistNode {
    Song song;
    PlaylistNode* prev;
    PlaylistNode* next;

    // Node constructor
    PlaylistNode(const Song& s) : song(s), prev(nullptr), next(nullptr) {}
};

/**
 * @class Playlist
 * @brief Manages custom user playlists using a custom Doubly Linked List data structure.
 * 
 * OOP Concepts:
 * - Encapsulation: Node pointers and internal count are private.
 * - Resource Management (RAII): Destructor automatically deallocates all dynamic nodes.
 * 
 * DSA Concepts:
 * - Doubly Linked List (DLL):
 *   - O(1) Tail Insertion: Instant addition to the end of the playlist.
 *   - O(1) Bidirectional Navigation: Move to next or previous song in O(1) time.
 *   - O(n) Search & O(1) Unlinking for deletion: Efficient pointer-based removal.
 */
class Playlist {
private:
    std::string name;          // Name of the playlist
    PlaylistNode* head;        // Pointer to the first song in the playlist
    PlaylistNode* tail;        // Pointer to the last song in the playlist
    PlaylistNode* current;     // Pointer to the currently active playhead node
    int songCount;             // Total number of songs in the playlist

    // Helper function to free all dynamically allocated nodes
    void clear();

public:
    // Constructors & Destructor
    Playlist(const std::string& playlistName = "My Playlist");
    ~Playlist();

    // Prevent accidental shallow copies
    Playlist(const Playlist& other);
    Playlist& operator=(const Playlist& other);

    // Doubly Linked List Operations
    void addSong(const Song& song);              // Insert at tail: O(1)
    bool removeSongById(int songId);             // Remove node by ID: O(n) search + O(1) unlink
    void displayPlaylist() const;                // Forward traversal: O(n)

    // Navigation methods (O(1) time complexity)
    bool nextTrack();                            // Move current pointer forward
    bool previousTrack();                        // Move current pointer backward
    bool setCurrentSong(int songId);             // Set active node by song ID
    
    // Getters
    Song* getCurrentSong();                      // Pointer to currently selected song
    std::string getName() const;
    int getSongCount() const;
    bool isEmpty() const;

    // File Persistence
    bool saveToFile(const std::string& filename) const;
};

#endif // PLAYLIST_H
