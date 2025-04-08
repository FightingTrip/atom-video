import { useState, useEffect } from 'react';
import { statsCache } from '../utils/statsCache';
import { handleStatsError } from '../utils/errorHandler';

interface UseStatsOptions {
  cacheKey?: string;
  refetchInterval?: number;
}

export function useStats<T>(
  fetcher: () => Promise<T>,
  options: UseStatsOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        if (options.cacheKey) {
          const cached = statsCache.get<T>(options.cacheKey);
          if (cached && mounted) {
            setData(cached);
            setLoading(false);
            return;
          }
        }

        const result = await fetcher();
        if (mounted) {
          setData(result);
          if (options.cacheKey) {
            statsCache.set(options.cacheKey, result);
          }
        }
      } catch (err) {
        if (mounted) {
          setError(handleStatsError(err));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    if (options.refetchInterval) {
      const intervalId = setInterval(fetchData, options.refetchInterval);
      return () => {
        mounted = false;
        clearInterval(intervalId);
      };
    }

    return () => {
      mounted = false;
    };
  }, [fetcher, options.cacheKey, options.refetchInterval]);

  return { data, loading, error };
}
