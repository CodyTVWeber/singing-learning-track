import 'package:flutter/material.dart';
import '../audio/pitch.dart';
import '../audio/note_utils.dart';
import '../theme/app_theme.dart';

/// Friendly tuner showing "Pitch (how high/low)" over "Moments in your sound".
class TunerWidget extends StatefulWidget {
  final Stream<PitchHint> pitchStream;
  final int maxPoints;
  final int lowMidi;   // inclusive range
  final int highMidi;  // inclusive range

  const TunerWidget({
    super.key,
    required this.pitchStream,
    this.maxPoints = 60,
    this.lowMidi = 48,   // C3 default low
    this.highMidi = 72,  // C5 default high
  });

  @override
  State<TunerWidget> createState() => _TunerWidgetState();
}

class _TunerWidgetState extends State<TunerWidget> {
  final List<PitchHint> _points = <PitchHint>[];
  double _guideHz = 220.0;
  String _guideNote = 'A3';

  @override
  void initState() {
    super.initState();
    widget.pitchStream.listen((p) {
      setState(() {
        _points.add(p);
        if (_points.length > widget.maxPoints) {
          _points.removeAt(0);
        }
        final nearest = NoteUtils.nearestNoteForFrequency(p.frequencyHz);
        _guideHz = nearest.freq;
        _guideNote = nearest.note;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Text(
              'Pitch (how high/low)',
              style: TextStyle(fontWeight: FontWeight.w600),
            ),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: AppTheme.primary.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                'You\'re around $_guideNote (~${_guideHz.toStringAsFixed(0)} Hz)',
                style: const TextStyle(color: AppTheme.primary),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Expanded(
          child: Column(
            children: [
              Expanded(
                child: CustomPaint(
                  painter: _TunerPainter(
                    points: _points,
                    guideHz: _guideHz,
                    lowMidi: widget.lowMidi,
                    highMidi: widget.highMidi,
                  ),
                  size: const Size(double.infinity, double.infinity),
                ),
              ),
              const SizedBox(height: 6),
              const Text('Moments in your sound →', style: TextStyle(color: AppTheme.textLight)),
            ],
          ),
        ),
      ],
    );
  }
}

class _TunerPainter extends CustomPainter {
  final List<PitchHint> points;
  final double guideHz;
  final int lowMidi;
  final int highMidi;

  _TunerPainter({
    required this.points,
    required this.guideHz,
    required this.lowMidi,
    required this.highMidi,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final bg = Paint()
      ..color = AppTheme.surface
      ..style = PaintingStyle.fill;
    canvas.drawRRect(
      RRect.fromRectAndRadius(Offset.zero & size, const Radius.circular(12)),
      bg,
    );

    final border = Paint()
      ..color = AppTheme.featherLight
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;
    canvas.drawRRect(
      RRect.fromRectAndRadius(Offset.zero & size, const Radius.circular(12)),
      border,
    );

    if (points.isEmpty) return;

    final minHz = NoteUtils.midiToFrequency(lowMidi);
    final maxHz = NoteUtils.midiToFrequency(highMidi);
    final plot = Paint()
      ..color = AppTheme.secondary
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round;

    final targetPaint = Paint()
      ..color = AppTheme.primary.withValues(alpha: 0.4)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5
      ..strokeCap = StrokeCap.square;

    // Target horizontal line
    final targetY = _mapHzToY(guideHz, minHz, maxHz, size.height, padding: 10);
    canvas.drawLine(
      Offset(10, targetY),
      Offset(size.width - 10, targetY),
      targetPaint,
    );

    // Draw equally spaced note lines (chromatic steps) with note labels
    final labelStyle = TextStyle(color: AppTheme.textLight.withValues(alpha: 0.8), fontSize: 10);
    for (int midi = lowMidi; midi <= highMidi; midi++) {
      final hz = NoteUtils.midiToFrequency(midi);
      final y = _mapHzToY(hz, minHz, maxHz, size.height, padding: 10);
      final isOctave = midi % 12 == 0; // C notes
      final gridPaint = Paint()
        ..color = (isOctave ? AppTheme.featherLight : AppTheme.featherLight.withValues(alpha: 0.6))
        ..style = PaintingStyle.stroke
        ..strokeWidth = isOctave ? 1.5 : 1.0;
      canvas.drawLine(Offset(10, y), Offset(size.width - 10, y), gridPaint);

      // Label the grid with note names on the left for octaves and every few steps
      if (isOctave || midi % 2 == 0) {
        final tp = TextPainter(
          text: TextSpan(text: NoteUtils.midiToNoteName(midi), style: labelStyle),
          textDirection: TextDirection.ltr,
        )..layout();
        tp.paint(canvas, Offset(12, y - tp.height - 1));
      }
    }

    // Current-note marker (last point) for clarity on the grand scale
    if (points.isNotEmpty) {
      final last = points.last;
      final y = _mapHzToY(last.frequencyHz, minHz, maxHz, size.height, padding: 10);
      final markerPaint = Paint()
        ..color = AppTheme.secondary
        ..style = PaintingStyle.fill;
      canvas.drawCircle(Offset(size.width - 16, y), 5, markerPaint);
    }

    // Wave path of pitch points
    final dx = (size.width - 20) / (points.length - 1).clamp(1, 1000);
    final path = Path();
    for (int i = 0; i < points.length; i++) {
      final x = 10 + dx * i;
      final y = _mapHzToY(points[i].frequencyHz, minHz, maxHz, size.height, padding: 10);
      if (i == 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }
    canvas.drawPath(path, plot);
  }

  double _mapHzToY(double hz, double min, double max, double h, {double padding = 0}) {
    final clamped = hz.clamp(min, max);
    final t = (clamped - min) / (max - min);
    return padding + (1 - t) * (h - padding * 2);
  }

  @override
  bool shouldRepaint(covariant _TunerPainter oldDelegate) {
    return oldDelegate.points != points ||
        oldDelegate.guideHz != guideHz ||
        oldDelegate.lowMidi != lowMidi ||
        oldDelegate.highMidi != highMidi;
  }
}

