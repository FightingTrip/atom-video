export interface ExportOptions {
  format: 'csv' | 'json';
  filename?: string;
}

export const exportStats = async (data: any, options: ExportOptions) => {
  const filename = options.filename || `stats-${new Date().toISOString()}`;

  if (options.format === 'csv') {
    const csvContent = convertToCSV(data);
    downloadFile(`${filename}.csv`, csvContent, 'text/csv');
  } else {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(`${filename}.json`, jsonContent, 'application/json');
  }
};

const convertToCSV = (data: any[]): string => {
  if (!data.length) return '';

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((header) => JSON.stringify(row[header])).join(',')
  );

  return [headers.join(','), ...rows].join('\n');
};

const downloadFile = (filename: string, content: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
