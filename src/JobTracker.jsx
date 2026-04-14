import React, { useState, useEffect } from 'react';
import ImportApplications from './components/ImportApplications.jsx';
import JobDashboard from './components/JobDashboard.jsx';
import AddApplicationForm from './components/AddApplicationForm.jsx';
import ResumeUpload from './components/ResumeUpload.jsx';
import InterviewPrep from './components/InterviewPrep.jsx';

const JobTracker = () => {
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);




const user = JSON.parse(localStorage.getItem("user"));
const email = user?.email;

// Load applications from backend instead of localStorage
useEffect(() => {
    fetch(`http://localhost:5000/applications/${email}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) setApplications(data.applications);
            setLoading(false);
        });
}, []);

// Save application to backend
const handleAddApplication = async (newApplication) => {
    const response = await fetch("http://localhost:5000/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newApplication, email })
    });
    const data = await response.json();
    if (data.success) {
        setApplications(prev => [{ ...newApplication, id: data.id }, ...prev]);
        setActiveTab('dashboard');
    }
};

  const handleImport = async (newApplications) => {
    // Add new applications, avoiding duplicates based on company and position
    const existingKeys = applications.map(app => `${app.company}-${app.position}`);
    const uniqueNewApps = newApplications.filter(app => 
      !existingKeys.includes(`${app.company}-${app.position}`)
    );
    const savedApps = [];
    for (const app of uniqueNewApps) {
        const response = await fetch("http://localhost:5000/applications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...app, email })
        });
        const data = await response.json();
        if (data.success) {
            savedApps.push({ ...app, id: data.id });
        }
    }
    setApplications(prev => [...prev, ...savedApps]);
    setActiveTab('dashboard'); // Switch to dashboard after import
  };

  const handleUpdateApplication = async (appId, updates) => {
    // Update in backend
    await fetch(`http://localhost:5000/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
    });
    // Update on screen
    setApplications(prev =>
        prev.map(app =>
            app.id === appId ? { ...app, ...updates } : app
        )
    );
};

const handleDeleteApplication = async (appId) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
        await fetch(`http://localhost:5000/applications/${appId}`, {
            method: "DELETE"
        });
        setApplications(prev => prev.filter(app => app.id !== appId));
    }
};

const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete all applications? This cannot be undone.')) {
        // Delete each application from backend
        for (const app of applications) {
            await fetch(`http://localhost:5000/applications/${app.id}`, {
                method: "DELETE"
            });
        }
        setApplications([]);
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
        <button 
          className={`tab-btn ${activeTab === 'resume' ? 'active' : ''}`}
          onClick={() => setActiveTab('resume')}
        >
          Resume
        </button>
        <button
          className={`tab-btn ${activeTab === 'interview' ? 'active' : ''}`}
          onClick={() => setActiveTab('interview')}
        >
          Interview Prep
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
        {activeTab === 'resume' && <ResumeUpload />}
        {activeTab === 'interview' && <InterviewPrep />}
      </div>
    </div>
  );
};

export default JobTracker;
