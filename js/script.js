document.addEventListener("DOMContentLoaded", function () {
    // ==========================================
    // 1. ACTIVE NAVIGATION TAB HIGHLIGHT
    // ==========================================
    const currentPath = window.location.pathname.split("/").pop().split("?")[0].split("#")[0] || "index.html";
    document.querySelectorAll(".nav a").forEach(function (link) {
        const href = link.getAttribute("href");
        if (href === currentPath || (currentPath === "" && href === "index.html")) {
            link.classList.add("active");
        }
    });

    // ==========================================
    // 2. LIGHT / DARK THEME TOGGLE
    // Auto-enhance header with actions if not present
    const header = document.querySelector(".header");
    if (header && !header.querySelector(".header-actions")) {
        const headerTitle = header.querySelector("h1");
        const headerDesc = header.querySelector("p");
        if (headerTitle) {
            const wrapper = document.createElement("div");
            wrapper.className = "header-wrapper";
            
            const textDiv = document.createElement("div");
            if (headerTitle) textDiv.appendChild(headerTitle);
            if (headerDesc) textDiv.appendChild(headerDesc);
            wrapper.appendChild(textDiv);

            const actionsDiv = document.createElement("div");
            actionsDiv.className = "header-actions";
            actionsDiv.innerHTML = `
                <button class="theme-toggle-btn" type="button" aria-label="Toggle theme">
                    <span class="theme-icon">🌙</span>
                    <span class="theme-label">Dark Mode</span>
                </button>
                <button class="hamburger-btn" type="button" aria-label="Toggle Navigation Menu">
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                </button>
            `;
            wrapper.appendChild(actionsDiv);
            header.innerHTML = "";
            header.appendChild(wrapper);
        }
    }

    // ==========================================
    // 2. LIGHT / DARK THEME TOGGLE
    // ==========================================
    const savedTheme = localStorage.getItem("studentHubTheme") || 
        (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    
    document.documentElement.setAttribute("data-theme", savedTheme);

    function updateThemeToggleButtons(theme) {
        document.querySelectorAll(".theme-toggle-btn").forEach(function (btn) {
            const icon = btn.querySelector(".theme-icon");
            const label = btn.querySelector(".theme-label");
            if (theme === "dark") {
                if (icon) icon.textContent = "☀️";
                if (label) label.textContent = "Light Mode";
                btn.setAttribute("title", "Switch to Light Theme");
            } else {
                if (icon) icon.textContent = "🌙";
                if (label) label.textContent = "Dark Mode";
                btn.setAttribute("title", "Switch to Dark Theme");
            }
        });
    }

    updateThemeToggleButtons(savedTheme);

    function toggleTheme() {
        const current = document.documentElement.getAttribute("data-theme") || "light";
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("studentHubTheme", next);
        updateThemeToggleButtons(next);
    }

    document.querySelectorAll(".theme-toggle-btn").forEach(function (btn) {
        btn.addEventListener("click", toggleTheme);
    });

    // ==========================================
    // 3. HAMBURGER MENU & MOBILE DRAWER
    // ==========================================
    const hamburgerBtns = document.querySelectorAll(".hamburger-btn");
    const navMenu = document.querySelector(".nav");
    
    let backdrop = document.querySelector(".nav-backdrop");
    if (!backdrop && navMenu) {
        backdrop = document.createElement("div");
        backdrop.className = "nav-backdrop";
        document.body.appendChild(backdrop);
    }

    function toggleHamburger(open) {
        const isOpen = open !== undefined ? open : (navMenu && !navMenu.classList.contains("nav-open"));
        if (navMenu) navMenu.classList.toggle("nav-open", isOpen);
        hamburgerBtns.forEach(function (btn) { btn.classList.toggle("active", isOpen); });
        if (backdrop) backdrop.classList.toggle("active", isOpen);
        document.body.style.overflow = isOpen && window.innerWidth <= 860 ? "hidden" : "";
    }

    hamburgerBtns.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            toggleHamburger();
        });
    });

    if (backdrop) {
        backdrop.addEventListener("click", function () {
            toggleHamburger(false);
        });
    }

    if (navMenu) {
        navMenu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                if (window.innerWidth <= 860) {
                    toggleHamburger(false);
                }
            });
        });
    }

    // ==========================================
    // 4. NOTIFICATION BANNER
    // ==========================================
    const notificationBanner = document.getElementById("notificationBanner");
    const bannerCloseBtn = document.getElementById("closeBannerBtn");

    if (notificationBanner && bannerCloseBtn) {
        if (sessionStorage.getItem("studentHubBannerDismissed") === "true") {
            notificationBanner.classList.add("hidden");
        }

        bannerCloseBtn.addEventListener("click", function () {
            notificationBanner.classList.add("hidden");
            sessionStorage.setItem("studentHubBannerDismissed", "true");
        });
    }

    // ==========================================
    // 5. SLIDER / CAROUSEL
    // ==========================================
    const sliderContainer = document.querySelector(".slider-container");
    if (sliderContainer) {
        const sliderWrapper = sliderContainer.querySelector(".slider-wrapper");
        const slides = sliderContainer.querySelectorAll(".slide");
        const prevBtn = sliderContainer.querySelector(".slider-arrow.prev");
        const nextBtn = sliderContainer.querySelector(".slider-arrow.next");
        const dotsContainer = sliderContainer.querySelector(".slider-dots");
        
        let currentIndex = 0;
        let slideInterval = null;
        const totalSlides = slides.length;

        // Generate pagination dots if not present
        if (dotsContainer && dotsContainer.children.length === 0 && totalSlides > 1) {
            slides.forEach(function (_, i) {
                const dot = document.createElement("div");
                dot.className = "slider-dot" + (i === 0 ? " active" : "");
                dot.addEventListener("click", function () {
                    goToSlide(i);
                });
                dotsContainer.appendChild(dot);
            });
        }

        function updateSlider() {
            if (sliderWrapper) {
                sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            }
            if (dotsContainer) {
                Array.from(dotsContainer.children).forEach(function (dot, i) {
                    dot.classList.toggle("active", i === currentIndex);
                });
            }
        }

        function goToSlide(index) {
            currentIndex = (index + totalSlides) % totalSlides;
            updateSlider();
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        if (nextBtn) nextBtn.addEventListener("click", nextSlide);
        if (prevBtn) prevBtn.addEventListener("click", prevSlide);

        function startAutoPlay() {
            stopAutoPlay();
            if (totalSlides > 1) {
                slideInterval = setInterval(nextSlide, 4500);
            }
        }

        function stopAutoPlay() {
            if (slideInterval) {
                clearInterval(slideInterval);
                slideInterval = null;
            }
        }

        sliderContainer.addEventListener("mouseenter", stopAutoPlay);
        sliderContainer.addEventListener("mouseleave", startAutoPlay);

        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        sliderContainer.addEventListener("touchstart", function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderContainer.addEventListener("touchend", function (e) {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) {
                nextSlide();
            } else if (touchEndX - touchStartX > 50) {
                prevSlide();
            }
        }, { passive: true });

        startAutoPlay();
    }

    // ==========================================
    // 6. FAQ ACCORDION
    // ==========================================
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(function (item) {
        const questionBtn = item.querySelector(".faq-question");
        if (!questionBtn) return;

        questionBtn.addEventListener("click", function () {
            const isActive = item.classList.contains("active");

            // Close other items (Accordion behavior)
            faqItems.forEach(function (otherItem) {
                otherItem.classList.remove("active");
            });

            // Toggle current
            if (!isActive) {
                item.classList.add("active");
            }
        });
    });

    // ==========================================
    // 7. MODAL COMPONENT
    // ==========================================
    function openModal(modalId) {
        const modal = document.querySelector(modalId);
        if (!modal) return;
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove("active");
        document.body.style.overflow = "";
    }

    // Open trigger buttons
    document.querySelectorAll("[data-modal-target]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const targetId = btn.getAttribute("data-modal-target");
            openModal(targetId);
        });
    });

    // Close triggers
    document.querySelectorAll("[data-modal-close], .modal-close-btn, .btn-modal-close").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const modal = btn.closest(".modal-overlay");
            closeModal(modal);
        });
    });

    // Close on overlay backdrop click
    document.querySelectorAll(".modal-overlay").forEach(function (modal) {
        modal.addEventListener("click", function (e) {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Close modal & hamburger on Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            document.querySelectorAll(".modal-overlay.active").forEach(function (modal) {
                closeModal(modal);
            });
            if (navMenu && navMenu.classList.contains("nav-open")) {
                toggleHamburger(false);
            }
        }
    });

    // ==========================================
    // 8. ASSIGNMENT PAGE HANDLER
    // ==========================================
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

    // ==========================================
    // 9. REGISTRATION FORM VALIDATION
    // ==========================================
    const form = document.getElementById("RegistrationForm");
    if (form) {
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
    }
});