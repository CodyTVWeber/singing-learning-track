import 'package:flutter/material.dart';
import '../audio/pitch.dart';
import '../theme/app_theme.dart';

/// Friendly tuner showing "Pitch (how high/low)" over "Moments in your sound".
class TunerWidget extends StatefulWidget {
  final Stream<PitchHint> pitchStream;
  final double targetHz;
  final int maxPoints;

  const TunerWidget({
    super.key,
    required this.pitchStream,
    required this.targetHz,
    this.maxPoints = 60,
  });

  @override
  State<TunerWidget> createState() => _TunerWidgetState();
}

class _TunerWidgetState extends State<TunerWidget> {
  final List<PitchHint> _points = <PitchHint>[];

  @override
  void initState() {
    super.initState();
    widget.pitchStream.listen((p) {
      setState(() {
        _points.add(p);
        if (_points.length > widget.maxPoints) {
          _points.removeAt(0);
        }
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
                'Aim for ~${widget.targetHz.toStringAsFixed(0)} Hz',
                style: const TextStyle(color: AppTheme.primary),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        SizedBox(
          height: 160,
          child: CustomPaint(
            painter: _TunerPainter(_points, widget.targetHz),
            size: const Size(double.infinity, double.infinity),
          ),
        ),
        const SizedBox(height: 6),
        const Text('Moments in your sound →', style: TextStyle(color: AppTheme.textLight)),
      ],
    );
  }
}

class _TunerPainter extends CustomPainter {
  final List<PitchHint> points;
  final double targetHz;

  _TunerPainter(this.points, this.targetHz);

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

    final minHz = 80.0;
    final maxHz = 500.0;
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
    final targetY = _mapHzToY(targetHz, minHz, maxHz, size.height, padding: 10);
    canvas.drawLine(
      Offset(10, targetY),
      Offset(size.width - 10, targetY),
      targetPaint,
    );

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
    return oldDelegate.points != points || oldDelegate.targetHz != targetHz;
  }
}

