#include "MusicLibrary.h"
#include <iostream>
#include <fstream>
#include <sstream>
#include <algorithm>
#include <cctype>

MusicLibrary::MusicLibrary() {
    // Vector starts empty; caller can load catalog or load from file
}

// Case-insensitive substring matching helper
bool MusicLibrary::containsIgnoreCase(const std::string& source, const std::string& query) {
    if (query.empty()) return true;
    std::string srcLower = source;
    std::string qLower = query;
    std::transform(srcLower.begin(), srcLower.end(), srcLower.begin(), [](unsigned char c) { return std::tolower(c); });
    std::transform(qLower.begin(), qLower.end(), qLower.begin(), [](unsigned char c) { return std::tolower(c); });
    return srcLower.find(qLower) != std::string::npos;
}

// Add a song to the library (DSA: O(1) amortized insertion in vector)
void MusicLibrary::addSong(const Song& song) {
    songs.push_back(song);
}

// Display all songs in a clean tabular view
void MusicLibrary::displayAllSongs() const {
    if (songs.empty()) {
        std::cout << "\n[Notice] Music Library is currently empty.\n";
        return;
    }

    std::cout << "\n========================================================================================\n";
    std::cout << "                                SOUNDSYNC MUSIC LIBRARY                                 \n";
    std::cout << "========================================================================================\n";
    std::cout << "ID   Title                    Artist               Album                 Duration  File Path\n";
    std::cout << "----------------------------------------------------------------------------------------\n";
    for (const auto& song : songs) {
        song.display();
    }
    std::cout << "----------------------------------------------------------------------------------------\n";
    std::cout << "Total Songs Available: " << songs.size() << "\n\n";
}

// Search by Title using Linear Search (DSA: O(n) Time Complexity)
void MusicLibrary::searchByTitle(const std::string& query) const {
    std::cout << "\n[Search by Title: \"" << query << "\"]\n";
    bool found = false;
    for (const auto& song : songs) {
        if (containsIgnoreCase(song.getTitle(), query)) {
            if (!found) {
                std::cout << "----------------------------------------------------------------------------------------\n";
                found = true;
            }
            song.display();
        }
    }
    if (!found) {
        std::cout << "No songs found matching title: \"" << query << "\"\n";
    } else {
        std::cout << "----------------------------------------------------------------------------------------\n";
    }
}

// Search by Artist using Linear Search (DSA: O(n) Time Complexity)
void MusicLibrary::searchByArtist(const std::string& query) const {
    std::cout << "\n[Search by Artist: \"" << query << "\"]\n";
    bool found = false;
    for (const auto& song : songs) {
        if (containsIgnoreCase(song.getArtist(), query)) {
            if (!found) {
                std::cout << "----------------------------------------------------------------------------------------\n";
                found = true;
            }
            song.display();
        }
    }
    if (!found) {
        std::cout << "No songs found matching artist: \"" << query << "\"\n";
    } else {
        std::cout << "----------------------------------------------------------------------------------------\n";
    }
}

// Find song by ID (DSA: Linear search O(n))
bool MusicLibrary::getSongById(int id, Song& outSong) const {
    for (const auto& song : songs) {
        if (song.getId() == id) {
            outSong = song;
            return true;
        }
    }
    return false;
}

// File I/O: Load songs from text file (delimited by pipe '|')
bool MusicLibrary::loadFromFile(const std::string& filename) {
    std::ifstream inFile(filename);
    if (!inFile.is_open()) {
        std::cerr << "[Warning] Unable to open file: " << filename << ". Using default catalog instead.\n";
        return false;
    }

    std::string line;
    int loadedCount = 0;
    while (std::getline(inFile, line)) {
        if (line.empty() || line[0] == '#') continue; // Skip comments and empty lines

        std::stringstream ss(line);
        std::string idStr, title, artist, album, path, duration;

        if (std::getline(ss, idStr, '|') &&
            std::getline(ss, title, '|') &&
            std::getline(ss, artist, '|') &&
            std::getline(ss, album, '|') &&
            std::getline(ss, path, '|') &&
            std::getline(ss, duration)) {
            try {
                int id = std::stoi(idStr);
                addSong(Song(id, title, artist, album, path, duration));
                loadedCount++;
            } catch (...) {
                // Ignore malformed id line gracefully
            }
        }
    }
    inFile.close();
    std::cout << "[File IO] Successfully loaded " << loadedCount << " songs from " << filename << ".\n";
    return loadedCount > 0;
}

