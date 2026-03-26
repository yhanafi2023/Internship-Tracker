import React, { useState } from 'react';
import { parseJobApplicationsCSV } from '../utils/jobApplications.js';

const ImportApplications = ({ onImport }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (file) => {
    if (!file || !file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setImporting(true);
    setError('');

    try {
      const text = await file.text();
      const applications = parseJobApplicationsCSV(text);
      
      if (applications.length === 0) {
        setError('No valid job applications found in the CSV file');
      } else {
        onImport(applications);
        setError('');
      }
    } catch (err) {
      setError('Error parsing CSV file. Please check the format.');
      console.error('CSV parsing error:', err);
    } finally {
      setImporting(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="import-container">
      <h2>Import Job Applications</h2>
      <p>Upload a CSV file from Indeed, LinkedIn, or other job platforms to track your applications.</p>
      
      <div 
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="drop-zone-content">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <p>Drag and drop your CSV file here, or</p>
          <label className="file-input-label">
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileSelect}
              className="file-input"
            />
            <span className="browse-button">Browse Files</span>
          </label>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {importing && <div className="importing-message">Importing applications...</div>}

      <div className="csv-format-info">
        <h3>Expected CSV Format:</h3>
        <p>Your CSV should contain columns like:</p>
        <code>company, position, location, date, salary, description, link</code>
        <p>Column names can vary - the system will automatically match common variations.</p>
      </div>
    </div>
  );
};

export default ImportApplications;
