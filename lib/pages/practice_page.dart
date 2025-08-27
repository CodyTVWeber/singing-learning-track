import 'package:flutter/material.dart';
import 'package:kooka_sing/audio/recorder.dart';
import 'package:kooka_sing/audio/player.dart';
import 'package:kooka_sing/audio/pitch.dart';

class PracticePage extends StatefulWidget {
  const PracticePage({super.key});

  @override
  State<PracticePage> createState() => _PracticePageState();
}

class _PracticePageState extends State<PracticePage> {
  final AudioRecorder _recorder = AudioRecorder();
  final AudioPlayerAdapter _player = AudioPlayerAdapter();
  final PitchAnalyzer _pitch = PitchAnalyzer();

  String? _recordedPath;
  PitchHint? _lastHint;

  @override
  void initState() {
    super.initState();
    _pitch.pitchHints.listen((hint) {
      setState(() {
        _lastHint = hint;
      });
    });
  }

  @override
  void dispose() {
    _pitch.dispose();
    super.dispose();
  }

  Future<void> _onRecordPressed() async {
    await _recorder.startRecording();
    setState(() {});
  }

  Future<void> _onStopPressed() async {
    final path = await _recorder.stopRecording();
    setState(() {
      _recordedPath = path;
    });
    // Produce a basic pitch hint after recording
    await _pitch.analyzeOnce();
  }

  Future<void> _onPlayPressed() async {
    if (_recordedPath == null) return;
    await _player.play(_recordedPath!);
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Practice')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (_lastHint != null)
              Text(
                'Pitch: ${_lastHint!.frequencyHz.toStringAsFixed(1)} Hz (${_lastHint!.hint})',
                key: const Key('pitch-hint'),
              ),
            const SizedBox(height: 24),
            if (!_recorder.isRecording && _recordedPath == null)
              ElevatedButton(
                onPressed: _onRecordPressed,
                child: const Text('Record'),
              ),
            if (_recorder.isRecording)
              ElevatedButton(
                onPressed: _onStopPressed,
                child: const Text('Stop'),
              ),
            if (!_recorder.isRecording && _recordedPath != null)
              Row(
                children: [
                  ElevatedButton(
                    onPressed: _onPlayPressed,
                    child: const Text('Play'),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }
}

