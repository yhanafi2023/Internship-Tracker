import React, { useState, useEffect } from 'react';

const InterviewPrep = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [questions, setQuestions] = useState('');
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  // Fetch applications that have a description
  useEffect(() => {
    if (email) {
      fetch(`http://localhost:5000/applications/${email}/with-interview-status`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.applications.length > 0) {
            setApplications(data.applications);
            setSelectedApp(data.applications[0]);
          }
        });
    }
}, []);
  const handleGetQuestions = async () => {
    if (!selectedApp) {
      alert('Please select a job application');
      return;
    }

    setLoading(true);
    setQuestions('');

    try {
      const response = await fetch("http://localhost:5000/interview-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: selectedApp.description,
          company: selectedApp.company,
          position: selectedApp.position
        })
      });

      const data = await response.json();
      if (data.success) {
        setQuestions(data.feedback);
      } else {
        alert('Error getting questions: ' + data.message);
      }
    } catch (error) {
      alert('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Interview Preparation</h2>
      <p>Select a job application to generate interview questions and tips tailored to that role.</p>

      {applications.length === 0 ? (
        <p>No applications with job descriptions found. Add a job description to an application to use this feature.</p>
      ) : (
        <>
          <div style={{ marginTop: '20px' }}>
            <label style={{ fontWeight: '600', marginRight: '10px' }}>Select Application:</label>
            <select
              value={selectedApp?.id || ""}
              onChange={(e) => {
                const app = applications.find(a => a.id === parseInt(e.target.value));
                setSelectedApp(app);
                setQuestions('');
              }}
            >
              {applications.map(app => (
                <option key={app.id} value={app.id}>
                  {app.company} — {app.position}
                </option>
              ))}
            </select>

            <button
              onClick={handleGetQuestions}
              disabled={loading || !selectedApp}
              style={{ marginLeft: '10px' }}
            >
              {loading ? 'Generating...' : 'Generate Interview Questions'}
            </button>
          </div>

          {questions && (
            <div style={{ marginTop: '30px', whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
              <h3>Interview Questions & Tips for {selectedApp.company} — {selectedApp.position}</h3>
              <div style={{ marginTop: '15px' }}>
                {questions}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InterviewPrep;