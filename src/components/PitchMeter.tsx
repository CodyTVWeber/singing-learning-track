import React from 'react';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme/theme';
import { centsOff as calcCentsOff, midiNoteToName, frequencyToMidiNote } from '../services/pitch';

interface PitchMeterProps {
  targetHz?: number;
  currentHz: number | null;
  confidence?: number; // 0..1
  className?: string;
  style?: React.CSSProperties;
}

export const PitchMeter: React.FC<PitchMeterProps> = ({ targetHz, currentHz, confidence = 0, className = '', style }) => {
  const cents = currentHz && targetHz ? calcCentsOff(currentHz, targetHz) : null;
  const displayNote = targetHz ? midiNoteToName(frequencyToMidiNote(targetHz)) : undefined;
  const clampedCents = cents === null ? 0 : Math.max(-100, Math.min(100, cents));
  const percent = (clampedCents + 100) / 200; // 0..1 maps -100..+100
  const barColor = cents === null ? colors.featherLight : Math.abs(cents) < 25 ? colors.success : Math.abs(cents) < 50 ? colors.warning : colors.error;

  return (
    <div className={className} style={{ backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
        <div style={{ fontSize: fontSize.sm, color: colors.textLight }}>Target{displayNote ? `: ${displayNote}` : ''}{targetHz ? ` (${Math.round(targetHz)} Hz)` : ''}</div>
        <div style={{ fontSize: fontSize.sm, color: colors.textLight }}>Conf: {(confidence * 100) | 0}%</div>
      </div>

      <div style={{ position: 'relative', height: 10, backgroundColor: colors.background, borderRadius: borderRadius.round }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${percent * 100}%`,
            backgroundColor: barColor,
            borderRadius: borderRadius.round,
            transition: 'width 120ms ease-out, background-color 120ms ease-out',
          }}
        />
        {/* Center marker */}
        <div style={{ position: 'absolute', left: '50%', top: -4, width: 2, bottom: -4, backgroundColor: colors.earthTone, opacity: 0.4 }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: spacing.xs, fontSize: fontSize.xs, color: colors.textLight }}>
        <span>-100¢</span>
        <span>0¢</span>
        <span>+100¢</span>
      </div>

      <div style={{ marginTop: spacing.sm, textAlign: 'center', fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.darkBrown }}>
        {currentHz ? `${Math.round(currentHz)} Hz${cents !== null ? ` (${cents > 0 ? '+' : ''}${Math.round(cents)}¢)` : ''}` : '—'}
      </div>
    </div>
  );
};

