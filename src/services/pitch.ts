export interface PitchAnalysisResult {
  frequencyHz: number | null;
  confidence: number; // 0..1
}

// Note mapping utilities
const A4 = 440;
const SEMITONE = 69; // MIDI note number of A4

export function frequencyToMidiNote(frequencyHz: number): number {
  return 69 + 12 * Math.log2(frequencyHz / A4);
}

export function midiNoteToFrequency(midi: number): number {
  return A4 * Math.pow(2, (midi - SEMITONE) / 12);
}

export function centsOff(frequencyHz: number, targetHz: number): number {
  return 1200 * Math.log2(frequencyHz / targetHz);
}

export function midiNoteToName(midi: number): string {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const pitchClass = ((Math.round(midi) % 12) + 12) % 12;
  const octave = Math.floor(Math.round(midi) / 12) - 1;
  return `${names[pitchClass]}${octave}`;
}

/**
 * Autocorrelation pitch detector (time-domain).
 * Returns primary frequency with a simple confidence metric.
 */
export function detectPitchAutocorrelation(timeDomain: Float32Array, sampleRate: number): PitchAnalysisResult {
  const input = timeDomain;
  const size = input.length;
  // Normalize to [-1,1]
  const mean = input.reduce((acc, v) => acc + v, 0) / size;
  const normalized = new Float32Array(size);
  for (let i = 0; i < size; i++) normalized[i] = input[i] - mean;

  let bestOffset = -1;
  let bestCorrelation = 0;
  let rms = 0;
  for (let i = 0; i < size; i++) rms += normalized[i] * normalized[i];
  rms = Math.sqrt(rms / size);
  if (rms < 0.01) {
    return { frequencyHz: null, confidence: 0 };
  }

  const MIN_FREQUENCY = 70; // Hz
  const MAX_FREQUENCY = 1000; // Hz
  const minLag = Math.floor(sampleRate / MAX_FREQUENCY);
  const maxLag = Math.floor(sampleRate / MIN_FREQUENCY);

  let lastCorrelation = 1;
  let found = false;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let correlation = 0;
    for (let i = 0; i < size - lag; i++) {
      correlation += normalized[i] * normalized[i + lag];
    }
    correlation /= size;
    if (correlation > 0.9 && correlation > lastCorrelation) {
      found = true;
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestOffset = lag;
      }
    } else if (found) {
      // past peak
      break;
    }
    lastCorrelation = correlation;
  }

  if (bestOffset === -1) {
    return { frequencyHz: null, confidence: 0 };
  }

  const frequency = sampleRate / bestOffset;
  const confidence = Math.max(0, Math.min(1, (bestCorrelation - 0.8) / 0.2));
  return { frequencyHz: frequency, confidence };
}

