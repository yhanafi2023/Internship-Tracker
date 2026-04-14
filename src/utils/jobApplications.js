// Job application data structure and utilities
export const APPLICATION_STATUSES = {
  SAVED: 'saved',
  APPLIED: 'applied', 
  INTERVIEW: 'interview',
  OFFER: 'offer',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn'
};

export const STATUS_COLORS = {
  [APPLICATION_STATUSES.SAVED]: '#6c757d',
  [APPLICATION_STATUSES.APPLIED]: '#007bff',
  [APPLICATION_STATUSES.INTERVIEW]: '#28a745',
  [APPLICATION_STATUSES.OFFER]: '#ffc107',
  [APPLICATION_STATUSES.REJECTED]: '#dc3545',
  [APPLICATION_STATUSES.WITHDRAWN]: '#6c757d'
};

export const STATUS_ORDER = [
  APPLICATION_STATUSES.SAVED,
  APPLICATION_STATUSES.APPLIED,
  APPLICATION_STATUSES.INTERVIEW,
  APPLICATION_STATUSES.OFFER,
  APPLICATION_STATUSES.REJECTED,
  APPLICATION_STATUSES.WITHDRAWN
];

// Parse CSV data from job application exports
export const parseJobApplicationsCSV = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const applications = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const application = {
      id: Date.now() + i,
      company: getValue('company', headers, values) || 'Unknown Company',
      position: getValue('position|title|job', headers, values) || 'Unknown Position',
      location: getValue('location', headers, values) || '',
      status: APPLICATION_STATUSES.SAVED,
      applicationDate: getValue('date|applied|application date', headers, values) || new Date().toISOString().split('T')[0],
      ddeadline: getValue('deadline|due date|closing date', headers, values) || '',
      salary: getValue('salary', headers, values) || '',
      description: getValue('description', headers, values) || '',
      link: getValue('link|url', headers, values) || '',
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    applications.push(application);
  }
  
  return applications;
};

// Helper function to get value from CSV headers
const getValue = (fieldPattern, headers, values) => {
  const patterns = fieldPattern.split('|');
  for (const pattern of patterns) {
    const index = headers.findIndex(h => h.includes(pattern.toLowerCase()));
    if (index !== -1 && values[index]) {
      return values[index];
    }
  }
  return null;
};

// Get next status in the application flow
export const getNextStatus = (currentStatus) => {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  if (currentIndex < STATUS_ORDER.length - 1) {
    return STATUS_ORDER[currentIndex + 1];
  }
  return currentStatus;
};

// Get previous status in the application flow
export const getPreviousStatus = (currentStatus) => {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  if (currentIndex > 0) {
    return STATUS_ORDER[currentIndex - 1];
  }
  return currentStatus;
};
