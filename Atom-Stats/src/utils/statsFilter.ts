export interface FilterOptions {
  dateRange?: [Date, Date];
  minValue?: number;
  maxValue?: number;
  categories?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const filterStats = <T extends Record<string, any>>(
  data: T[],
  options: FilterOptions
): T[] => {
  let filtered = [...data];

  if (options.dateRange) {
    const [start, end] = options.dateRange;
    filtered = filtered.filter((item) => {
      const date = new Date(item.date);
      return date >= start && date <= end;
    });
  }

  if (options.minValue !== undefined) {
    filtered = filtered.filter((item) => item.value >= options.minValue!);
  }

  if (options.maxValue !== undefined) {
    filtered = filtered.filter((item) => item.value <= options.maxValue!);
  }

  if (options.categories?.length) {
    filtered = filtered.filter((item) =>
      options.categories!.includes(item.category)
    );
  }

  if (options.sortBy) {
    filtered.sort((a, b) => {
      const aValue = a[options.sortBy!];
      const bValue = b[options.sortBy!];
      const order = options.sortOrder === 'desc' ? -1 : 1;

      return (aValue > bValue ? 1 : -1) * order;
    });
  }

  return filtered;
};
