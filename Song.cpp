#include "Song.h"
#include <iomanip>

// Default constructor initializing default values
Song::Song() : id(0), title("Unknown"), artist("Unknown"), album("Unknown"), filePath(""), duration("0:00") {}

// Parameterized constructor
Song::Song(int songId, const std::string& songTitle, const std::string& artistName,
           const std::string& albumName, const std::string& path, const std::string& songDuration)
    : id(songId), title(songTitle), artist(artistName), album(albumName), filePath(path), duration(songDuration) {}

// Getters
int Song::getId() const {
    return id;
}

std::string Song::getTitle() const {
    return title;
}

std::string Song::getArtist() const {
    return artist;
}

std::string Song::getAlbum() const {
    return album;
}

std::string Song::getFilePath() const {
    return filePath;
}

std::string Song::getDuration() const {
    return duration;
}

// Display function formatted for neat tabular output
void Song::display() const {
    std::cout << "[" << std::setw(2) << std::setfill('0') << id << "] "
              << std::setfill(' ')
              << std::left << std::setw(25) << title
              << std::setw(20) << artist
              << std::setw(22) << album
              << std::right << std::setw(6) << duration
              << "  (" << filePath << ")\n";
}
