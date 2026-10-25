# Student Hub Portal

A simple and beautiful student management website built with basic HTML and CSS.

## Project Overview
Student Hub Portal is a student-friendly web interface for managing:
- student login and registration
- faculty information
- course details
- attendance tracking
- assignments
- notices
- student profile
- admin dashboard
- contact page

## Features
- Clean and modern blue-and-white design
- Easy-to-understand layout
- Responsive page structure
- Simple navigation between pages
- Basic forms and content sections

## Project Structure
- index.html - Home page
- login.html - Login page
- register.html - Registration page
- student.html - Student page
- faculty.html - Faculty page
- courses.html - Courses page
- attendance.html - Attendance calculator page
- assignment.html - Assignment tracker page
- notice.html - Notice page
- profile.html - Student profile page
- admin.html - Admin dashboard page
- contact.html - Contact page
- css/style.css - Main stylesheet

## How to Run
1. Open the project folder in your browser.
2. Start with index.html.
3. Click through the pages to explore the website.

## Technologies Used
- HTML5
- CSS3
- PHP 8+ (server-side admin dashboard and session RBAC)
- MySQL 8+
- Bootstrap 5.3

## PHP Admin Dashboard (MySQL)

The server-side dashboard is available at `dashboard.php`. It reads live counts
from `users`, `students`, and `events`, displays recent registrations and audit
activity, and returns HTTP 403 to authenticated non-admin users.

1. Import `schema.sql` into MySQL. It creates the `studenthub` database and
   sample development accounts/data.
2. Configure `STUDENTHUB_DB_HOST`, `STUDENTHUB_DB_NAME`, `STUDENTHUB_DB_USER`,
   and `STUDENTHUB_DB_PASS` in the PHP server environment. Defaults are local
   MySQL `studenthub` / `root` with an empty password.
3. Serve the project through PHP (for example, `php -S 127.0.0.1:8000`) and
   open `http://127.0.0.1:8000/login.php`.
4. Development credentials: `admin@charusat.edu.in` / `admin123` and
   `aarav@charusat.edu.in` / `student123`. Replace these accounts/passwords
   before deployment.

Successful login, dashboard views, and logout write to `audit_logs`. The
administrator dashboard also displays the latest audit rows. PHP login state is
stored in a secure, HTTP-only session cookie; role checks run on the server.

### Role menus and student activity (HTML demo)

The HTML demo login provides role-specific menus. Students can save their own
assignment status and attendance; faculty can view the saved submissions and
attendance records and publish/edit notices. Admins can also manage notices,
edit or delete student registry records, and duplicate enrollment, email, and phone
values are rejected by the demo registration form. Admins can
review login, logout, page-visit, assignment, attendance, and notice activity,
and clear the activity list. Students see published notices as read-only on
their dashboard. These demo records use
the browser's `localStorage`, so serve the project at one localhost URL and use
the same browser profile to share records between role logins. This browser
storage demo is separate from the PHP/MySQL dashboard and does not synchronize
across different devices or browsers.

## Author
Dhruvi Kakadia
