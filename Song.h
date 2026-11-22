#ifndef SONG_H
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
    // Default constructor
    Song();

    // Parameterized constructor
    Song(int songId, const std::string& songTitle, const std::string& artistName,
         const std::string& albumName, const std::string& path, const std::string& songDuration);

    // Getters
    int getId() const;
    std::string getTitle() const;
    std::string getArtist() const;
    std::string getAlbum() const;
    std::string getFilePath() const;
    std::string getDuration() const;

    // Display function to neatly print song details
    void display() const;
};

#endif // SONG_H
