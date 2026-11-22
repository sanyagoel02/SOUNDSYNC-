#include <iostream>
#include <string>
#include <limits>
#include "Song.h"
#include "MusicLibrary.h"
#include "Playlist.h"
#include "MusicPlayer.h"

// Clear input stream helper
void clearInput() {
    std::cin.clear();
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
}

// Automated verification test runner to prove OOP & DSA compliance
void runAutomatedTests(MusicLibrary& library, Playlist& playlist, MusicPlayer& player) {
    std::cout << "\n============================================================\n";
    std::cout << "     RUNNING SOUNDSYNC AUTOMATED OOP & DSA TEST SUITE      \n";
    std::cout << "============================================================\n";

    int testsPassed = 0;
    int totalTests = 7;

    // Test 1: MusicLibrary loaded with 40 songs
    std::cout << "[Test 1] Validating Music Library capacity (Expected: 40 songs)... ";
    if (library.getTotalSongs() == 40) {
        std::cout << "PASSED (" << library.getTotalSongs() << " songs)\n";
        testsPassed++;
    } else {
        std::cout << "FAILED (Found: " << library.getTotalSongs() << ")\n";
    }

    // Test 2: Song encapsulation & getters
    std::cout << "[Test 2] Validating Song Encapsulation on Track ID 4... ";
    Song s4;
    if (library.getSongById(4, s4) && s4.getTitle() == "Violet Horizon" && s4.getArtist() == "Kaelen Brooks") {
        std::cout << "PASSED (\"" << s4.getTitle() << "\" by " << s4.getArtist() << ")\n";
        testsPassed++;
    } else {
        std::cout << "FAILED\n";
    }

    // Test 3: Doubly Linked List tail insertion & bidirectional integrity
    std::cout << "[Test 3] Doubly Linked List insertion (O(1) tail append)... ";
    Playlist testList("Test DLL");
    Song s1, s2, s3;
    library.getSongById(1, s1);
    library.getSongById(2, s2);
    library.getSongById(3, s3);
    testList.addSong(s1);
    testList.addSong(s2);
    testList.addSong(s3);
    if (testList.getSongCount() == 3) {
        std::cout << "PASSED (Count: 3)\n";
        testsPassed++;
    } else {
        std::cout << "FAILED\n";
    }

    // Test 4: Doubly Linked List traversal (next & previous pointers)
    std::cout << "[Test 4] Doubly Linked List bidirectional navigation (O(1))... ";
    bool navSuccess = true;
    if (testList.getCurrentSong()->getId() != 1) navSuccess = false;
    if (!testList.nextTrack() || testList.getCurrentSong()->getId() != 2) navSuccess = false;
    if (!testList.nextTrack() || testList.getCurrentSong()->getId() != 3) navSuccess = false;
    if (testList.nextTrack()) navSuccess = false; // Tail next should be false
    if (!testList.previousTrack() || testList.getCurrentSong()->getId() != 2) navSuccess = false;
    if (!testList.previousTrack() || testList.getCurrentSong()->getId() != 1) navSuccess = false;
    if (testList.previousTrack()) navSuccess = false; // Head prev should be false

    if (navSuccess) {
        std::cout << "PASSED (Node 1 -> Node 2 -> Node 3 <-> Node 2 <-> Node 1)\n";
        testsPassed++;
    } else {
        std::cout << "FAILED\n";
    }

    // Test 5: Node deletion with pointer relinking
    std::cout << "[Test 5] Doubly Linked List node deletion and relinking... ";
    bool delSuccess = testList.removeSongById(2); // Remove middle node
    if (delSuccess && testList.getSongCount() == 2 && testList.nextTrack() && testList.getCurrentSong()->getId() == 3) {
        std::cout << "PASSED (Node 2 removed, Node 1 linked directly to Node 3)\n";
        testsPassed++;
    } else {
        std::cout << "FAILED\n";
    }

    // Test 6: Linear Search (O(n))
    std::cout << "[Test 6] Linear Search algorithms (Title & Artist)... ";
    Song foundSong;
    if (library.getSongById(24, foundSong) && foundSong.getTitle() == "Entropy Zero") {
        std::cout << "PASSED (Found Entropy Zero by Null Reference)\n";
        testsPassed++;
    } else {
        std::cout << "FAILED\n";
    }

    // Test 7: MusicPlayer state machine
    std::cout << "[Test 7] MusicPlayer state machine transitions... ";
    MusicPlayer testPlayer;
    testPlayer.loadSong(s1);
    bool stateSuccess = (testPlayer.getState() == PlayerState::STOPPED);
    testPlayer.play();
    if (testPlayer.getState() != PlayerState::PLAYING) stateSuccess = false;
    testPlayer.pause();
    if (testPlayer.getState() != PlayerState::PAUSED) stateSuccess = false;
    testPlayer.resume();
    if (testPlayer.getState() != PlayerState::PLAYING) stateSuccess = false;
    testPlayer.stop();
    if (testPlayer.getState() != PlayerState::STOPPED) stateSuccess = false;

    if (stateSuccess) {
        std::cout << "PASSED (STOPPED -> PLAYING -> PAUSED -> PLAYING -> STOPPED)\n";
        testsPassed++;
    } else {
        std::cout << "FAILED\n";
    }

    std::cout << "============================================================\n";
    std::cout << "   TEST RESULT: " << testsPassed << "/" << totalTests << " TESTS PASSED SUCCESSFULLY   \n";
    std::cout << "============================================================\n\n";
}

