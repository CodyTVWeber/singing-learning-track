import 'dart:async';

/// Minimal player stub. In a later iteration, connect to an actual audio backend.
class AudioPlayerAdapter {
  bool _isPlaying = false;

  bool get isPlaying => _isPlaying;

  Future<void> play(String path) async {
    if (path.isEmpty) {
      throw ArgumentError('Invalid path');
    }
    _isPlaying = true;
    // Immediate no-op for tests to avoid pending timers
    return;
  }

  Future<void> stop() async {
    if (_isPlaying) {
      _isPlaying = false;
    }
  }
}