// Populate sample library matching the SoundSync application tracks
void MusicLibrary::loadDefaultCatalog() {
    songs.clear();
    addSong(Song(1, "Midnight Pulse", "Neon Eclipse", "Cyber City OST", "/assets/audio/midnight_pulse.flac", "3:42"));
    addSong(Song(2, "Echoes of Eternity", "Sarah Jenkins", "Celestial Drift", "/assets/audio/echoes_of_eternity.wav", "4:15"));
    addSong(Song(3, "Binary Sunset", "CodeWave", "Algorithmic Beats", "/assets/audio/binary_sunset.flac", "2:58"));
    addSong(Song(4, "Violet Horizon", "Kaelen Brooks", "Velvet Skylines", "/assets/audio/violet_horizon.wav", "3:51"));
    addSong(Song(5, "Quantum Resonance", "The DSA Collective", "Binary Dreams", "/assets/audio/quantum_resonance.flac", "4:08"));
    addSong(Song(6, "Electric Rain", "Lofi Automaton", "Chill Circuits", "/assets/audio/electric_rain.wav", "3:15"));
    addSong(Song(7, "Starlight Mirage", "Astraea", "Nebula Odyssey", "/assets/audio/starlight_mirage.flac", "4:45"));
    addSong(Song(8, "Deep Wave Memory", "SubZero Sound", "Low Latency", "/assets/audio/deep_wave_memory.wav", "5:12"));
    addSong(Song(9, "Neon Boulevard", "Synthetica", "Retro Future", "/assets/audio/neon_boulevard.flac", "3:30"));
    addSong(Song(10, "Whispers in the Dark", "Elena Rostova", "Nocturne Suite", "/assets/audio/whispers_in_the_dark.wav", "4:22"));
    addSong(Song(11, "Recursive Loop", "DevTrack", "Stack Overflow", "/assets/audio/recursive_loop.flac", "3:04"));
    addSong(Song(12, "Aether Drift", "Solar Flare", "Cosmic Dust", "/assets/audio/aether_drift.flac", "3:48"));
    addSong(Song(13, "Chasing Shadows", "The Night Owls", "Midnight Chronicles", "/assets/audio/chasing_shadows.wav", "4:01"));
    addSong(Song(14, "Silicon Harmony", "ZeroPointer", "Memory Allocated", "/assets/audio/silicon_harmony.flac", "3:36"));
    addSong(Song(15, "Velvet Echo", "Maya Lin", "Acoustic Reverie", "/assets/audio/velvet_echo.wav", "3:24"));
    addSong(Song(16, "Hyperdrive", "TurboFlux", "Warp Velocity", "/assets/audio/hyperdrive.flac", "2:49"));
    addSong(Song(17, "Golden Hour Reverie", "Julian Vance", "Sunset Mirage", "/assets/audio/golden_hour.wav", "4:18"));
    addSong(Song(18, "Glitch in the Matrix", "CyberCore", "System Halt", "/assets/audio/glitch_matrix.flac", "3:11"));
    addSong(Song(19, "Ocean of Glass", "Pacific Wave", "Deep Tides", "/assets/audio/ocean_of_glass.wav", "4:32"));
    addSong(Song(20, "Prism of Light", "Chromatic", "Spectrum", "/assets/audio/prism_of_light.flac", "3:55"));
    addSong(Song(21, "Northern Aurora", "Arctic Bloom", "Polar Night", "/assets/audio/northern_aurora.wav", "4:50"));
    addSong(Song(22, "Analog Dreams", "Tape Deck Heroes", "Vintage Soul", "/assets/audio/analog_dreams.flac", "3:18"));
    addSong(Song(23, "Pulse of the City", "Urban Groove", "Metro Rhythm", "/assets/audio/pulse_of_city.wav", "3:40"));
    addSong(Song(24, "Entropy Zero", "Null Reference", "Garbage Collector", "/assets/audio/entropy_zero.flac", "4:12"));
    addSong(Song(25, "Final Cadence", "Symphony of Bytes", "Graduation Opus", "/assets/audio/final_cadence.wav", "5:05"));
    addSong(Song(26, "Sunset Boulevard", "Chloe Martin", "Golden Skies", "/assets/audio/sunset_boulevard.flac", "3:28"));
    addSong(Song(27, "Streets of Tokyo", "Kenji Takahashi", "Neon Alley", "/assets/audio/streets_of_tokyo.wav", "3:14"));
    addSong(Song(28, "Lost in Your Eyes", "Marcus Rivera", "Heartstrings", "/assets/audio/lost_in_your_eyes.flac", "4:06"));
    addSong(Song(29, "Summer Breeze", "The Coastal Collective", "Laguna Sessions", "/assets/audio/summer_breeze.wav", "3:38"));
    addSong(Song(30, "Bassline Odyssey", "DJ Volt", "Club Resonance", "/assets/audio/bassline_odyssey.flac", "4:15"));
    addSong(Song(31, "Blue Note Serenade", "Miles Quartet", "Late Night Velvet", "/assets/audio/blue_note_serenade.flac", "5:20"));
    addSong(Song(32, "Thunderstruck Horizon", "Blackout Valley", "High Voltage", "/assets/audio/thunderstruck_horizon.wav", "3:45"));
    addSong(Song(33, "After Hours Groove", "Savannah Cruz", "Midnight Velvet", "/assets/audio/after_hours_groove.flac", "3:58"));
    addSong(Song(34, "Sunrise Festival", "Apex Mirage", "Tomorrowland Anthem", "/assets/audio/sunrise_festival.flac", "3:50"));
    addSong(Song(35, "Moonlight Sonata in D", "Clara Fontaine", "Ivory Reflections", "/assets/audio/moonlight_sonata.flac", "4:40"));
    addSong(Song(36, "Coffee & Raindrops", "Oliver Finch", "Warm Sweater", "/assets/audio/coffee_and_raindrops.wav", "3:22"));
    addSong(Song(37, "Fiesta Caliente", "Rio Syndicate", "Carnaval Del Sol", "/assets/audio/fiesta_caliente.flac", "3:34"));
    addSong(Song(38, "Midnight Serenade", "Seraphina Fox", "Crimson Velvet", "/assets/audio/midnight_serenade.flac", "3:36"));
    addSong(Song(39, "Neon Velocity", "Kavinsky Sound", "Autobahn Noir", "/assets/audio/neon_velocity.flac", "3:48"));
    addSong(Song(40, "Clair de Lune Variations", "Julian Moreau", "Parisian Moonlight", "/assets/audio/clair_de_lune_variations.flac", "4:18"));
}

int MusicLibrary::getTotalSongs() const {
    return static_cast<int>(songs.size());
}

bool MusicLibrary::isEmpty() const {
    return songs.empty();
}
