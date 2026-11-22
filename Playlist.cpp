#include "Playlist.h"
#include <iostream>
#include <fstream>
#include <iomanip>

// Constructor
Playlist::Playlist(const std::string& playlistName)
    : name(playlistName), head(nullptr), tail(nullptr), current(nullptr), songCount(0) {}

// Destructor: Frees all allocated linked list nodes to prevent memory leaks
Playlist::~Playlist() {
    clear();
}

// Clear all nodes (O(n) memory cleanup)
void Playlist::clear() {
    PlaylistNode* temp = head;
    while (temp != nullptr) {
        PlaylistNode* nextNode = temp->next;
        delete temp;
        temp = nextNode;
    }
    head = nullptr;
    tail = nullptr;
    current = nullptr;
    songCount = 0;
}

// Deep copy constructor
Playlist::Playlist(const Playlist& other)
    : name(other.name), head(nullptr), tail(nullptr), current(nullptr), songCount(0) {
    PlaylistNode* temp = other.head;
    while (temp != nullptr) {
        addSong(temp->song);
        temp = temp->next;
    }
}

// Deep copy assignment operator
Playlist& Playlist::operator=(const Playlist& other) {
    if (this != &other) {
        clear();
        name = other.name;
        PlaylistNode* temp = other.head;
        while (temp != nullptr) {
            addSong(temp->song);
            temp = temp->next;
        }
    }
    return *this;
}

// Add song to tail of Doubly Linked List (DSA: O(1) Time Complexity)
void Playlist::addSong(const Song& song) {
    PlaylistNode* newNode = new PlaylistNode(song);

    if (head == nullptr) {
        // First node in the list
        head = newNode;
        tail = newNode;
        current = newNode; // Automatically point to first track
    } else {
        // Attach to tail and relink bidirectional pointers
        tail->next = newNode;
        newNode->prev = tail;
        tail = newNode;
    }
    songCount++;
    std::cout << "[Playlist] Added: \"" << song.getTitle() << "\" to " << name << ".\n";
}

// Remove song by ID (DSA: O(n) search, O(1) pointer unlinking)
bool Playlist::removeSongById(int songId) {
    if (head == nullptr) {
        std::cout << "[Playlist] Cannot remove: Playlist is empty.\n";
        return false;
    }

    PlaylistNode* temp = head;
    while (temp != nullptr && temp->song.getId() != songId) {
        temp = temp->next;
    }

    // Song not found
    if (temp == nullptr) {
        std::cout << "[Playlist] Song with ID " << songId << " was not found in playlist.\n";
        return false;
    }

    // Unlinking logic:
    if (temp == head && temp == tail) {
        // Only one element in list
        head = nullptr;
        tail = nullptr;
        current = nullptr;
    } else if (temp == head) {
        // Removing head element
        head = head->next;
        head->prev = nullptr;
        if (current == temp) current = head;
    } else if (temp == tail) {
        // Removing tail element
        tail = tail->prev;
        tail->next = nullptr;
        if (current == temp) current = tail;
    } else {
        // Removing middle element: connect neighbor nodes
        temp->prev->next = temp->next;
        temp->next->prev = temp->prev;
        if (current == temp) current = temp->next;
    }

    std::cout << "[Playlist] Removed: \"" << temp->song.getTitle() << "\" from playlist.\n";
    delete temp;
    songCount--;
    return true;
}

// Display playlist contents via forward traversal (DSA: O(n))
void Playlist::displayPlaylist() const {
    if (head == nullptr) {
        std::cout << "\n[Playlist: " << name << "] is currently empty (0 songs).\n";
        return;
    }

    std::cout << "\n========================================================================================\n";
    std::cout << "                 PLAYLIST: " << name << " (Doubly Linked List)                 \n";
    std::cout << "========================================================================================\n";
    std::cout << "Status  ID   Title                    Artist               Duration  Pointers (Prev <-> Next)\n";
    std::cout << "----------------------------------------------------------------------------------------\n";

    PlaylistNode* temp = head;
    int index = 1;
    while (temp != nullptr) {
        // Highlight active playhead node
        std::string status = (temp == current) ? ">> ACTIVE" : "   ";

        std::cout << std::left << std::setw(8) << status
                  << "[" << std::setw(2) << std::setfill('0') << temp->song.getId() << "] "
                  << std::setfill(' ')
                  << std::setw(25) << temp->song.getTitle()
                  << std::setw(21) << temp->song.getArtist()
                  << std::setw(10) << temp->song.getDuration()
                  << " [";

        if (temp->prev == nullptr) {
            std::cout << "nullptr";
        } else {
            std::cout << "ID:" << temp->prev->song.getId();
        }

        std::cout << " <--> ";

        if (temp->next == nullptr) {
            std::cout << "nullptr";
        } else {
            std::cout << "ID:" << temp->next->song.getId();
        }
        std::cout << "]\n";

        temp = temp->next;
        index++;
    }
    std::cout << "----------------------------------------------------------------------------------------\n";
    std::cout << "Total Queued Nodes: " << songCount << "\n\n";
}

// Move playhead to next track (DSA: O(1) pointer jump)
bool Playlist::nextTrack() {
    if (current == nullptr || current->next == nullptr) {
        return false;
    }
    current = current->next;
    return true;
}

// Move playhead to previous track (DSA: O(1) pointer jump)
bool Playlist::previousTrack() {
    if (current == nullptr || current->prev == nullptr) {
        return false;
    }
    current = current->prev;
    return true;
}

// Select a specific song in the playlist as current playhead
bool Playlist::setCurrentSong(int songId) {
    PlaylistNode* temp = head;
    while (temp != nullptr) {
        if (temp->song.getId() == songId) {
            current = temp;
            return true;
        }
        temp = temp->next;
    }
    return false;
}

// Return currently selected song pointer
Song* Playlist::getCurrentSong() {
    if (current != nullptr) {
        return &(current->song);
    }
    return nullptr;
}

std::string Playlist::getName() const {
    return name;
}

int Playlist::getSongCount() const {
    return songCount;
}

bool Playlist::isEmpty() const {
    return head == nullptr;
}

// File I/O: Save current playlist sequence to text file
bool Playlist::saveToFile(const std::string& filename) const {
    std::ofstream outFile(filename);
    if (!outFile.is_open()) {
        std::cerr << "[Error] Could not save playlist to file: " << filename << "\n";
        return false;
    }

    outFile << "# SoundSync Playlist: " << name << "\n";
    outFile << "# Format: ID|Title|Artist|Album|Path|Duration\n";

    PlaylistNode* temp = head;
    while (temp != nullptr) {
        outFile << temp->song.getId() << "|"
                << temp->song.getTitle() << "|"
                << temp->song.getArtist() << "|"
                << temp->song.getAlbum() << "|"
                << temp->song.getFilePath() << "|"
                << temp->song.getDuration() << "\n";
        temp = temp->next;
    }

    outFile.close();
    std::cout << "[File IO] Playlist saved successfully to: " << filename << "\n";
    return true;
}
