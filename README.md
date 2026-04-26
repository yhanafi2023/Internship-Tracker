# Internship Tracker
 
A full-stack web application that centralizes and simplifies the job and internship application process for students and job seekers.
 
---
 
## Overview
 
Managing multiple job applications across different platforms is tedious and disorganized. Internship Tracker solves this by giving users a single dashboard to add, track, and manage every application in one place. Users can monitor application statuses, take notes, set deadlines, upload resumes, and leverage AI-powered tools to prepare for interviews and improve their resume — all without switching between tabs or job boards.
 
---
 
## Features
 
- **User Authentication** — Secure account creation and login with encrypted passwords
- **Application Dashboard** — View all applications in a card-based layout with status indicators
- **Add Applications Manually** — Submit company, position, location, salary, deadline, job description, link, and notes
- **Import via CSV** — Bulk import applications exported from Indeed, LinkedIn, or other platforms
- **Export to CSV** — Download all your applications as a CSV file at any time
- **Status Tracking** — Move applications through stages: Saved, Applied, Interview, Offer, Rejected, Withdrawn
- **Search and Filter** — Search by company, position, or location and filter by status
- **Sort Applications** — Sort by date applied, company name, status, or deadline
- **Notes** — Add and edit personal notes on each application with a 1000 character limit
- **Edit Applications** — Update any field on an existing application via a modal editor
- **Delete Applications** — Remove individual applications or clear all at once
- **Resume Upload** — Upload and store your resume directly in the app
- **AI Resume Feedback** — Upload your resume and select a job application to receive AI-generated feedback on how well your resume matches the job description
- **AI Interview Prep** — Generate tailored interview questions based on the job description for any application in Interview status
- **Analytics** — Visual charts showing application breakdown by status, top companies applied to, and applications over time
- **Auto-Remove Rejected** — Optional setting to automatically delete applications when marked as Rejected
- **Rate Limiting** — Built-in protection against request abuse on all endpoints
---
 
## Tech Stack
 
- **Frontend:** ReactJS, HTML/CSS
- **Backend:** Python, Flask, Flask-SQLAlchemy, 
- **Database:** PostgreSQL
- **AI:** Groq API (Model: LLaMA 3.3 70B)
---
 
## Running Locally
 
### Prerequisites
 
Make sure you have the following installed before continuing:
 
- **Python 3.10 or higher** — [https://www.python.org/downloads](https://www.python.org/downloads)
- **Node.js 18 or higher** — [https://nodejs.org](https://nodejs.org)
- **PostgreSQL** — [https://www.postgresql.org/download](https://www.postgresql.org/download)
- **A Groq API key** — Create a free account and generate a key at [https://console.groq.com](https://console.groq.com)
---
 
### 1. Clone the Repository
 
```bash
git clone https://github.com/your-username/your-repo-name.git
cd Internship-Tracker
```
 
---
 
### 2. Set Up the PostgreSQL Database
 
Open your PostgreSQL shell or a tool like pgAdmin and create a new database:
 
```sql
CREATE DATABASE internship_tracker;
```
 
Take note of your database username, password, host, and port as you will need them in the next step.
 
---
 
### 3. Configure the Backend Environment
 
Navigate to the backend folder and create a `.env` file:
 
```bash
cd backend
```
 
Create a file named `.env` in the `backend` folder with the following contents:
 
```
DATABASE_USER=your_postgres_username
DATABASE_PASSWORD=your_postgres_password
DATABASE_HOST=localhost
DATABASE_NAME=internship_tracker
DATABASE_PORT=5432
GROQ_API_KEY=your_groq_api_key
```
 
Replace each value with your actual credentials.
 
---
 
### 4. Install Backend Dependencies
 
While inside the `backend` folder, create a virtual environment and install the required packages:
 
```bash
python -m venv venv
```
 
Activate the virtual environment:
 
On Mac/Linux:
```bash
source venv/bin/activate
```
 
On Windows:
```bash
venv\Scripts\activate
```
 
Install dependencies:
 
```bash
pip install -r requirements.txt
```
 
---
 
### 5. Start the Backend Server
 
```bash
python server.py
```
 
The Flask server will start on `http://127.0.0.1:5000`. The database tables will be created automatically on first run.
 
---
 
### 6. Install Frontend Dependencies
 
Open a new terminal, navigate back to the root of the project, and install Node packages:
 
```bash
cd ..
npm install
```
 
---
 
### 7. Start the Frontend
 
```bash
npm run dev
```
 
The React app will be available at `http://localhost:5173`.
 
---
 
### Summary
 
| Service    | URL                        |
|------------|----------------------------|
| Frontend   | http://localhost:5173      |
| Backend    | http://127.0.0.1:5000      |
 
Both the frontend and backend must be running at the same time for the application to work.
 
---
 
## Project Structure
 
```
root/
├── src/
│   ├── components/
│   │   ├── AddApplicationForm.jsx
│   │   ├── Analytics.jsx
│   │   ├── ImportApplications.jsx
│   │   ├── InterviewPrep.jsx
│   │   ├── JobDashboard.jsx
│   │   ├── ResumeUpload.jsx
│   │   └── Settings.jsx
│   ├── utils/
│   │   └── jobApplications.js
│   ├── App.jsx
│   ├── App.css
│   ├── JobTracker.jsx
│   ├── Home.jsx
│   ├── AboutUs.jsx
│   ├── ContactUs.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── LoginSignup.jsx
│   ├── config.js
│   └── main.jsx
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   └── .env
├── index.html
├── vite.config.js
└── package.json
```
 
---
 
## License
 
Licensed under the Apache License, Version 2.0. See `LICENSE` for details
