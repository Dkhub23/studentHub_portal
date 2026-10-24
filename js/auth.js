/**
 * CHARUSAT Student Hub - Role-Based Access Control (RBAC) & Permission Guard
 * Enforces strict role validation between Admin, Faculty, and Student portals.
 * Grants exclusive Priority Rights to Administrator accounts for viewing student registries and history.
 */

const AuthGuard = (function () {
    const STORAGE_KEY_USER = "studentHubActiveUser";
    const STORAGE_KEY_ROLE = "userRole";
    const STORAGE_KEY_STUDENTS = "studentHubRegisteredStudents";

    // Initial Master Student Registry (Available with Priority clearance to Admin)
    const DEFAULT_STUDENTS_REGISTRY = [
        {
            id: 1,
            name: "Dhruvi Kakadia",
            enrollment: "23CE045",
            email: "23ce045@charusat.edu.in",
            course: "B.Tech CSE",
            gender: "Female",
            mobile: "9876543210",
            registeredAt: "12 Jul 2026, 10:30 AM",
            status: "Verified",
            history: [
                { timestamp: "12 Jul 2026, 10:30 AM", event: "Account Registration", detail: "Self-registered via CHARUSAT Student Hub Portal with verified OTP" },
                { timestamp: "14 Jul 2026, 02:15 PM", event: "Document Verification", detail: "HSC marksheets and GUJCET scorecard verified by Academic Section" },
                { timestamp: "20 Jul 2026, 09:00 AM", event: "Course Allocation", detail: "Enrolled in B.Tech Computer Engineering - Semester 3 Batch A" },
                { timestamp: "15 Aug 2026, 11:45 AM", event: "Fee Clearance & ID Issued", detail: "Semester tuition fees received; official RFID Smart Card issued" },
                { timestamp: "01 Oct 2026, 04:00 PM", event: "Mid-Term Exam Registration", detail: "Eligible with 92% attendance standing in Data Structures & OOP" }
            ]
        },
        {
            id: 2,
            name: "Rudra Patel",
            enrollment: "23IT012",
            email: "rudra.patel@charusat.edu.in",
            course: "B.Tech IT",
            gender: "Male",
            mobile: "9823456781",
            registeredAt: "14 Jul 2026, 11:20 AM",
            status: "Verified",
            history: [
                { timestamp: "14 Jul 2026, 11:20 AM", event: "Account Registration", detail: "Self-registered via Student Hub Portal" },
                { timestamp: "16 Jul 2026, 10:00 AM", event: "Academic Verification", detail: "Verified by Information Technology Department" },
                { timestamp: "22 Jul 2026, 01:30 PM", event: "Lab Allotment", detail: "Allocated to High-Performance Computing Lab 304" }
            ]
        },
        {
            id: 3,
            name: "Aarav Shah",
            enrollment: "22CE088",
            email: "aarav.shah@charusat.edu.in",
            course: "B.Tech CE",
            gender: "Male",
            mobile: "9876123450",
            registeredAt: "18 Jul 2026, 04:00 PM",
            status: "Verified",
            history: [
                { timestamp: "18 Jul 2026, 04:00 PM", event: "Account Registration", detail: "Registered with institutional email" },
                { timestamp: "21 Jul 2026, 09:30 AM", event: "Semester Progression", detail: "Promoted to Semester 5 Computer Engineering" }
            ]
        },
        {
            id: 4,
            name: "Diya Mehta",
            enrollment: "23CSE054",
            email: "diya.mehta@charusat.edu.in",
            course: "B.Tech CSE",
            gender: "Female",
            mobile: "9812345679",
            registeredAt: "21 Jul 2026, 02:30 PM",
            status: "Verified",
            history: [
                { timestamp: "21 Jul 2026, 02:30 PM", event: "Account Registration", detail: "Self-registered via Portal" },
                { timestamp: "24 Jul 2026, 11:15 AM", event: "Merit Scholarship Approval", detail: "Awarded CHARUSAT Merit-cum-Means Academic Scholarship" }
            ]
        },
        {
            id: 5,
            name: "Krish Joshi",
            enrollment: "24AIML008",
            email: "krish.aiml@charusat.edu.in",
            course: "B.Tech CSE",
            gender: "Male",
            mobile: "9765432109",
            registeredAt: "05 Aug 2026, 09:45 AM",
            status: "Active",
            history: [
                { timestamp: "05 Aug 2026, 09:45 AM", event: "Account Registration", detail: "First-year admission registration completed" },
                { timestamp: "08 Aug 2026, 03:00 PM", event: "Orientation Attendance", detail: "Attended CSPIT Central Induction program" }
            ]
        }
    ];

    /**
     * Retrieve the currently logged-in user profile
     */
    function getCurrentUser() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_USER);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    }

    /**
     * Retrieve the active user's role: 'admin' | 'faculty' | 'student' | null
     */
    function getUserRole() {
        const user = getCurrentUser();
        if (user && user.role) {
            return user.role.toLowerCase();
        }
        const fallbackRole = localStorage.getItem(STORAGE_KEY_ROLE);
        return fallbackRole ? fallbackRole.toLowerCase() : null;
    }

    /**
     * Clear active session and log out
     */
    function logout() {
        localStorage.removeItem(STORAGE_KEY_USER);
        localStorage.removeItem(STORAGE_KEY_ROLE);
        window.location.href = "login.html";
    }

    /**
     * Seed default students registry into localStorage if not present
     */
    function initStudentsRegistry() {
        if (!localStorage.getItem(STORAGE_KEY_STUDENTS)) {
            localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(DEFAULT_STUDENTS_REGISTRY));
        }
    }

    /**
     * ENFORCE PAGE ACCESS CONTROL
     * If the current user does not have permission for the page, display a blocking error modal.
     * 
     * @param {Array<string>} allowedRoles List of roles permitted to view the page (e.g. ['admin'] or ['student'])
     * @param {string} pageTitle Name of the protected portal
     */
    function enforcePageAccess(allowedRoles, pageTitle) {
        initStudentsRegistry();

        const currentUser = getCurrentUser();
        const currentRole = getUserRole();

        // 1. Unauthenticated User (Not logged in)
        if (!currentUser || !currentRole) {
            showAccessDeniedModal({
                errorType: "UNAUTHENTICATED",
                title: "🔒 Authentication Required",
                message: `You must sign in with an authorized CHARUSAT account to access the <strong>${pageTitle}</strong>.`,
                currentRole: "Guest / Not Logged In",
                allowedRoles: allowedRoles,
                suggestedActionText: "Go to Login Portal",
                suggestedActionUrl: "login.html?role=" + (allowedRoles[0] || "student")
            });
            return false;
        }

        // 2. Role Not Permitted
        if (!allowedRoles.map(r => r.toLowerCase()).includes(currentRole)) {
            let specificTitle = "⛔ Access Denied: Role Not Permitted";
            let specificMessage = "";

            if (currentRole === "student" && allowedRoles.includes("admin")) {
                specificTitle = "⛔ Access Denied: Student Prohibited from Admin Dashboard";
                specificMessage = `You are currently logged in as a <strong>Student</strong> (${currentUser.displayName || currentUser.username}). Students <strong>do not have permission</strong> to view or manage the University Administrator Console.`;
            } else if (currentRole === "admin" && allowedRoles.includes("student")) {
                specificTitle = "⛔ Access Restricted: Administrator Cannot Enter Student Portal";
                specificMessage = `You are logged in with an <strong>Administrator</strong> account. To protect student academic evaluation integrity, Administrators cannot directly enter the Student Portal. Please use the <strong>Admin Dashboard</strong> to review student registries and history.`;
            } else if (currentRole === "faculty" && allowedRoles.includes("admin")) {
                specificTitle = "⛔ Access Denied: Faculty Cannot Enter Admin Console";
                specificMessage = `You are logged in as <strong>Faculty</strong> (${currentUser.displayName || currentUser.username}). Faculty members are not authorized to access Central Administrative operations.`;
            } else if (currentRole === "student" && allowedRoles.includes("faculty")) {
                specificTitle = "⛔ Access Denied: Faculty Portal Reserved for Teaching Staff";
                specificMessage = `You are logged in as a <strong>Student</strong>. The Faculty Portal is strictly restricted to university professors and teaching staff.`;
            } else {
                specificMessage = `Your current role <strong>${currentRole.toUpperCase()}</strong> does not possess the required clearance to access <strong>${pageTitle}</strong>.`;
            }

            // Determine user's legitimate dashboard URL
            let redirectUrl = "login.html";
            let redirectLabel = "Go to Login Page";
            if (currentRole === "student") {
                redirectUrl = "student.html";
                redirectLabel = "Return to Student Portal";
            } else if (currentRole === "faculty") {
                redirectUrl = "faculty.html";
                redirectLabel = "Return to Faculty Portal";
            } else if (currentRole === "admin") {
                redirectUrl = "admin.html";
                redirectLabel = "Return to Admin Console";
            }

            showAccessDeniedModal({
                errorType: "FORBIDDEN_ROLE",
                title: specificTitle,
                message: specificMessage,
                currentRole: currentRole.toUpperCase(),
                allowedRoles: allowedRoles.map(r => r.toUpperCase()),
                suggestedActionText: redirectLabel,
                suggestedActionUrl: redirectUrl
            });
            return false;
        }

        // 3. User is authorized: attach active header badge
        renderHeaderAuthStatus(currentUser);
        return true;
    }

    /**
     * Render the blocking Access Denied modal
     */
    function showAccessDeniedModal(config) {
        // Blur / Lock the underlying page content
        const container = document.querySelector(".container");
        if (container) {
            container.style.filter = "blur(6px) grayscale(50%)";
            container.style.pointerEvents = "none";
            container.style.userSelect = "none";
        }

        // Remove any existing modal
        const existing = document.getElementById("authAccessDeniedOverlay");
        if (existing) existing.remove();

        // Create overlay
        const overlay = document.createElement("div");
        overlay.id = "authAccessDeniedOverlay";
        overlay.className = "access-denied-overlay";
        overlay.setAttribute("role", "alertdialog");
        overlay.setAttribute("aria-modal", "true");

        overlay.innerHTML = `
            <div class="access-denied-card animate-pop">
                <div class="access-denied-header">
                    <div class="access-denied-icon-wrap">
                        <span class="access-denied-icon">⛔</span>
                    </div>
                    <span class="access-error-badge">403 UNAUTHORIZED ACCESS ATTEMPT</span>
                    <h3 class="access-denied-title">${config.title}</h3>
                </div>

                <div class="access-denied-body">
                    <p class="access-denied-desc">${config.message}</p>
                    
                    <div class="access-role-comparison">
                        <div class="role-compare-box current">
                            <span class="role-compare-label">Your Active Role:</span>
                            <span class="role-compare-val">● ${config.currentRole}</span>
                        </div>
                        <div class="role-compare-arrow">➔</div>
                        <div class="role-compare-box required">
                            <span class="role-compare-label">Required Role:</span>
                            <span class="role-compare-val">🔒 ${config.allowedRoles.join(" or ")}</span>
                        </div>
                    </div>
                </div>

                <div class="access-denied-footer">
                    <a href="${config.suggestedActionUrl}" class="access-btn primary">
                        ${config.suggestedActionText}
                    </a>
                    <a href="login.html" class="access-btn secondary">
                        🔄 Switch Account / Log In
                    </a>
                    <a href="index.html" class="access-btn tertiary">
                        🏠 CHARUSAT Home
                    </a>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.style.overflow = "hidden";
    }

    /**
     * Injects or updates an active user status indicator into the page header
     */
    function renderHeaderAuthStatus(user) {
        const header = document.querySelector(".header .header-wrapper");
        if (!header) return;

        let statusBox = document.getElementById("headerAuthStatusBox");
        if (!statusBox) {
            statusBox = document.createElement("div");
            statusBox.id = "headerAuthStatusBox";
            statusBox.className = "auth-status-pill";
            const actionsDiv = header.querySelector(".header-actions");
            if (actionsDiv) {
                header.insertBefore(statusBox, actionsDiv);
            } else {
                header.appendChild(statusBox);
            }
        }

        const roleIcon = user.role === "admin" ? "👑" : user.role === "faculty" ? "👨‍🏫" : "🎓";
        const roleName = user.role.toUpperCase();

        statusBox.innerHTML = `
            <span class="auth-role-tag ${user.role}">
                ${roleIcon} ${roleName}
            </span>
            <span class="auth-user-name" title="${user.username}">${user.displayName || user.username}</span>
            <button type="button" id="headerLogoutBtn" class="auth-logout-mini-btn" title="Sign out of ${roleName} session">
                Logout
            </button>
        `;

        const logoutBtn = document.getElementById("headerLogoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", logout);
        }
    }

    /**
     * =========================================================================
     * ADMIN PRIORITY DATA ACCESS: Master Student Registry & History
     * Strictly restricted: Faculty & Student roles are completely rejected.
     * =========================================================================
     */

    /**
     * Retrieve all registered students.
     * Enforces that requester MUST have 'admin' role.
     */
    function getAdminStudentRegistry() {
        const role = getUserRole();
        if (role !== "admin") {
            console.error("Access Denied: Priority clearance required to view master student registry.");
            return {
                authorized: false,
                error: "Insufficient permissions. Only University Administrators have priority rights to access student registration records.",
                data: []
            };
        }

        initStudentsRegistry();
        let registry = [];
        try {
            registry = JSON.parse(localStorage.getItem(STORAGE_KEY_STUDENTS)) || [];
        } catch (e) {
            registry = DEFAULT_STUDENTS_REGISTRY;
        }

        return {
            authorized: true,
            error: null,
            data: registry
        };
    }

    /**
     * Retrieve complete audit history of a specific student by enrollment number.
     * Strictly restricted to 'admin' role.
     */
    function getStudentAuditHistory(enrollmentNo) {
        const role = getUserRole();
        if (role !== "admin") {
            return {
                authorized: false,
                error: "Priority Violation: Faculty and Student accounts do not have permission to inspect student history logs.",
                student: null,
                history: []
            };
        }

        const res = getAdminStudentRegistry();
        if (!res.authorized) return res;

        const student = res.data.find(s => s.enrollment.toLowerCase() === enrollmentNo.toLowerCase());
        if (!student) {
            return {
                authorized: true,
                error: "Student record not found.",
                student: null,
                history: []
            };
        }

        return {
            authorized: true,
            error: null,
            student: student,
            history: student.history || []
        };
    }

    /**
     * Add a newly registered student and create their history trail
     */
    function recordNewStudentRegistration(studentData) {
        initStudentsRegistry();
        let list = [];
        try {
            list = JSON.parse(localStorage.getItem(STORAGE_KEY_STUDENTS)) || [];
        } catch (e) {
            list = [];
        }

        const now = new Date().toLocaleString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

        const newStudent = {
            id: list.length + 1,
            name: studentData.name,
            enrollment: studentData.enrollment,
            email: studentData.email,
            course: studentData.course || "B.Tech CSE",
            gender: studentData.gender || "Other",
            dob: studentData.dob || "",
            mobile: studentData.mobile || "",
            registeredAt: now,
            status: "Verified",
            history: [
                {
                    timestamp: now,
                    event: "Student Registration Submitted",
                    detail: "Online self-registration completed through Student Hub Portal"
                },
                {
                    timestamp: now,
                    event: "Identity & Credential Check",
                    detail: `Enrollment ID (${studentData.enrollment}) and email (${studentData.email}) verified`
                },
                {
                    timestamp: now,
                    event: "Academic Program Assigned",
                    detail: `Allocated to ${studentData.course || 'B.Tech'} curriculum`
                }
            ]
        };

        // Add to top of list
        list.unshift(newStudent);
        localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(list));
        return newStudent;
    }

    // Auto-mount header auth status pill on any page if user is logged in
    document.addEventListener("DOMContentLoaded", function () {
        initStudentsRegistry();
        const user = getCurrentUser();
        if (user && user.role) {
            renderHeaderAuthStatus(user);
        }
    });

    // Public API
    return {
        getCurrentUser: getCurrentUser,
        getUserRole: getUserRole,
        enforcePageAccess: enforcePageAccess,
        logout: logout,
        getAdminStudentRegistry: getAdminStudentRegistry,
        getStudentAuditHistory: getStudentAuditHistory,
        recordNewStudentRegistration: recordNewStudentRegistration
    };
})();

// Attach to window
window.AuthGuard = AuthGuard;
