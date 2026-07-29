import React, { useState } from 'react';

const ExportCSVButton = ({ data, filename = 'export.csv', label = 'Export Records (CSV)' }) => {
  const [exporting, setExporting] = useState(false);

  const downloadCSV = () => {
    if (!data || data.length === 0) return;
    setExporting(true);

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => 
      Object.values(obj).map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setExporting(false), 500);
  };

  return (
    <button 
      onClick={downloadCSV} 
      className="btn btn-secondary" 
      style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
      disabled={!data || data.length === 0 || exporting}
    >
      📥 {exporting ? 'Exporting...' : label}
    </button>
  );
};

export default ExportCSVButton;
