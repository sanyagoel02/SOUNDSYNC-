#ifndef MUSICLIBRARY_H
#define MUSICLIBRARY_H

#include "Song.h"
#include <vector>
#include <string>

/**
 * @class MusicLibrary
 * @brief Manages the collection of all available songs in SoundSync.
 * 
 * OOP Concept: Composition
 * MusicLibrary "has-a" collection of Song objects stored dynamically.
 * 
 * DSA Concept: Dynamic Array / Vector
 * Uses std::vector<Song> for dynamic storage with contiguous memory and O(1) random access.
 * Implements Linear Search (O(n)) for title and artist queries.
 */
class MusicLibrary {
private:
    std::vector<Song> songs; // Dynamic array holding all library songs

    // Helper function for case-insensitive string matching
    static bool containsIgnoreCase(const std::string& source, const std::string& query);

public:
    // Constructor
    MusicLibrary();

    // Core library operations
    void addSong(const Song& song);
    void displayAllSongs() const;

    // Search operations (DSA: Linear Search)
    void searchByTitle(const std::string& query) const;
    void searchByArtist(const std::string& query) const;

    // Lookup song by ID
    bool getSongById(int id, Song& outSong) const;

    // File handling
    bool loadFromFile(const std::string& filename);

    // Seed default sample catalog consistent with SoundSync web app
    void loadDefaultCatalog();

    // Capacity getters
    int getTotalSongs() const;
    bool isEmpty() const;
};

#endif // MUSICLIBRARY_H
