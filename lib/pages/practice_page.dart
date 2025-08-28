import 'package:flutter/material.dart';
import 'package:kooka_sing/audio/recorder.dart';
import 'package:kooka_sing/audio/player.dart';
import 'package:kooka_sing/audio/pitch.dart';
import 'package:kooka_sing/widgets/tuner_widget.dart';
import 'package:kooka_sing/audio/note_utils.dart';

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
  double _targetHz = 220.0;
  bool _isListening = false;
  static const List<String> _noteChoices = <String>[
    'C3','C#3','D3','D#3','E3','F3','F#3','G3','G#3','A3','A#3','B3',
    'C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4',
  ];

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
    // Start streaming pitch feedback
    _isListening = true;
    _pitch.startStreaming(targetHz: _targetHz);
  }

  Future<void> _onStopPressed() async {
    final path = await _recorder.stopRecording();
    setState(() {
      _recordedPath = path;
      _isListening = false;
    });
    // Stop streaming
    _pitch.stopStreaming();
    // Emit one last hint for immediate feedback after stopping
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
            const Text(
              'Sing with Kooka!',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),
            Text(
              'Try to match Kooka\'s note. The line shows your sound over moments. If it\'s above the guide, go a little lower; if it\'s below, go a little higher.',
              style: TextStyle(color: Colors.grey[700]),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Switch(
                  value: _isListening,
                  onChanged: (on) async {
                    if (on && !_recorder.isRecording) {
                      await _onRecordPressed();
                    } else if (!on && _recorder.isRecording) {
                      await _onStopPressed();
                    }
                  },
                ),
                const Text('Listening'),
              ],
            ),
            const SizedBox(height: 16),
            TunerWidget(pitchStream: _pitch.pitchHints, key: const Key('tuner')),
            const SizedBox(height: 12),
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
                  const SizedBox(width: 12),
                  OutlinedButton(
                    onPressed: () {
                      setState(() {
                        _recordedPath = null;
                      });
                    },
                    child: const Text('Try Again'),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }
}

