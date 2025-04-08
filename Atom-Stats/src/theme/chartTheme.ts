interface ChartTheme {
  backgroundColor: string;
  textColor: string;
  gridColor: string;
  colors: string[];
}

export const lightTheme: ChartTheme = {
  backgroundColor: '#ffffff',
  textColor: '#333333',
  gridColor: '#e0e0e0',
  colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],
};

export const darkTheme: ChartTheme = {
  backgroundColor: '#222222',
  textColor: '#ffffff',
  gridColor: '#444444',
  colors: ['#5ab0e4', '#ffae4a', '#4dca4d', '#ff4d4d', '#b47de4'],
};

export const getTheme = (isDark: boolean): ChartTheme =>
  isDark ? darkTheme : lightTheme;
