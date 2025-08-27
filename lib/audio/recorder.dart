import 'dart:async';

/// Simple in-memory mock recorder for tests and initial MVP.
/// Returns a fake file path after stop, suitable for driving UI logic.
class AudioRecorder {
  bool _isRecording = false;
  DateTime? _recordingStart;

  bool get isRecording => _isRecording;

  Future<void> startRecording() async {
    if (_isRecording) return;
    _isRecording = true;
    _recordingStart = DateTime.now();
  }

  /// Returns a fake path once recording stops
  Future<String> stopRecording() async {
    if (!_isRecording) {
      throw StateError('Not recording');
    }
    _isRecording = false;
    final durationMs = DateTime.now().difference(_recordingStart!).inMilliseconds;
    // Simulate a stored file using a memory path; UI only needs non-empty
    return '/memory/audio_${durationMs}.wav';
  }
}