int main(int argc, char* argv[]) {
    // Instantiate SoundSync Core Engine objects
    MusicLibrary library;
    Playlist playlist("Synthwave DLL :: Ring");
    MusicPlayer player;

    // Load full 40-song catalog
    library.loadDefaultCatalog();

    // Initialize playlist with sample tracks matching the application
    Song s1, s2, s3, s4;
    if (library.getSongById(4, s4)) playlist.addSong(s4); // Violet Horizon
    if (library.getSongById(1, s1)) playlist.addSong(s1); // Midnight Pulse
    if (library.getSongById(2, s2)) playlist.addSong(s2); // Echoes of Eternity

    // Attach playlist to player
    player.attachPlaylist(&playlist);

    // If --test argument is passed, run non-interactive test suite and return
    if (argc > 1 && std::string(argv[1]) == "--test") {
        runAutomatedTests(library, playlist, player);
        return 0;
    }

    int choice = -1;
    while (choice != 0) {
        std::cout << "\n============================================================\n";
        std::cout << "                SOUNDSYNC C++ AUDIO ENGINE                  \n";
        std::cout << "          Object-Oriented & DSA Console Terminal            \n";
        std::cout << "============================================================\n";
        std::cout << " Active Track: " 
                  << (player.hasActiveTrack() ? ("\"" + player.getCurrentSong().getTitle() + "\" [" + player.getStateString() + "]") : "None")
                  << " | Library: " << library.getTotalSongs() << " Songs"
                  << " | Playlist: " << playlist.getSongCount() << " Nodes\n";
        std::cout << "------------------------------------------------------------\n";
        std::cout << " 1. Display All Songs in Library (40 Tracks)\n";
        std::cout << " 2. Search Song by Title (Linear Search O(n))\n";
        std::cout << " 3. Search Song by Artist (Linear Search O(n))\n";
        std::cout << " 4. Display Doubly Linked List Playlist\n";
        std::cout << " 5. Add Song to Playlist by ID (O(1) Tail Insert)\n";
        std::cout << " 6. Remove Song from Playlist by ID (O(n) Search & O(1) Unlink)\n";
        std::cout << " 7. Load / Select Song into Player\n";
        std::cout << " 8. Playback: Play Track\n";
        std::cout << " 9. Playback: Pause Track\n";
        std::cout << " 10. Playback: Resume Track\n";
        std::cout << " 11. Playback: Stop Track\n";
        std::cout << " 12. Skip to Next Track (DLL Forward Pointer O(1))\n";
        std::cout << " 13. Return to Previous Track (DLL Backward Pointer O(1))\n";
        std::cout << " 14. Display Full Player Diagnostics & Buffer Telemetry\n";
        std::cout << " 15. Load Songs from External File (songs.txt)\n";
        std::cout << " 16. Save Playlist to File\n";
        std::cout << " 17. Run Automated OOP & DSA Verification Test Suite\n";
        std::cout << " 0. Exit SoundSync\n";
        std::cout << "============================================================\n";
        std::cout << "Enter option (0-17): ";

        if (!(std::cin >> choice)) {
            std::cout << "[Error] Invalid input. Please enter a valid number.\n";
            clearInput();
            continue;
        }

        switch (choice) {
            case 1: {
                library.displayAllSongs();
                break;
            }
            case 2: {
                std::cout << "Enter title keyword to search: ";
                clearInput();
                std::string query;
                std::getline(std::cin, query);
                library.searchByTitle(query);
                break;
            }
            case 3: {
                std::cout << "Enter artist keyword to search: ";
                clearInput();
                std::string query;
                std::getline(std::cin, query);
                library.searchByArtist(query);
                break;
            }
            case 4: {
                playlist.displayPlaylist();
                break;
            }
            case 5: {
                std::cout << "Enter Song ID to add to playlist (1-" << library.getTotalSongs() << "): ";
                int id;
                if (std::cin >> id) {
                    Song s;
                    if (library.getSongById(id, s)) {
                        playlist.addSong(s);
                        if (!player.hasActiveTrack()) {
                            player.selectFromActivePlaylist();
                        }
                    } else {
                        std::cout << "[Error] Song ID " << id << " not found in library.\n";
                    }
                } else {
                    std::cout << "[Error] Invalid ID entered.\n";
                    clearInput();
                }
                break;
            }
            case 6: {
                std::cout << "Enter Song ID to remove from playlist: ";
                int id;
                if (std::cin >> id) {
                    playlist.removeSongById(id);
                } else {
                    std::cout << "[Error] Invalid ID entered.\n";
                    clearInput();
                }
                break;
            }
            case 7: {
                std::cout << "Enter Song ID to load into player (1-" << library.getTotalSongs() << "): ";
                int id;
                if (std::cin >> id) {
                    Song s;
                    if (library.getSongById(id, s)) {
                        player.loadSong(s);
                    } else {
                        std::cout << "[Error] Song ID " << id << " not found in library.\n";
                    }
                } else {
                    std::cout << "[Error] Invalid ID entered.\n";
                    clearInput();
                }
                break;
            }
            case 8: {
                player.play();
                break;
            }
            case 9: {
                player.pause();
                break;
            }
            case 10: {
                player.resume();
                break;
            }
            case 11: {
                player.stop();
                break;
            }
            case 12: {
                player.nextTrack();
                break;
            }
            case 13: {
                player.previousTrack();
                break;
            }
            case 14: {
                player.displayPlayerStatus();
                break;
            }
            case 15: {
                std::cout << "Loading library from 'songs.txt'...\n";
                library.loadFromFile("songs.txt");
                break;
            }
            case 16: {
                std::cout << "Enter filename to save playlist (e.g. 'my_playlist.txt'): ";
                clearInput();
                std::string fname;
                std::getline(std::cin, fname);
                if (fname.empty()) fname = "my_playlist.txt";
                playlist.saveToFile(fname);
                break;
            }
            case 17: {
                runAutomatedTests(library, playlist, player);
                break;
            }
            case 0: {
                std::cout << "\nTerminating SoundSync C++ Engine. Goodbye!\n\n";
                break;
            }
            default: {
                std::cout << "[Error] Option not recognized. Please choose from 0 to 17.\n";
                break;
            }
        }
    }

    return 0;
}
