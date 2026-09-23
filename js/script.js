document.addEventListener("DOMContentLoaded", function () {
    // Highlight current active navigation tab
    const currentPath = window.location.pathname.split("/").pop().split("?")[0].split("#")[0] || "index.html";
    document.querySelectorAll(".nav a").forEach(function (link) {
        const href = link.getAttribute("href");
        if (href === currentPath || (currentPath === "" && href === "index.html")) {
            link.classList.add("active");
        }
    });

    // Assignment Page handling
    const assignmentButton = document.getElementById("saveAssignments");
    if (assignmentButton) {
        const assignmentStatus = document.getElementById("assignmentStatus");
        const assignmentRows = Array.from(document.querySelectorAll(".assignment-row"));
        const savedAssignments = JSON.parse(localStorage.getItem("studentHubAssignments") || "[]");
        savedAssignments.forEach(function (item, index) {
            if (!assignmentRows[index]) return;
            const textInput = assignmentRows[index].querySelector("input[type='text']");
            const select = assignmentRows[index].querySelector("select");
            const dateInput = assignmentRows[index].querySelector("input[type='date']");
            if (textInput && item.subject) textInput.value = item.subject;
            if (select && item.status) select.value = item.status;
            if (dateInput && item.deadline) dateInput.value = item.deadline;
        });
        assignmentButton.addEventListener("click", function () {
            const assignments = assignmentRows.map(function (row) {
                return {
                    subject: (row.querySelector("input[type='text']")?.value || "").trim(),
                    status: row.querySelector("select")?.value || "pending",
                    deadline: row.querySelector("input[type='date']")?.value || ""
                };
            });
            localStorage.setItem("studentHubAssignments", JSON.stringify(assignments));
            if (assignmentStatus) {
                assignmentStatus.textContent = "✓ Assignments saved successfully on this device.";
                assignmentStatus.style.color = "var(--success, #10b981)";
                assignmentStatus.style.fontWeight = "600";
            }
        });
    }

    // Registration Form Validation handling
    const form = document.getElementById("RegistrationForm");
    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = form.elements["name"] ? form.elements["name"].value.trim() : "";
        const enrollment = form.elements["enrollment"] ? form.elements["enrollment"].value.trim() : "";
        const email = form.elements["email"] ? form.elements["email"].value.trim() : "";
        const password = form.elements["password"] ? form.elements["password"].value : "";
        const confirmPassword = form.elements["confirm"] ? form.elements["confirm"].value : "";
        const gender = form.querySelector('input[name="gender"]:checked');
        const dob = form.elements["dob"] ? form.elements["dob"].value : "";
        const mobile = form.elements["mobile"] ? form.elements["mobile"].value.trim() : "";

        const nameError = document.getElementById("nameError");
        const enrollmentError = document.getElementById("enrollmentError");
        const emailError = document.getElementById("emailError");
        const passwordError = document.getElementById("passwordError");

        if (nameError) nameError.textContent = "";
        if (enrollmentError) enrollmentError.textContent = "";
        if (emailError) emailError.textContent = "";
        if (passwordError) passwordError.textContent = "";

        form.querySelectorAll(".field-error").forEach(function (el) { el.remove(); });

        let isValid = true;

        const namePattern = /^[A-Za-z ]+$/;
        if (name === "") {
            if (nameError) nameError.textContent = "Name is required";
            isValid = false;
        } else if (!namePattern.test(name)) {
            if (nameError) nameError.textContent = "Name should contain only letters";
            isValid = false;
        }

        const enrollmentPattern = /^[A-Za-z0-9]+$/;
        if (enrollment === "") {
            if (enrollmentError) enrollmentError.textContent = "Enrollment number is required";
            isValid = false;
        } else if (!enrollmentPattern.test(enrollment)) {
            if (enrollmentError) enrollmentError.textContent = "Invalid enrollment number";
            isValid = false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === "") {
            if (emailError) emailError.textContent = "Email is required";
            isValid = false;
        } else if (!emailPattern.test(email)) {
            if (emailError) emailError.textContent = "Enter a valid email";
            isValid = false;
        }

        if (password === "") {
            if (passwordError) passwordError.textContent = "Password is required";
            isValid = false;
        } else if (password.length < 6) {
            if (passwordError) passwordError.textContent = "Password must contain at least 6 characters";
            isValid = false;
        } else if (password !== confirmPassword) {
            if (passwordError) passwordError.textContent = "Passwords do not match";
            isValid = false;
        }

        if (!gender) {
            const genderElem = document.getElementById("gender");
            if (genderElem) {
                genderElem.insertAdjacentHTML("afterend", '<span class="field-error">Please select your gender.</span>');
            }
            isValid = false;
        }

        if (dob === "") {
            const dobElem = document.getElementById("dob");
            if (dobElem) {
                dobElem.insertAdjacentHTML("afterend", '<span class="field-error">Please select your date of birth.</span>');
            }
            isValid = false;
        }

        const mobilePattern = /^[0-9]{10}$/;
        if (mobile !== "" && !mobilePattern.test(mobile)) {
            const mobileElem = document.getElementById("mobilenumber");
            if (mobileElem) {
                mobileElem.insertAdjacentHTML("afterend", '<span class="field-error">Enter a valid 10-digit mobile number.</span>');
            }
            isValid = false;
        }

        if (isValid) {
            const courseVal = form.elements["course"] ? form.elements["course"].value : "";
            localStorage.setItem("studentHubUser", JSON.stringify({
                name: name,
                enrollment: enrollment,
                email: email,
                course: courseVal
            }));
            window.location.href = "login.html";
        }
    });

    form.addEventListener("reset", function () {
        form.querySelectorAll(".field-error").forEach(function (error) { error.remove(); });
        ["nameError", "enrollmentError", "emailError", "passwordError"].forEach(function (id) {
            const el = document.getElementById(id);
            if (el) el.textContent = "";
        });
    });
});