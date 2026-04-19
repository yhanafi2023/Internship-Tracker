import React, { useState, useEffect } from 'react';
import { APPLICATION_STATUSES, STATUS_COLORS, getNextStatus, getPreviousStatus } from '../utils/jobApplications.js';
import URL from '../config.js';



const JobDashboard = ({ applications, onUpdateApplication, onDeleteApplication }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [editingId, setEditingId] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [editingApp, setEditingApp] = useState(null);  
  const [editForm, setEditForm] = useState({});

  
  const filteredApplications = applications
  .filter(app => {
    const matchesFilter =
      filter === 'all' || app.status === filter;

    const matchesSearch =
      searchTerm === '' ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.location &&
        app.location.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  })
  .sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.applicationDate) - new Date(a.applicationDate);
    } 
    else if (sortBy === 'company') {
      return a.company.localeCompare(b.company);
    } 
    else if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    } 
    else if (sortBy === 'deadline') {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    }

    return 0;
  });

  const getStatusCount = (status) => {
    return applications.filter(app => app.status === status).length;
  };

  const handleStatusChange = (appId, newStatus) => {
    onUpdateApplication(appId, { 
      status: newStatus, 
      updatedAt: new Date().toISOString() 
    });
  };

  const handleNotesEdit = (appId, currentNotes) => {
    setEditingId(appId);
    setEditNotes(currentNotes);
  };

  const handleNotesSave = (appId) => {
    onUpdateApplication(appId, { 
      notes: editNotes,
      updatedAt: new Date().toISOString() 
    });
    setEditingId(null);
    setEditNotes('');
  };
  const handleEditOpen = (app) => {
    setEditingApp(app.id);
    setEditForm({
      company: app.company || '',
      position: app.position || '',
      location: app.location || '',
      status: app.status || '',
      applicationDate: app.applicationDate || '',
      deadline: app.deadline || '',
      salary: app.salary || '',
      notes: app.notes || '',
      link: app.link || '',
      description: app.description || ''
    });
  };
  const handleEditSave = () => {
    onUpdateApplication(editingApp, { ...editForm, updatedAt: new Date().toISOString() });
    setEditingApp(null);
    setEditForm({});
  };

  const formatDate = (dateString) => {
  if (!dateString) return 'N/A'; 
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

  return (
    <div className="job-dashboard">
    
      {editingApp && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            background: 'white', borderRadius: '15px', padding: '40px',
            width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <h2 style={{ marginBottom: '20px' }}>Edit Application</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Company</label>
                <input value={editForm.company} onChange={e => setEditForm({...editForm, company: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Position</label>
                <input value={editForm.position} onChange={e => setEditForm({...editForm, position: e.target.value})} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                  {Object.values(APPLICATION_STATUSES).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
  <div className="form-group">
    <label>Application Date</label>
    <input
      type="date"
      value={editForm.applicationDate}
      onChange={e => setEditForm({...editForm, applicationDate: e.target.value})}
    />
  </div>

  <div className="form-group">
    <label>Deadline</label>
    <input
      type="date"
      value={editForm.deadline || ''}
      onChange={e => setEditForm({...editForm, deadline: e.target.value})}
    />
  </div>
</div>

<div className="form-row">
  <div className="form-group">
    <label>Salary</label>
    <input
      value={editForm.salary}
      onChange={e => setEditForm({...editForm, salary: e.target.value})}
    />
  </div>
</div>

            <div className="form-group">
              <label>Link</label>
              <input value={editForm.link} onChange={e => setEditForm({...editForm, link: e.target.value})} />
            </div>

            <div className="form-group">
              <label>Job Description</label>
              <textarea rows="4" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} />
            </div>

            <div className="form-group">
  <label>Notes</label>
  <textarea rows="4" value={editForm.notes} 
    onChange={e => setEditForm({...editForm, notes: e.target.value})}
    maxLength={1000}
  />
  <p style={{ fontSize: '0.75rem', color: '#999', textAlign: 'right' }}>
    {(editForm.notes || '').length}/1000
  </p>
</div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
              <button className="submit-btn" onClick={handleEditSave}>Save Changes</button>
              <button className="reset-btn" onClick={() => setEditingApp(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-header">
        <h2>Job Applications Dashboard</h2>
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-number">{applications.length}</span>
            <span className="stat-label">Total</span>
          </div>
          {Object.values(APPLICATION_STATUSES).map(status => (
            <div key={status} className="stat-item">
              <span className="stat-number" style={{ color: STATUS_COLORS[status] }}>
                {getStatusCount(status)}
              </span>
              <span className="stat-label">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-controls">
        <div className="control-group">
          <input type="text" placeholder="Search by company, position, or location..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
        </div>
        <div className="control-group">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
            <option value="all">All Status</option>
            {Object.values(APPLICATION_STATUSES).map(status => (
              <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
            <option value="date">Sort by Date Applied</option>
            <option value="company">Sort by Company</option>
            <option value="status">Sort by Status</option>
             <option value="deadline">Sort by Deadline</option>
          </select>
        </div>
      </div>

      <div className="applications-grid">
        {filteredApplications.map(application => (
          <div key={application.id} className="application-card">
            <div className="card-header">
              <h3>{application.position}</h3>
              <div className="status-badge" style={{ backgroundColor: STATUS_COLORS[application.status] }}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </div>
            </div>

            <div className="card-content">
              <div className="company-info">
                <strong>Company: {application.company}</strong>
                {application.location && <span> • Location: {application.location}</span>}
              </div>
              <div className="application-meta">
  <span className="date">
    Applied On: {formatDate(application.applicationDate)}
  </span>

  {application.salary && (
    <span className="salary">
      {' '}• Salary: ${application.salary} / year
    </span>
  )}

  {application.deadline && (
    <div className="deadline">
      Deadline: {formatDate(application.deadline)}
    </div>
  )}
</div>
              {application.link && (
                <a href={application.link} target="_blank" rel="noopener noreferrer" className="job-link">
                  View Job Posting
                </a>
              )}
              <div className="notes-section">
                {editingId === application.id ? (
                  <div className="notes-edit">
  <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)}
    placeholder="Add notes about this application..." className="notes-textarea"
    maxLength={1000}
  />
  <p style={{ fontSize: '0.75rem', color: '#999', textAlign: 'right' }}>
    {editNotes.length}/1000
  </p>
  <div className="notes-actions">
    <button onClick={() => handleNotesSave(application.id)} className="save-notes-btn">Save</button>
    <button onClick={() => setEditingId(null)} className="cancel-notes-btn">Cancel</button>
  </div>
</div>
                ) : (
                  <div className="notes-display">
                    {application.notes ? (
                      <p className="notes-text">{application.notes}</p>
                    ) : (
                      <p className="no-notes">No notes added</p>
                    )}
                    <button onClick={() => handleNotesEdit(application.id, application.notes)} className="edit-notes-btn">
                      {application.notes ? 'Edit' : 'Add'} Notes
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="card-actions">
              <button onClick={() => handleStatusChange(application.id, getPreviousStatus(application.status))}
                disabled={application.status === APPLICATION_STATUSES.SAVED} className="status-btn prev-btn">
                ← Previous
              </button>
              <button onClick={() => handleStatusChange(application.id, getNextStatus(application.status))}
                disabled={application.status === APPLICATION_STATUSES.REJECTED || application.status === APPLICATION_STATUSES.OFFER}
                className="status-btn next-btn">
                Next →
              </button>
              <button onClick={() => handleEditOpen(application)} className="edit-btn">
                Edit
              </button>
              <button onClick={() => onDeleteApplication(application.id)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="no-applications">
          <p>No job applications found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default JobDashboard;