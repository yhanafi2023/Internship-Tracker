import React, { useState, useEffect } from 'react';
import URL from '../config.js';

const ResumeUpload = () => {
  const [resume, setResume] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  useEffect(() => {
    const savedResume = localStorage.getItem('resume');
    if (savedResume) setResume(savedResume);
  }, []);

  useEffect(() => {
    if (resume) localStorage.setItem('resume', resume);
  }, [resume]);

  useEffect(() => {
    if (email) {
      fetch(`${URL}/applications/${email}/with-description`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setApplications(data.applications);
            setSelectedApp(data.applications[0]);
          }
        });
    }
  }, []);

  const handleUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  
  if (file.type !== "application/pdf") {
    alert("Only PDF files are allowed.");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => setResume(reader.result);
  reader.readAsDataURL(file);
};

  const handleRemove = () => {
    setResume(null);
    setFeedback('');
    localStorage.removeItem('resume');
  };

  const handleGetFeedback = async () => {
    if (!resume) { alert('Please upload a resume first'); return; }
    if (!selectedApp) { alert('Please select a job application'); return; }

    setLoadingFeedback(true);
    setFeedback('');

    try {
      const response = await fetch(`${URL}/ai-feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, description: selectedApp.description })
      });
      if (response.status === 429) {
        alert("Too many requests. Please try again later.");
        return;
      }
      const data = await response.json();
      if (data.success) setFeedback(data.feedback);
      else alert('Error getting feedback: ' + data.message);
    } catch (error) {
      alert('Error connecting to server');
    } finally {
      setLoadingFeedback(false);
    }
  };

  const formatFeedback = (text) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    return lines.map((line, index) => {
     
      const isHeading = line.startsWith('**') && line.endsWith('**') || line === line.toUpperCase();
      if (isHeading) {
        return (
          <div key={index} style={{
            fontWeight: 'bold',
            fontSize: '1rem',
            marginTop: '20px',
            marginBottom: '6px',
            color: '#667eea'
          }}>
            {line}
          </div>
        );
      }
   
      const isBullet = line.trim().startsWith('-') || line.trim().startsWith('•') || /^\d+\./.test(line.trim());
      if (isBullet) {
        return (
          <div key={index} style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '6px',
            paddingLeft: '12px'
          }}>
            <span style={{ color: '#667eea', flexShrink: 0 }}>•</span>
            <span>{line.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      }
      
      return (
        <p key={index} style={{ marginBottom: '8px', lineHeight: '1.7' }}>
          {line}
        </p>
      );
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <h2>Resume</h2>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        marginBottom: '24px'
      }}>
        <h3 style={{ marginBottom: '16px' }}>Upload Resume</h3>
        <input type="file" accept=".pdf" onChange={handleUpload} />
        {resume && (
          <div style={{ marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ color: '#28a745', fontWeight: '600' }}>✅ Resume uploaded</span>
            <a href={resume} download="resume">
              <button>Download</button>
            </a>
            <button onClick={handleRemove} style={{ background: 'linear-gradient(135deg, #dc3545, #c82333)' }}>
              Remove
            </button>
          </div>
        )}
      </div>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ marginBottom: '16px' }}>AI Resume Feedback</h3>

        {applications.length === 0 ? (
          <p style={{ color: '#666' }}>No applications with job descriptions found. Add a job description to an application to get AI feedback.</p>
        ) : (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              onChange={(e) => {
                const app = applications.find(a => a.id === parseInt(e.target.value));
                setSelectedApp(app);
                setFeedback('');
              }}
              value={selectedApp?.id || ""}
              style={{ padding: '10px', borderRadius: '8px', border: '2px solid #e1e1e1', fontSize: '14px' }}
            >
              {applications.map(app => (
                <option key={app.id} value={app.id}>
                  {app.company} — {app.position}
                </option>
              ))}
            </select>
            <button
              onClick={handleGetFeedback}
              disabled={loadingFeedback || !resume || !selectedApp}
            >
              {loadingFeedback ? 'Analyzing...' : 'Get AI Feedback'}
            </button>
          </div>
        )}

        {loadingFeedback && (
          <div style={{ marginTop: '24px', color: '#667eea', fontWeight: '600' }}>
            Analyzing your resume...
          </div>
        )}

        {feedback && (
          <div style={{
            marginTop: '24px',
            padding: '24px',
            background: '#f8f9fa',
            borderRadius: '12px',
            borderLeft: '4px solid #667eea',
            textAlign: 'left',
            fontSize: '0.95rem',
            color: '#333'
          }}>
            <h4 style={{ marginBottom: '16px', color: '#667eea' }}>
              📋 Feedback for {selectedApp?.company} — {selectedApp?.position}
            </h4>
            {formatFeedback(feedback)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;