import React, { useState, useEffect } from 'react';
import URL from './config.js';

const InterviewPrep = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [questions, setQuestions] = useState('');
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  useEffect(() => {
    if (email) {
      fetch(`${URL}/applications/${email}/with-interview-status`)
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
    if (!selectedApp) { alert('Please select a job application'); return; }
    setLoading(true);
    setQuestions('');
    try {
      const response = await fetch("${URL}/interview-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: selectedApp.description,
          company: selectedApp.company,
          position: selectedApp.position
        })
      });
      if (response.status === 429) {
        alert("Too many requests. Please try again later.");
        return;
      }
      const data = await response.json();
      if (data.success) setQuestions(data.feedback);
      else alert('Error getting questions: ' + data.message);
    } catch (error) {
      alert('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  
  const formatQuestions = (text) => {
    const blocks = [];
    const lines = text.split('\n').filter(line => line.trim() !== '');
    let currentQuestion = null;
    let currentKeyPoints = [];

    lines.forEach(line => {
      const trimmed = line.trim();

      if (trimmed.startsWith('QUESTION')) {
       
        if (currentQuestion) {
          blocks.push({ question: currentQuestion, keyPoints: currentKeyPoints });
        }
        currentQuestion = trimmed.replace(/^QUESTION\s*\d+:\s*/i, '');
        currentKeyPoints = [];
      } else if (trimmed.startsWith('KEY POINTS')) {
        currentKeyPoints = trimmed
          .replace(/^KEY POINTS:\s*/i, '')
          .split(',')
          .map(p => p.trim())
          .filter(Boolean);
      }
    });

    if (currentQuestion) {
      blocks.push({ question: currentQuestion, keyPoints: currentKeyPoints });
    }

    return blocks;
  };

  const formattedBlocks = questions ? formatQuestions(questions) : [];

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Interview Preparation</h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        Select a job application to generate interview questions tailored to that role.
      </p>

      {applications.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          color: '#666'
        }}>
          No applications with interview status and a job description found. Set an application's status
          to "Interview" and add a job description to use this feature.
        </div>
      ) : (
        <>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            marginBottom: '24px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <select
              value={selectedApp?.id || ""}
              onChange={(e) => {
                const app = applications.find(a => a.id === parseInt(e.target.value));
                setSelectedApp(app);
                setQuestions('');
              }}
              style={{ padding: '10px', borderRadius: '8px', border: '2px solid #e1e1e1', fontSize: '14px' }}
            >
              {applications.map(app => (
                <option key={app.id} value={app.id}>
                  {app.company} — {app.position}
                </option>
              ))}
            </select>
            <button onClick={handleGetQuestions} disabled={loading || !selectedApp}>
              {loading ? 'Generating...' : 'Generate Interview Questions'}
            </button>
          </div>

          {loading && (
            <div style={{ color: '#667eea', fontWeight: '600' }}>
              ⏳ Generating questions...
            </div>
          )}

          {formattedBlocks.length > 0 && (
            <div>
              <h3 style={{ marginBottom: '20px' }}>
                Questions for {selectedApp.company} — {selectedApp.position}
              </h3>
              {formattedBlocks.map((block, index) => (
                <div key={index} style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  marginBottom: '16px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  borderLeft: '4px solid #667eea',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      flexShrink: 0
                    }}>
                      {index + 1}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '12px', color: '#333' }}>
                        {block.question}
                      </p>
                      {block.keyPoints.length > 0 && (
                        <div>
                          <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#667eea', marginBottom: '8px' }}>
                            KEY POINTS
                          </p>
                          <ul style={{ paddingLeft: '0', listStyle: 'none', margin: 0 }}>
                            {block.keyPoints.map((point, i) => (
                              <li key={i} style={{
                                display: 'flex',
                                gap: '8px',
                                marginBottom: '6px',
                                fontSize: '0.9rem',
                                color: '#555'
                              }}>
                                <span style={{ color: '#667eea', flexShrink: 0 }}>•</span>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InterviewPrep;