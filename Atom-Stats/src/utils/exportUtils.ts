export interface ExportOptions {
  format: 'csv' | 'json';
  filename?: string;
}

export const exportStats = async (
  data: any[],
  options: ExportOptions
): Promise<void> => {
  const filename =
    options.filename ||
    `stats-export-${new Date().toISOString().split('T')[0]}`;

  let content: string;
  let type: string;

  if (options.format === 'csv') {
    content = convertToCSV(data);
    type = 'text/csv';
  } else {
    content = JSON.stringify(data, null, 2);
    type = 'application/json';
  }

  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `${filename}.${options.format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const convertToCSV = (data: any[]): string => {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const rows = data.map((item) =>
    headers.map((header) => JSON.stringify(item[header])).join(',')
  );

  return [headers.join(','), ...rows].join('\n');
};
