import React, { useState, useEffect } from 'react';

const ResumeUpload = () => {
  const [resume, setResume] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  // Load resume from localStorage
  useEffect(() => {
    const savedResume = localStorage.getItem('resume');
    if (savedResume) setResume(savedResume);
  }, []);

  // Save resume to localStorage
  useEffect(() => {
    if (resume) localStorage.setItem('resume', resume);
  }, [resume]);

  // Fetch applications that have a description
  // Replace your applications fetch useEffect with this:
useEffect(() => {
    if (email) {
      fetch(`http://localhost:5000/applications/${email}/with-description`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setApplications(data.applications);
            setSelectedApp(data.applications[0]); // auto-select the first one
          }
        });
    }
}, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
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
    if (!resume) {
      alert('Please upload a resume first');
      return;
    }
    if (!selectedApp) {
      alert('Please select a job application');
      return;
    }

    setLoadingFeedback(true);
    setFeedback('');

    try {
      const response = await fetch("http://localhost:5000/ai-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume: resume,
          description: selectedApp.description
        })
      });

      const data = await response.json();
      if (data.success) {
        setFeedback(data.feedback);
      } else {
        alert('Error getting feedback: ' + data.message);
      }
    } catch (error) {
      alert('Error connecting to server');
    } finally {
      setLoadingFeedback(false);
    }
  };

  return (
    <div>
      <h2>Resume</h2>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleUpload}
      />

      {resume && (
        <div style={{ marginTop: '20px' }}>
          <p>✅ Resume uploaded</p>
          <a href={resume} download="resume">
            <button>Download Resume</button>
          </a>
          <button onClick={handleRemove}>Remove Resume</button>
        </div>
      )}

      <div style={{ marginTop: '40px' }}>
        <h3>AI Resume Feedback</h3>

        {applications.length === 0 ? (
          <p>No applications with job descriptions found. Add a job description to an application to get AI feedback.</p>
        ) : (
          <>
            <p>Select a job application to compare your resume against:</p>
            <select
                onChange={(e) => {
                const app = applications.find(a => a.id === parseInt(e.target.value));
                setSelectedApp(app);
                setFeedback('');
  }}
  value={selectedApp?.id || ""}  
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
              style={{ marginLeft: '10px' }}
            >
              {loadingFeedback ? 'Getting Feedback...' : 'Get AI Feedback'}
            </button>
          </>
        )}

        {feedback && (
          <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
            <h4>Feedback:</h4>
            <p>{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;