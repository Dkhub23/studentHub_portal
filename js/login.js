/**
 * CHARUSAT Student Hub - Role-Based Authentication Controller
 * Handles role switching, dynamic credential fields, quick-fill demos, and role-based page routing.
 */

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const usernameLabel = document.getElementById("usernameLabel");
    const roleRadioButtons = document.querySelectorAll('input[name="role"]');
    // Support both old (.role-card-option) and new (.role-tab) class names
    const roleCardOptions = document.querySelectorAll(".role-card-option, .role-tab");
    const roleIndicator = document.getElementById("activeRoleIndicator");
    const submitBtn = document.getElementById("submitLoginBtn");
    const alertBox = document.getElementById("loginAlert");
    const togglePasswordBtn = document.getElementById("togglePasswordBtn");
    const demoChips = document.querySelectorAll(".demo-chip-btn");

    // Role Configuration Mapping
    const roleConfig = {
        student: {
            title: "Student",
            icon: "🎓",
            fieldLabel: "Student ID / Enrollment No.:",
            placeholder: "e.g. 23CE045 or student@charusat.edu.in",
            redirectUrl: "profile.html",
            buttonText: "Sign In as Student →",
            indicatorText: "🎓 Logging in to Student Portal (Courses, Attendance, Results)",
            defaultDemo: {
                user: "23CE045",
                pass: "student123",
                displayName: "Dhruvi Kakadia"
            }
        },
        faculty: {
            title: "Faculty",
            icon: "👨‍🏫",
            fieldLabel: "Faculty ID / University Email:",
            placeholder: "e.g. amitthakkar.it@charusat.ac.in",
            redirectUrl: "profile.html",
            buttonText: "Sign In as Faculty →",
            indicatorText: "👨‍🏫 Logging in to Faculty Portal (Faculty Directory, Attendance, Grading)",
            defaultDemo: {
                user: "amitthakkar.it@charusat.ac.in",
                pass: "faculty123",
                displayName: "Prof. Amit Thakkar"
            }
        },
        admin: {
            title: "Administrator",
            icon: "👑",
            fieldLabel: "Admin Username / Official ID:",
            placeholder: "e.g. admin@charusat.ac.in",
            redirectUrl: "admin.html",
            buttonText: "Sign In as Administrator →",
            indicatorText: "👑 Logging in to University Admin Portal (Management & Analytics)",
            defaultDemo: {
                user: "admin@charusat.ac.in",
                pass: "admin123",
                displayName: "CHARUSAT Admin Authority"
            }
        }
    };

    /**
     * Set the active role and update UI inputs, placeholders, and buttons
     */
    function setRole(roleKey) {
        if (!roleConfig[roleKey]) {
            roleKey = "student";
        }

        const config = roleConfig[roleKey];

        // 1. Sync radio inputs
        roleRadioButtons.forEach(function (radio) {
            radio.checked = radio.value === roleKey;
        });

        // 2. Sync visual cards
        roleCardOptions.forEach(function (card) {
            if (card.getAttribute("data-role") === roleKey) {
                card.classList.add("active");
                card.setAttribute("aria-selected", "true");
            } else {
                card.classList.remove("active");
                card.setAttribute("aria-selected", "false");
            }
        });

        // 3. Update dynamic fields
        if (usernameLabel) {
            usernameLabel.textContent = config.fieldLabel;
        }
        if (usernameInput) {
            usernameInput.placeholder = config.placeholder;
        }
        if (roleIndicator) {
            roleIndicator.innerHTML = `${config.icon} <strong>${config.title}</strong> — Logging in to ${config.title} Portal`;
        }
        if (submitBtn) {
            // Support both input[type=submit] and button
            if (submitBtn.tagName === "BUTTON") {
                submitBtn.textContent = config.buttonText;
            } else {
                submitBtn.value = config.buttonText;
            }
        }

        // Hide alert if visible
        hideAlert();
    }

    /**
     * Helper to show feedback alerts
     */
    function showAlert(message, isError) {
        if (!alertBox) return;
        alertBox.className = "login-alert show " + (isError ? "login-alert-error" : "login-alert-success");
        alertBox.innerHTML = (isError ? "⚠️ " : "✅ ") + message;
    }

    function hideAlert() {
        if (!alertBox) return;
        alertBox.className = "login-alert";
        alertBox.textContent = "";
    }

    // Role Card click listeners
    roleCardOptions.forEach(function (card) {
        card.addEventListener("click", function () {
            const role = this.getAttribute("data-role");
            setRole(role);
        });
    });

    // Radio change listeners
    roleRadioButtons.forEach(function (radio) {
        radio.addEventListener("change", function () {
            if (this.checked) {
                setRole(this.value);
            }
        });
    });

    // Quick-Fill Demo Chips
    demoChips.forEach(function (chip) {
        chip.addEventListener("click", function () {
            const targetRole = this.getAttribute("data-demo-role");
            if (roleConfig[targetRole]) {
                setRole(targetRole);
                const creds = roleConfig[targetRole].defaultDemo;
                if (usernameInput) usernameInput.value = creds.user;
                if (passwordInput) passwordInput.value = creds.pass;
                showAlert(`Filled credentials for ${roleConfig[targetRole].title}. Click Login to enter!`, false);
                if (submitBtn) submitBtn.focus();
            }
        });
    });

    // Password Toggle Show/Hide
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener("click", function () {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                togglePasswordBtn.textContent = "🙈";
                togglePasswordBtn.setAttribute("title", "Hide Password");
            } else {
                passwordInput.type = "password";
                togglePasswordBtn.textContent = "👁️";
                togglePasswordBtn.setAttribute("title", "Show Password");
            }
        });
    }

    // Read initial role from URL query param (e.g. login.html?role=faculty or login.html?role=admin)
    const urlParams = new URLSearchParams(window.location.search);
    const initialRole = urlParams.get("role") || "student";
    setRole(initialRole);

    // Form Submission & Role-Based Routing
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const selectedRadio = document.querySelector('input[name="role"]:checked');
            const role = selectedRadio ? selectedRadio.value : "student";
            const config = roleConfig[role] || roleConfig.student;

            const username = usernameInput ? usernameInput.value.trim() : "";
            const password = passwordInput ? passwordInput.value.trim() : "";

            if (!username) {
                showAlert(`Please enter your ${config.fieldLabel.replace(':', '')}`, true);
                if (usernameInput) usernameInput.focus();
                return;
            }

            if (!password) {
                showAlert("Please enter your password", true);
                if (passwordInput) passwordInput.focus();
                return;
            }

            // Determine display name
            let displayName = username;
            if (config.defaultDemo && username === config.defaultDemo.user) {
                displayName = config.defaultDemo.displayName;
            }

            // Save active session to localStorage
            const sessionData = {
                username: username,
                role: role,
                displayName: displayName,
                loginTime: new Date().toLocaleString(),
                isLoggedIn: true
            };
            localStorage.setItem("studentHubActiveUser", JSON.stringify(sessionData));
            localStorage.setItem("userRole", role);
            if (window.AuthGuard) AuthGuard.logActivity("login", config.redirectUrl);

            // Animated feedback
            showAlert(`Welcome, <strong>${displayName}</strong>! Authenticated as <strong>${config.title}</strong>. Redirecting to your dashboard...`, false);
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.value = `Redirecting to ${config.title} Portal...`;
            }

            // Execute redirection based on selected role
            setTimeout(function () {
                window.location.href = config.redirectUrl;
            }, 650);
        });

        // Reset Handler
        loginForm.addEventListener("reset", function () {
            setTimeout(function () {
                setRole("student");
                hideAlert();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.value = roleConfig.student.buttonText;
                }
            }, 50);
        });
    }
});
