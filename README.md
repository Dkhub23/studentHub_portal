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

## Setup

### Browser demo

The HTML pages and role-based demo use browser `localStorage`.

1. From the project folder, start a local web server. For example, with Python:
   `python -m http.server 8000`
2. Open `http://localhost:8000/` and choose a page from the navigation.
3. Keep using the same browser profile and localhost address so the demo can
   access the same saved data. Opening the HTML files directly with `file://`
   may prevent browser storage from working correctly.

### PHP and MySQL dashboard

Requirements: PHP 8+ with PDO MySQL enabled, and MySQL 8+.

1. Start MySQL and import either `studenthub.sql` or `schema.sql` (both create
   the `studenthub` database and development sample records). For example:
   `mysql -u root -p < studenthub.sql`
2. Configure `STUDENTHUB_DB_HOST`, `STUDENTHUB_DB_NAME`, `STUDENTHUB_DB_USER`,
   and `STUDENTHUB_DB_PASS` for your PHP environment. Defaults are
   `127.0.0.1`, `studenthub`, `root`, and an empty password.
3. Start the PHP development server from the project folder:
   `php -S 127.0.0.1:8000`
4. Open `http://127.0.0.1:8000/login.php`.

Development credentials: `admin@charusat.edu.in` / `admin123` and
`aarav@charusat.edu.in` / `student123`. Change these credentials before
deployment.

## Testing the portal

Use these manual checks after setup:

### Browser demo

- Visit Home, Courses, Faculty, Attendance, Assignment, Notice, Profile, and
  Contact pages; check that navigation and layout work at desktop and mobile
  widths.
- Register a demo student. Try submitting with missing required fields and
  with duplicate enrollment, email, or phone values; confirm invalid entries
  are rejected.
- Sign in under the available demo roles and check that role-specific pages
  and menus appear. Save an attendance or assignment update, reload the page,
  and confirm it persists in the same browser.
- As faculty, check saved student activity and publish or edit a notice. As
  admin, check notice and student management and the activity log. Confirm
  students can view published notices without editing them.
- Submit a valid contact form and confirm the success message appears and the
  entry is added to `contact_messages.json`.

### PHP/MySQL dashboard

- Sign in at `login.php` with the sample admin account. Confirm `dashboard.php`
  shows the user, student, and event counts, registrations, and recent audit
  activity.
- Sign out and verify the dashboard redirects to login for an unauthenticated
  visitor. Sign in as the sample student and confirm admin-only access is
  denied.
- After successful login, dashboard visit, and logout, confirm corresponding
  entries are present in the `audit_logs` table.

The browser demo stores its records in `localStorage`; it is separate from the
PHP/MySQL dashboard and does not synchronize between browsers or devices.

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

1. Import `studenthub.sql` or `schema.sql` into MySQL. It creates the `studenthub` database and
   sample development accounts/data.
2. Configure `STUDENTHUB_DB_HOST`, `STUDENTHUB_DB_NAME`, `STUDENTHUB_DB_USER`,
   and `STUDENTHUB_DB_PASS` in the PHP server environment. Defaults are local
   MySQL `studenthub` / `root` with an empty password.
3. Serve the project through PHP (for example, `php -S 127.0.0.1:8000`) and
   open `http://127.0.0.1:8000/login.php`.
4. Use the development credentials above. Replace these accounts/passwords
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
