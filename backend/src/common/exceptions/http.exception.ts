export class HttpException extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public error?: string
  ) {
    super(message);
    this.name = 'HttpException';
    this.statusCode = statusCode;
    this.error = error;
  }
} 