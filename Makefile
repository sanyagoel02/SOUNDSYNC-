# SoundSync C++ Audio Workstation Makefile
# Compiler and flags
CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -O2

# Target executable name
TARGET = soundsync

# Source and object files
SRCS = Song.cpp MusicLibrary.cpp Playlist.cpp MusicPlayer.cpp main.cpp
OBJS = $(SRCS:.cpp=.o)

# Default target
all: $(TARGET)

# Link object files into final executable
$(TARGET): $(OBJS)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(OBJS)
	@echo "Build successful! Run with: ./$(TARGET) or ./$(TARGET) --test"

# Compile source files into object files
%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

# Run automated tests
test: $(TARGET)
	./$(TARGET) --test

# Clean build artifacts
clean:
	rm -f $(OBJS) $(TARGET) my_playlist.txt

.PHONY: all test clean
