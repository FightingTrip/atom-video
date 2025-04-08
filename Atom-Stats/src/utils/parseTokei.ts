/**
 * @file parseTokei.ts
 * @description Tokei 代码统计数据解析工具
 *
 * 该工具提供了一系列函数和接口，用于：
 * 1. 解析 Tokei 生成的 JSON 数据
 * 2. 提供数据格式化功能
 * 3. 计算统计数据（如百分比）
 * 4. 提供类型定义支持
 */

/**
 * Tokei 基础统计数据接口
 * 包含代码行、注释行、空行等基本统计信息
 */
export interface TokeiStats {
  blanks: number; // 空行数
  code: number; // 代码行数
  comments: number; // 注释行数
  lines: number; // 总行数
}

/**
 * Tokei 语言统计数据接口
 * 继承自基础统计数据，添加了语言特定的属性
 */
export interface TokeiLanguage extends TokeiStats {
  name: string; // 语言名称
  files: number; // 文件数量
  inaccurate?: boolean; // 统计是否可能不准确
}

/**
 * Tokei 原始数据接口
 * 键为语言名称，值为该语言的统计数据
 */
export interface TokeiData {
  [language: string]: TokeiLanguage;
}

/**
 * 解析后的 Tokei 数据接口
 * 包含处理后的语言统计数据和总计数据
 */
export interface ParsedTokeiData {
  languages: {
    name: string;
    files: number;
    code: number;
    comments: number;
    blanks: number;
    total: number;
  }[];
  totals: {
    languages: number;
    files: number;
    code: number;
    comments: number;
    blanks: number;
    total: number;
  };
}

/**
 * 解析 Tokei 生成的 JSON 数据
 * @param data - Tokei 输出的原始 JSON 数据
 * @returns 处理后的统计数据，包含语言详情和总计信息
 */
export function parseTokeiData(data: TokeiData): ParsedTokeiData {
  // 初始化结果对象
  const result: ParsedTokeiData = {
    languages: [],
    totals: {
      languages: 0,
      files: 0,
      code: 0,
      comments: 0,
      blanks: 0,
      total: 0,
    },
  };

  // 处理每种语言的数据
  for (const [key, value] of Object.entries(data)) {
    const languageData = {
      name: value.name || key,
      files: value.files,
      code: value.code,
      comments: value.comments,
      blanks: value.blanks,
      total: value.code + value.comments + value.blanks,
    };

    result.languages.push(languageData);

    // 累加总计数据
    result.totals.files += value.files;
    result.totals.code += value.code;
    result.totals.comments += value.comments;
    result.totals.blanks += value.blanks;
  }

  // 计算语言数量和总行数
  result.totals.languages = result.languages.length;
  result.totals.total = result.totals.code + result.totals.comments + result.totals.blanks;

  // 按代码行数排序
  result.languages.sort((a, b) => b.code - a.code);

  return result;
}

/**
 * 从指定路径获取并解析 Tokei 数据
 * @param filePath - Tokei JSON 文件路径，默认为 '/tokei.json'
 * @returns Promise<ParsedTokeiData> - 解析后的 Tokei 数据
 * @throws 如果获取或解析数据失败
 */
export async function fetchTokeiData(filePath: string = '/tokei.json'): Promise<ParsedTokeiData> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch tokei data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return parseTokeiData(data);
  } catch (error) {
    console.error('Error fetching tokei data:', error);
    throw error;
  }
}

/**
 * 格式化数字，添加千位分隔符
 * @param num - 要格式化的数字
 * @returns 格式化后的字符串，例如：1,234,567
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 计算百分比
 * @param value - 当前值
 * @param total - 总值
 * @returns 格式化的百分比字符串，例如：'45.2%'
 */
export function calculatePercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  return ((value / total) * 100).toFixed(1) + '%';
}
