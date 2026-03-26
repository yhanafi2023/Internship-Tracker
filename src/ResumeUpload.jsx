import React, { useState, useEffect } from 'react';

const ResumeUpload = () => {
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const savedResume = localStorage.getItem('resume');
    if (savedResume) {
      setResume(savedResume);
    }
  }, []);

  useEffect(() => {
    if (resume) {
      localStorage.setItem('resume', resume);
    }
  }, [resume]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setResume(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setResume(null);
    localStorage.removeItem('resume');
  };

  return (
    <div>
      <h2>Upload Resume</h2>

      <input 
        type="file" 
        accept=".pdf,.doc,.docx"
        onChange={handleUpload}
      />

      {resume && (
        <div style={{ marginTop: '20px' }}>
          <p>Resume uploaded</p>

          <a href={resume} download="resume">
            <button>Download Resume</button>
          </a>

          <button onClick={handleRemove}>
            Remove Resume
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
