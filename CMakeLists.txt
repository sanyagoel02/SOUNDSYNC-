cmake_minimum_required(VERSION 3.12)
project(SoundSync VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Source files
set(SOURCES
    Song.h
    Song.cpp
    MusicLibrary.h
    MusicLibrary.cpp
    Playlist.h
    Playlist.cpp
    MusicPlayer.h
    MusicPlayer.cpp
    main.cpp
)

# Executable target
add_executable(soundsync ${SOURCES})

# Target properties
set_target_properties(soundsync PROPERTIES
    CXX_STANDARD 17
    CXX_STANDARD_REQUIRED YES
    CXX_EXTENSIONS NO
)

# Enable compiler warnings
if(MSVC)
    target_compile_options(soundsync PRIVATE /W4)
else()
    target_compile_options(soundsync PRIVATE -Wall -Wextra -pedantic)
endif()
