/**
 * 依赖模块类型声明
 */

// 针对可能缺少类型定义的依赖包进行声明
declare module 'bcrypt' {
  export function genSalt(rounds?: number): Promise<string>;
  export function hash(data: string, salt: string | number): Promise<string>;
  export function compare(data: string, encrypted: string): Promise<boolean>;
}

declare module 'helmet' {
  import { RequestHandler } from 'express';
  function helmet(): RequestHandler;
  export = helmet;
}

declare module 'compression' {
  import { RequestHandler } from 'express';
  function compression(options?: any): RequestHandler;
  export = compression;
}

declare module 'express-rate-limit' {
  import { Request, Response, NextFunction } from 'express';

  interface RateLimitOptions {
    windowMs?: number;
    max?: number;
    message?: string | object;
    statusCode?: number;
    headers?: boolean;
    draft_polli_ratelimit_headers?: boolean;
    skipFailedRequests?: boolean;
    skipSuccessfulRequests?: boolean;
    requestWasSuccessful?: (req: Request, res: Response) => boolean;
    skip?: (req: Request, res: Response) => boolean;
    keyGenerator?: (req: Request, res: Response) => string;
    handler?: (req: Request, res: Response, next: NextFunction) => void;
    onLimitReached?: (req: Request, res: Response, options: RateLimitOptions) => void;
    standardHeaders?: boolean;
    legacyHeaders?: boolean;
    store?: any;
    [key: string]: any;
  }

  function rateLimit(
    options?: RateLimitOptions
  ): (req: Request, res: Response, next: NextFunction) => void;
  export = rateLimit;
}

// JWT类型扩展
declare module 'jsonwebtoken' {
  export interface JwtPayload {
    userId: string;
    role: string;
    iat?: number;
    exp?: number;
  }

  export function sign(
    payload: string | Buffer | object,
    secretOrPrivateKey: string,
    options?: SignOptions
  ): string;

  export function decode(
    token: string,
    options?: DecodeOptions
  ): null | { [key: string]: any } | string;

  export function verify(token: string, secretOrPublicKey: string, callback?: VerifyCallback): void;

  export function verify(
    token: string,
    secretOrPublicKey: string,
    options?: VerifyOptions,
    callback?: VerifyCallback
  ): void;

  export interface VerifyCallback {
    (err: any, decoded: object | string): void;
  }

  export interface DecodeOptions {
    complete?: boolean;
    json?: boolean;
  }

  export interface VerifyOptions {
    algorithms?: string[];
    audience?: string | string[];
    clockTimestamp?: number;
    complete?: boolean;
    issuer?: string | string[];
    jwtid?: string;
    ignoreExpiration?: boolean;
    ignoreNotBefore?: boolean;
    subject?: string;
    maxAge?: string | number;
  }

  export interface SignOptions {
    algorithm?: string;
    expiresIn?: string | number;
    notBefore?: string | number;
    audience?: string | string[];
    issuer?: string;
    jwtid?: string;
    subject?: string;
    noTimestamp?: boolean;
    header?: object;
    keyid?: string;
  }
}

// 添加其他可能需要的类型声明
