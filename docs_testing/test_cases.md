TC1 – Create New User Account (R1)
Objective: Verify that a new user can successfully create an account.

Preconditions:
The user is not already registered in the system.

Test Steps:
Navigate to the “Create Account” page.
Enter a valid name, email address, and password.
Click the “Create Account” button.

Expected Result:
A new account is created.
User information is stored in the database.
The user is redirected to the dashboard.

TC2 – Login With Valid Credentials (R2)
Objective: Verify that a registered user can log in.

Preconditions:
User accounts already exist in the database.

Test Steps:
Navigate to the login page.
Enter a valid email and password.
Click the “Login” button.

Expected Result:
The user is authenticated.
Dashboard loads successfully.

TC3 – Add New Internship Application (R3)
Objective: Verify that a user can add a new internship application.

Preconditions:
The user is logged in.

Test Steps:
Open the “Add Application” form.
Enter company name, role, date, and notes.
Submit the form.

Expected Result:
Application appears on the dashboard.
Application is stored in the database.

TC4 – Update Application Status (R4)
Objective: Verify that a user can update the status of an application.

Preconditions:
Application exists in the system.

Test Steps:
Open the application details.
Select a new status (e.g., Interview, Offer, Rejected).
Save the update.

Expected Result:
Updated status is displayed on the dashboard.
Status change is saved in the database.

TC5 – Delete Application (R5)
Objective: Verify that a user can delete an application.

Preconditions:
Application exists in the system.

Test Steps:
Click the “Delete” button on an application.
Confirm the deletion.

Expected Result:
Application is removed from the dashboard.
Application is deleted from the database.

TC6 – Edit Application Details (R6)
Objective: Verify that a user can edit an existing application.

Preconditions:
Application exists in the system.

Test Steps:
Open the application.
Modify one or more fields.
Save the changes.

Expected Result:
Updated details appear on the dashboard.
Changes are saved in the database.

TC7 – Modify or Delete Existing Application (R7)
Objective: Verify that a user can edit or delete an existing application.

Preconditions:
Application exists in the system.

Test Steps:
Open the application.
Choose to edit or delete.
Save or confirm the action.

Expected Result:
Edits or deletion are reflected on the dashboard.

TC8 – Dashboard Displays All Applications (R8)
Objective: Verify that the dashboard displays all applications.

Preconditions:
User has one or more applications.

Test Steps:
Log in.
Navigate to the dashboard.

Expected Result:
All applications are displayed correctly.

TC9 – Sort Applications (R9)
Objective: Verify that applications can be sorted by keyword or date.

Preconditions:
Multiple applications exist with different dates or keywords.

Test Steps:
Click the “Sort by Date” or “Sort by Keyword” option.

Expected Result:
Applications reorder correctly based on the selected sort option.

TC10 – Add Deadline (R10)
Objective: Verify that a user can add a deadline to an application.

Preconditions:
Application exists in the system.

Test Steps:
Open the application.
Add a deadline date.
Save the update.

Expected Result:
The deadline appears on the dashboard.
The deadline is stored in the database.

TC11 – View Job Description (R11)
Objective: Verify that a user can view job details.

Preconditions:
Job description exists in the database.

Test Steps:
Click on an application’s job details link.

Expected Result:
Job description loads and displays correctly.

