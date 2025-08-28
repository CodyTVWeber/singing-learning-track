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

