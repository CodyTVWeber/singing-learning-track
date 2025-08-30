export type ResolvedAudio =
  | { type: 'file'; src: string }
  | { type: 'sequence'; sequence: Array<{ frequency: number; durationMs: number; gapMs?: number }>; volume?: number }
  | { type: 'glide'; fromHz: number; toHz: number; durationMs: number; volume?: number };

/**
 * Minimal tone generator built on Web Audio API.
 * Designed for short, gentle reference tones and simple sequences.
 */
export class ToneGenerator {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private oscillator: OscillatorNode | null = null;
  private isPlaying = false;
  private sequenceAbortController: AbortController | null = null;

  async ensureContext(): Promise<AudioContext> {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      return this.audioContext;
    }
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
    this.audioContext = new Ctx();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0.18; // gentle default volume
    this.gainNode.connect(this.audioContext.destination);
    return this.audioContext;
  }

  async playFrequency(frequencyHz: number, durationMs: number, volume?: number): Promise<void> {
    const ctx = await this.ensureContext();
    this.stop();

    const oscillator = ctx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequencyHz;
    const gain = this.gainNode ?? ctx.createGain();
    if (typeof volume === 'number') {
      gain.gain.value = Math.max(0, Math.min(1, volume));
    }
    oscillator.connect(gain);
    oscillator.start();
    this.oscillator = oscillator;
    this.isPlaying = true;

    await new Promise<void>(resolve => setTimeout(resolve, durationMs));
    this.stop();
  }

  async playGlide(fromHz: number, toHz: number, durationMs: number, volume?: number): Promise<void> {
    const ctx = await this.ensureContext();
    this.stop();

    const oscillator = ctx.createOscillator();
    oscillator.type = 'sine';
    const gain = this.gainNode ?? ctx.createGain();
    if (typeof volume === 'number') {
      gain.gain.value = Math.max(0, Math.min(1, volume));
    }
    oscillator.connect(gain);
    oscillator.frequency.setValueAtTime(fromHz, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(toHz, ctx.currentTime + durationMs / 1000);
    oscillator.start();
    this.oscillator = oscillator;
    this.isPlaying = true;

    await new Promise<void>(resolve => setTimeout(resolve, durationMs));
    this.stop();
  }

  async playSequence(
    steps: Array<{ frequency: number; durationMs: number; gapMs?: number }>,
    volume?: number,
  ): Promise<void> {
    const ctx = await this.ensureContext();
    this.stop();
    this.sequenceAbortController = new AbortController();
    const { signal } = this.sequenceAbortController;

    for (const step of steps) {
      if (signal.aborted) break;
      const oscillator = ctx.createOscillator();
      oscillator.type = 'sine';
      const gain = this.gainNode ?? ctx.createGain();
      if (typeof volume === 'number') {
        gain.gain.value = Math.max(0, Math.min(1, volume));
      }
      oscillator.connect(gain);
      oscillator.frequency.value = step.frequency;
      oscillator.start();
      this.oscillator = oscillator;
      this.isPlaying = true;

      await new Promise<void>((resolve) => setTimeout(resolve, step.durationMs));
      oscillator.stop();
      oscillator.disconnect();
      this.isPlaying = false;

      if (signal.aborted) break;
      const gap = step.gapMs ?? 0;
      if (gap > 0) {
        await new Promise<void>((resolve) => setTimeout(resolve, gap));
      }
    }
    this.sequenceAbortController = null;
  }

  stop(): void {
    if (this.sequenceAbortController) {
      this.sequenceAbortController.abort();
      this.sequenceAbortController = null;
    }
    try {
      if (this.oscillator && this.isPlaying) {
        this.oscillator.stop();
      }
    } catch {
      // ignore
    }
    if (this.oscillator) {
      try { this.oscillator.disconnect(); } catch { /* noop */ }
    }
    this.oscillator = null;
    this.isPlaying = false;
  }

  close(): void {
    this.stop();
    if (this.audioContext) {
      try { this.audioContext.close(); } catch { /* noop */ }
    }
    this.audioContext = null;
    this.gainNode = null;
  }
}

export const sharedToneGenerator = new ToneGenerator();

