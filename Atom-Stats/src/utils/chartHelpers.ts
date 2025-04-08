export interface ChartDataPoint {
  date: string;
  value: number;
  category?: string;
}

export const aggregateData = (
  data: ChartDataPoint[],
  interval: 'day' | 'week' | 'month'
): ChartDataPoint[] => {
  const grouped = new Map<string, number>();

  data.forEach((point) => {
    const date = new Date(point.date);
    let key: string;

    switch (interval) {
      case 'week':
        key = getWeekKey(date);
        break;
      case 'month':
        key = getMonthKey(date);
        break;
      default:
        key = getDayKey(date);
    }

    grouped.set(key, (grouped.get(key) || 0) + point.value);
  });

  return Array.from(grouped.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const getDayKey = (date: Date): string => date.toISOString().split('T')[0];

const getWeekKey = (date: Date): string => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return getDayKey(d);
};

const getMonthKey = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

export const calculateGrowthRate = (
  current: number,
  previous: number
): number => {
  if (previous === 0) return 100;
  return ((current - previous) / previous) * 100;
};
