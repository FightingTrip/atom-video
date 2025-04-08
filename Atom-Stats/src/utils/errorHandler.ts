export class StatsError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'StatsError';
  }
}

export const handleStatsError = (error: any): StatsError => {
  if (error instanceof StatsError) {
    return error;
  }

  if (error.response) {
    return new StatsError('数据获取失败', 'API_ERROR', error.response.data);
  }

  return new StatsError('未知错误', 'UNKNOWN_ERROR', error);
};
