/**
 * 工具类型定义
 */

/**
 * 将对象类型中的所有属性设为可选
 */
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

/**
 * 将对象类型中的所有属性设为必选
 */
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

/**
 * 从类型T中选取指定属性K
 */
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

/**
 * 从类型T中排除属性K
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * 从联合类型T中排除U
 */
export type Exclude<T, U> = T extends U ? never : T;

/**
 * 从联合类型T中提取可赋值给U的类型
 */
export type Extract<T, U> = T extends U ? T : never;

/**
 * 将类型T中所有属性都变为只读
 */
export type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

/**
 * 记录类型，键类型为K，值类型为T
 */
export type Record<K extends keyof any, T> = {
  [P in K]: T;
};

/**
 * 提取函数类型的返回类型
 */
export type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R
  ? R
  : any;

/**
 * 提取函数类型的参数类型
 */
export type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any
  ? P
  : never;

/**
 * 非空检查类型，从T中排除null和undefined
 */
export type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * 可为空类型
 */
export type Nullable<T> = T | null | undefined;

/**
 * 移除类型为空属性
 */
export type NonNullableProperties<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

/**
 * 深度部分可选类型
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * 仅选择特定类型的属性
 */
export type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

/**
 * 排除特定类型的属性
 */
export type OmitByType<T, U> = {
  [P in keyof T as T[P] extends U ? never : P]: T[P];
};

/**
 * 将联合类型转换为交叉类型
 */
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

/**
 * Promise解析类型
 */
export type Awaited<T> = T extends Promise<infer R> ? R : T;

// 仅挑选可选字段
export type PickOptional<T> = Pick<
  T,
  {
    [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never;
  }[keyof T]
>;

// 仅挑选必选字段
export type PickRequired<T> = Pick<
  T,
  {
    [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K;
  }[keyof T]
>;

// 嵌套键路径
export type NestedKeyOf<T extends object> = {
  [K in keyof T & (string | number)]: T[K] extends object
    ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
    : `${K}`;
}[keyof T & (string | number)];

// 异步函数返回类型
export type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;
