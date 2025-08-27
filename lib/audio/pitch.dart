import 'dart:async';

class PitchHint {
  final double frequencyHz;
  final String hint; // 'higher', 'lower', or 'correct'

  const PitchHint(this.frequencyHz, this.hint);
}

/// Very basic pitch stream producing a single fake value upon request.
class PitchAnalyzer {
  final StreamController<PitchHint> _controller = StreamController<PitchHint>.broadcast();

  Stream<PitchHint> get pitchHints => _controller.stream;

  /// Pushes a simple hint. In a real implementation, analyze microphone buffer.
  Future<void> analyzeOnce() async {
    // Emit a deterministic, test-friendly hint
    _controller.add(const PitchHint(220.0, 'correct'));
  }

  void dispose() {
    _controller.close();
  }
}

