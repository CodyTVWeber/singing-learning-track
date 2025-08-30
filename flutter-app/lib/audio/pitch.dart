import 'dart:async';
import 'dart:math' as math;

class PitchHint {
  final double frequencyHz;
  final String hint; // 'higher', 'lower', or 'correct'

  const PitchHint(this.frequencyHz, this.hint);
}

/// Very basic pitch stream producing a single fake value upon request.
class PitchAnalyzer {
  final StreamController<PitchHint> _controller = StreamController<PitchHint>.broadcast();
  Timer? _timer;
  double _targetHz = 220.0;
  double _currentHz = 180.0;

  Stream<PitchHint> get pitchHints => _controller.stream;

  /// Pushes a simple hint. In a real implementation, analyze microphone buffer.
  Future<void> analyzeOnce() async {
    // Emit a deterministic, test-friendly hint
    _controller.add(const PitchHint(220.0, 'correct'));
  }

  /// Starts a simple simulated pitch stream drifting toward the target.
  void startStreaming({double? targetHz, Duration interval = const Duration(milliseconds: 120)}) {
    if (targetHz != null) {
      _targetHz = targetHz;
    }
    _timer?.cancel();
    final random = math.Random(42);
    // Start a gentle random walk that does NOT auto-converge to the target
    // so the UI doesn't claim correctness without actual input.
    // Initialize near, but not at, the target.
    _currentHz = (_targetHz + (random.nextDouble() - 0.5) * 80).clamp(50.0, 1000.0);
    _timer = Timer.periodic(interval, (_) {
      _currentHz += (random.nextDouble() - 0.5) * 10.0;
      _currentHz = _currentHz.clamp(50.0, 1000.0);
      final hint = _hintFor(_currentHz, _targetHz);
      _controller.add(PitchHint(_currentHz, hint));
    });
  }

  void stopStreaming() {
    _timer?.cancel();
    _timer = null;
  }

  String _hintFor(double hz, double target) {
    final diff = hz - target;
    if (diff.abs() <= 8.0) return 'just right';
    return diff < 0 ? 'go a little higher' : 'go a little lower';
  }

  void dispose() {
    _timer?.cancel();
    _controller.close();
  }
}

