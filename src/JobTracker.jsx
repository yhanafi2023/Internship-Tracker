import React, { useState, useEffect } from 'react';
import ImportApplications from './components/ImportApplications.jsx';
import JobDashboard from './components/JobDashboard.jsx';
import AddApplicationForm from './components/AddApplicationForm.jsx';

const JobTracker = () => {
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Load applications from localStorage on component mount
  useEffect(() => {
    const savedApplications = localStorage.getItem('jobApplications');
    if (savedApplications) {
      try {
        setApplications(JSON.parse(savedApplications));
      } catch (error) {
        console.error('Error loading applications:', error);
      }
    }
    setLoading(false);
  }, []);

  // Save applications to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('jobApplications', JSON.stringify(applications));
    }
  }, [applications, loading]);

  const handleAddApplication = (newApplication) => {
    setApplications(prev => [newApplication, ...prev]);
    setActiveTab('dashboard'); // Switch to dashboard after adding
  };

  const handleImport = (newApplications) => {
    // Add new applications, avoiding duplicates based on company and position
    const existingKeys = applications.map(app => `${app.company}-${app.position}`);
    const uniqueNewApps = newApplications.filter(app => 
      !existingKeys.includes(`${app.company}-${app.position}`)
    );
    
    setApplications(prev => [...prev, ...uniqueNewApps]);
    setActiveTab('dashboard'); // Switch to dashboard after import
  };

  const handleUpdateApplication = (appId, updates) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === appId ? { ...app, ...updates } : app
      )
    );
  };

  const handleDeleteApplication = (appId) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      setApplications(prev => prev.filter(app => app.id !== appId));
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all applications? This cannot be undone.')) {
      setApplications([]);
      localStorage.removeItem('jobApplications');
    }
  };

  const exportToCSV = () => {
    if (applications.length === 0) {
      alert('No applications to export');
      return;
    }

    const headers = ['Company', 'Position', 'Location', 'Status', 'Application Date', 'Salary', 'Notes', 'Link'];
    const csvContent = [
      headers.join(','),
      ...applications.map(app => [
        app.company,
        app.position,
        app.location,
        app.status,
        app.applicationDate,
        app.salary,
        `"${app.notes.replace(/"/g, '""')}"`, // Escape quotes in notes
        app.link
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-applications-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="loading">Loading your job applications...</div>;
  }

  return (
    <div className="job-tracker">
      <div className="tracker-header">
        <h1>Job Application Tracker</h1>
        <div className="header-actions">
          {applications.length > 0 && (
            <>
              <button onClick={exportToCSV} className="export-btn">
                Export to CSV
              </button>
              <button onClick={handleClearAll} className="clear-btn">
                Clear All
              </button>
            </>
          )}
        </div>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard ({applications.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Add Application
        </button>
        <button 
          className={`tab-btn ${activeTab === 'import' ? 'active' : ''}`}
          onClick={() => setActiveTab('import')}
        >
          Import CSV
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'dashboard' && (
          <JobDashboard 
            applications={applications}
            onUpdateApplication={handleUpdateApplication}
            onDeleteApplication={handleDeleteApplication}
          />
        )}
        
        {activeTab === 'add' && (
          <AddApplicationForm onAddApplication={handleAddApplication} />
        )}
        
        {activeTab === 'import' && (
          <ImportApplications onImport={handleImport} />
        )}
      </div>
    </div>
  );
};

export default JobTracker;
