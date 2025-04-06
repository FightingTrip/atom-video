// 通用工具类型

// 深度部分类型
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

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
