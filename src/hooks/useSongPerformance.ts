import { useCallback, useEffect, useRef, useState } from 'react';
import { resolveAudioId } from '../services/audioMap';
import { detectPitchAutocorrelation } from '../services/pitch';
import {
  centsOff,
  frequencyToMidiNote,
  midiNoteToFrequency,
  midiNoteToName,
} from '../services/pitch';
import {
  expectedMidiAt,
  scoreSong,
} from '../services/songScoring';
import type {
  NoteRating,
  PitchSample,
  SongChart,
  SongScore,
} from '../models/songChart';

export type SongPerformanceStatus = 'idle' | 'countdown' | 'singing' | 'finished' | 'error';

export interface UseSongPerformanceResult {
  status: SongPerformanceStatus;
  countdown: number;
  currentTimeMs: number;
  samples: PitchSample[];
  liveHz: number | null;
  liveConfidence: number;
  liveCents: number | null;
  liveRating: NoteRating | null;
  score: SongScore | null;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
  reset: () => void;
}

function liveRatingFromCents(cents: number | null): NoteRating | null {
  if (cents == null) return null;
  const abs = Math.abs(cents);
  if (abs <= 25) return 'perfect';
  if (abs <= 50) return 'good';
  if (abs <= 100) return 'okay';
  return 'miss';
}

export function useSongPerformance(chart: SongChart): UseSongPerformanceResult {
  const [status, setStatus] = useState<SongPerformanceStatus>('idle');
  const [countdown, setCountdown] = useState(3);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [samples, setSamples] = useState<PitchSample[]>([]);
  const [liveHz, setLiveHz] = useState<number | null>(null);
  const [liveConfidence, setLiveConfidence] = useState(0);
  const [liveCents, setLiveCents] = useState<number | null>(null);
  const [liveRating, setLiveRating] = useState<NoteRating | null>(null);
  const [score, setScore] = useState<SongScore | null>(null);
  const [error, setError] = useState<string | null>(null);

  const chartRef = useRef(chart);
  chartRef.current = chart;

  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const countdownTimerRef = useRef<number | null>(null);
  const performanceStartRef = useRef(0);
  const samplesRef = useRef<PitchSample[]>([]);
  const statusRef = useRef(status);
  statusRef.current = status;

  const cleanup = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (countdownTimerRef.current != null) {
      window.clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  const finishPerformance = useCallback(() => {
    if (statusRef.current === 'finished') return;
    cleanup();
    const result = scoreSong(chartRef.current, samplesRef.current);
    setScore(result);
    setStatus('finished');
    statusRef.current = 'finished';
  }, [cleanup]);

  const tick = useCallback(() => {
    const activeChart = chartRef.current;
    const audio = audioRef.current;
    let clock = 0;

    if (audio && !audio.paused && !audio.ended) {
      clock = audio.currentTime * 1000;
    } else {
      clock = performance.now() - performanceStartRef.current;
    }

    setCurrentTimeMs(clock);

    const analyser = analyserRef.current;
    const ctx = audioContextRef.current;
    if (analyser && ctx) {
      const buffer = new Float32Array(analyser.fftSize);
      try {
        analyser.getFloatTimeDomainData(buffer);
      } catch {
        const byteBuffer = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(byteBuffer);
        for (let i = 0; i < byteBuffer.length; i += 1) {
          buffer[i] = (byteBuffer[i] - 128) / 128;
        }
      }

      const { frequencyHz, confidence } = detectPitchAutocorrelation(buffer, ctx.sampleRate);
      const sample: PitchSample = { timeMs: clock, frequencyHz, confidence };
      samplesRef.current = [...samplesRef.current, sample];
      setSamples(samplesRef.current);
      setLiveHz(frequencyHz);
      setLiveConfidence(confidence);

      const expectedMidi = expectedMidiAt(activeChart, clock);
      if (frequencyHz != null && confidence >= 0.25 && expectedMidi != null) {
        const sungMidi = frequencyToMidiNote(frequencyHz);
        const targetRef = expectedMidi + 12 * Math.round((sungMidi - expectedMidi) / 12);
        const targetHz = midiNoteToFrequency(targetRef);
        const cents = centsOff(frequencyHz, targetHz);
        setLiveCents(cents);
        setLiveRating(liveRatingFromCents(cents));
      } else {
        setLiveCents(null);
        setLiveRating(null);
      }
    }

    const endMs = activeChart.durationMs + 200;
    if (clock >= endMs || (audio && audio.ended)) {
      finishPerformance();
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [finishPerformance]);

  const beginSinging = useCallback(async () => {
    performanceStartRef.current = performance.now();
    samplesRef.current = [];
    setSamples([]);
    setCurrentTimeMs(0);
    setScore(null);
    setStatus('singing');
    statusRef.current = 'singing';

    const resolved = chartRef.current.audioUrl
      ? { type: 'file' as const, src: chartRef.current.audioUrl }
      : resolveAudioId(chartRef.current.audioId);

    if (resolved?.type === 'file') {
      const audio = new Audio(resolved.src);
      audio.volume = 0.35;
      audioRef.current = audio;
      audio.addEventListener('error', () => {
        audioRef.current = null;
      });
      try {
        await audio.play();
      } catch {
        audioRef.current = null;
      }
    }

    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const start = useCallback(async () => {
    setError(null);
    cleanup();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) {
        throw new Error('Web Audio is not supported in this browser.');
      }

      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      setCountdown(3);
      setStatus('countdown');
      statusRef.current = 'countdown';

      let remaining = 3;
      countdownTimerRef.current = window.setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          if (countdownTimerRef.current != null) {
            window.clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
          }
          void beginSinging();
        } else {
          setCountdown(remaining);
        }
      }, 1000);
    } catch {
      cleanup();
      setError('Microphone access is required. Please allow mic permission and try again.');
      setStatus('error');
      statusRef.current = 'error';
    }
  }, [beginSinging, cleanup]);

  const stop = useCallback(() => {
    finishPerformance();
  }, [finishPerformance]);

  const reset = useCallback(() => {
    cleanup();
    samplesRef.current = [];
    setSamples([]);
    setCurrentTimeMs(0);
    setLiveHz(null);
    setLiveConfidence(0);
    setLiveCents(null);
    setLiveRating(null);
    setScore(null);
    setError(null);
    setCountdown(3);
    setStatus('idle');
    statusRef.current = 'idle';
  }, [cleanup]);

  useEffect(() => () => cleanup(), [cleanup]);

  return {
    status,
    countdown,
    currentTimeMs,
    samples,
    liveHz,
    liveConfidence,
    liveCents,
    liveRating,
    score,
    error,
    start,
    stop,
    reset,
  };
}

export { midiNoteToName };
