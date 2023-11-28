import React from 'react';
import JSZip from 'jszip';

const CsvDownloadButton = () => {
  const getHeaders = (type) => {
    if (type === 'income') {
      return ['income', 'source', 'day', 'month', 'year', 'amount'];
    } else if (type === 'expenses') {
      return ['expenses', 'category', 'day', 'month', 'year', 'amount', 'description'];
    } else {
      return [];
    }
  };

  const generateCsvContent = (type) => {
    const headers = getHeaders(type);
    return [headers.join(',')].join('\n');
  };

  const handleDownload = async () => {
    const zip = new JSZip();

    // Add "Income" CSV file to the ZIP
    zip.file('income_data.csv', generateCsvContent('income'));

    // Add "Expenses" CSV file to the ZIP
    zip.file('expenses_data.csv', generateCsvContent('expenses'));

    // Generate the ZIP file
    const zipContent = await zip.generateAsync({ type: 'blob' });

    // Create a download link
    const url = window.URL.createObjectURL(zipContent);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'combined_data.zip'; // Specify the ZIP file name
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleDownload}>
      CSV Templates
    </button>
  );
};

export default CsvDownloadButton;