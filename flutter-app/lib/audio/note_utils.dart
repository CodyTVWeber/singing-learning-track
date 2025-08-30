import 'dart:math' as math;

class NoteUtils {
  // A4 = 440Hz, MIDI 69
  static double noteToFrequency(String noteName) {
    final midi = _noteNameToMidi(noteName);
    return midiToFrequency(midi);
  }

  static double midiToFrequency(int midi) {
    return 440.0 * math.pow(2.0, (midi - 69) / 12.0).toDouble();
  }

  static double frequencyToCents(double frequency, double target) {
    if (frequency <= 0 || target <= 0) return 0;
    return 1200.0 * (math.log(frequency / target) / math.log(2));
  }

  static ({String note, int midi, double freq}) nearestNoteForFrequency(double frequency) {
    if (frequency <= 0) return (note: '—', midi: -1, freq: 0);
    final midi = (69 + 12 * (math.log(frequency / 440.0) / math.log(2))).round();
    final snappedFreq = midiToFrequency(midi);
    final name = midiToNoteName(midi);
    return (note: name, midi: midi, freq: snappedFreq);
  }

  static double frequencyToMidi(double frequency) {
    if (frequency <= 0) return 0;
    return 69 + 12 * (math.log(frequency / 440.0) / math.log(2));
  }

  static String midiToNoteName(int midi) {
    if (midi < 0) return '—';
    const names = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
    final name = names[midi % 12];
    final octave = (midi ~/ 12) - 1;
    return '$name$octave';
  }

  static int _noteNameToMidi(String note) {
    // Accept forms like C4, C#4, Db4, A4, etc.
    final regex = RegExp(r'^([A-Ga-g])([#b]?)(-?\d+)$');
    final m = regex.firstMatch(note.trim());
    if (m == null) throw ArgumentError('Invalid note name: $note');
    final letter = m.group(1)!.toUpperCase();
    final acc = m.group(2) ?? '';
    final octave = int.parse(m.group(3)!);
    final semitoneBase = {
      'C': 0,
      'D': 2,
      'E': 4,
      'F': 5,
      'G': 7,
      'A': 9,
      'B': 11,
    }[letter]!;
    int semitone = semitoneBase;
    if (acc == '#') semitone += 1;
    if (acc == 'b') semitone -= 1;
    final midi = (octave + 1) * 12 + semitone; // MIDI mapping C-1 => 0
    return midi;
  }
}

