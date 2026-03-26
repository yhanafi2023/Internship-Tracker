import React, { useState } from 'react';
import { APPLICATION_STATUSES } from '../utils/jobApplications.js';

const AddApplicationForm = ({ onAddApplication }) => {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    status: APPLICATION_STATUSES.APPLIED,
    applicationDate: new Date().toISOString().split('T')[0],
    salary: '',
    description: '',
    link: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.company || !formData.position) {
      alert('Please fill in at least the company and position fields');
      return;
    }

    const newApplication = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAddApplication(newApplication);
    
    // Reset form
    setFormData({
      company: '',
      position: '',
      location: '',
      status: APPLICATION_STATUSES.APPLIED,
      applicationDate: new Date().toISOString().split('T')[0],
      salary: '',
      description: '',
      link: '',
      notes: ''
    });
  };

  return (
    <div className="add-application-form">
      <h2>Add Job Application</h2>
      <form onSubmit={handleSubmit} className="application-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="company">Company *</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Google, Microsoft, etc."
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="position">Position *</label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="e.g. Software Engineer Intern"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. New York, NY or Remote"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="status-select"
            >
              <option value={APPLICATION_STATUSES.SAVED}>Saved</option>
              <option value={APPLICATION_STATUSES.APPLIED}>Applied</option>
              <option value={APPLICATION_STATUSES.INTERVIEW}>Interview</option>
              <option value={APPLICATION_STATUSES.OFFER}>Offer</option>
              <option value={APPLICATION_STATUSES.REJECTED}>Rejected</option>
              <option value={APPLICATION_STATUSES.WITHDRAWN}>Withdrawn</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="applicationDate">Application Date</label>
            <input
              type="date"
              id="applicationDate"
              name="applicationDate"
              value={formData.applicationDate}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="salary">Salary</label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. $25/hour or $60,000/year"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="link">Job Posting Link</label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Job Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the role..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any notes about this application..."
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Add Application
          </button>
          <button type="button" onClick={() => setFormData({
            company: '',
            position: '',
            location: '',
            status: APPLICATION_STATUSES.APPLIED,
            applicationDate: new Date().toISOString().split('T')[0],
            salary: '',
            description: '',
            link: '',
            notes: ''
          })} className="reset-btn">
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddApplicationForm;
