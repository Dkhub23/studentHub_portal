document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("RegistrationForm");

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = form.elements["name"].value.trim();
        const enrollment = form.elements["enrollment"].value.trim();
        const email = form.elements["email"].value.trim();
        const password = form.elements["password"].value;
        const confirmPassword = form.elements["confirm"].value;
        const gender = form.elements["gender"].value;
        const dob = form.elements["dob"].value;
        const course = form.elements["course"].value;
        const mobile = form.elements["mobile"].value.trim();

        const nameError = document.getElementById("nameError");
        const enrollmentError = document.getElementById("enrollmentError");
        const emailError = document.getElementById("emailError");
        const passwordError = document.getElementById("passwordError");

        nameError.textContent = "";
        enrollmentError.textContent = "";
        emailError.textContent = "";
        passwordError.textContent = "";

        let isValid = true;

        const namePattern = /^[A-Za-z ]+$/;

        if (name === "") {
            nameError.textContent = "Name is required";
            isValid = false;
        }
        else if (!namePattern.test(name)) {
            nameError.textContent = "Name should contain only letters";
            isValid = false;
        }

        const enrollmentPattern = /^[A-Za-z0-9]+$/;

        if (enrollment === "") {
            enrollmentError.textContent = "Enrollment number is required";
            isValid = false;
        }
        else if (!enrollmentPattern.test(enrollment)) {
            enrollmentError.textContent = "Invalid enrollment number";
            isValid = false;
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email === "") {
            emailError.textContent = "Email is required";
            isValid = false;
        }
        else if (!emailPattern.test(email)) {
            emailError.textContent = "Enter a valid email";
            isValid = false;
        }
        if (password === "") {
            passwordError.textContent = "Password is required";
            isValid = false;
        }
        else if (password.length < 6) {
            passwordError.textContent =
                "Password must contain at least 6 characters";
            isValid = false;
        }
        else if (password !== confirmPassword) {
            passwordError.textContent =
                "Passwords do not match";
            isValid = false;
        }

        if (gender === "") {
            alert("Please select your gender.");
            isValid = false;
        }


        if (dob === "") {
            alert("Please select your date of birth.");
            isValid = false;
        }
        const mobilePattern = /^[0-9]{10}$/;

        if (mobile !== "" && !mobilePattern.test(mobile)) {
            alert("Mobile number must contain exactly 10 digits.");
            isValid = false;
        }

        if (isValid) {

            alert("Registration successful! 🎉");

            // Redirect to login page
            window.location.href = "login.html";
        }

    });

    form.addEventListener("reset", function () {

        document.getElementById("nameError").textContent = "";
        document.getElementById("enrollmentError").textContent = "";
        document.getElementById("emailError").textContent = "";
        document.getElementById("passwordError").textContent = "";

    });

});