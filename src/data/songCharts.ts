import type { SongChart } from '../models/songChart';
import { twinkleChart } from './charts/twinkle';
import { happyBirthdayChart } from './charts/happy-birthday';

export const bundledSongCharts: SongChart[] = [twinkleChart, happyBirthdayChart];

const chartsById = new Map(bundledSongCharts.map((chart) => [chart.id, chart]));

const audioIdToChartId: Record<string, string> = {
  'twinkle-bright-tone': 'twinkle',
  'happy-birthday-simple': 'happy-birthday',
};

export function getSongChartById(id: string): SongChart | undefined {
  return chartsById.get(id);
}

export function chartFromAudioId(audioId: string): SongChart | undefined {
  const chartId = audioIdToChartId[audioId];
  return chartId ? chartsById.get(chartId) : undefined;
}
