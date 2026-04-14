Unit Test Case 1 – Create New User Account (Automated)
Related Requirement: R1 – User can create an account

Objective:  
Verify that the backend API successfully creates a new user account when valid data is submitted.

Preconditions:
The user does not already exist in the database.
The backend API server is running.

Test Steps:
Send a POST request to /createUser with valid name, email, and password.
Wait for the API response.

Expected Result:
API returns status code 201 Created.
The response body contains a confirmation message (e.g., “User created”).
New user records are stored in the database.

Unit Test Case 2 – Login With Valid Credentials (Automated)
Related Requirement: R2 – User can login and logout

Objective:  
Verify that a registered user can successfully log in using valid credentials.

Preconditions:
User accounts already exist in the database.
The backend API server is running.

Test Steps:
Send a POST request to /login with a valid email and password.
Wait for the API response.

Expected Result:
API returns status code 200 OK.
The response body contains a valid authentication token.
User session is created.

Unit Test Case 3 – Add New Internship Application (Automated)
Related Requirement: R3 – User can add a new internship application

Objective:  
Verify that the backend API successfully creates a new internship application when valid data is submitted.

Preconditions:
The user is logged in (valid token available).
The backend API server is running.

Test Steps:
Send a POST request to /applications with valid application data (company, role, status).
Wait for the API response.

Expected Result:
API returns status code 201 Created.
The response body contains the newly created application.
The application appears in the database and will display on the dashboard.

