// ==========================================
// EVENTS MODULE
// ==========================================

let eventsData = [];
let filteredEvents = [];

let eventCurrentPage = 1;

const eventRecordsPerPage = 6;
const CUSTOM_EVENTS_KEY = "studentHubCustomEvents";
const EVENT_REGISTRATIONS_KEY = "studentHubEventRegistrations";

function getStoredList(key) {
    try { return JSON.parse(localStorage.getItem(key) || "[]"); }
    catch (error) { return []; }
}

function getActiveStudent() {
    return window.AuthGuard && AuthGuard.getCurrentUser();
}


// ==========================================
// LOAD EVENTS USING FETCH API
// ==========================================

async function loadEvents() {

    const loading = document.getElementById("eventsLoading");
    const error = document.getElementById("eventsError");

    try {

        loading.style.display = "block";
        error.textContent = "";

        const response = await fetch("data/events.json");

        if (!response.ok) {
            throw new Error("Unable to fetch events.json");
        }

        const baseEvents = await response.json();
        eventsData = [...getStoredList(CUSTOM_EVENTS_KEY), ...baseEvents];

        filteredEvents = [...eventsData];

        loading.style.display = "none";

        renderEvents();

    } catch (err) {

        loading.style.display = "none";

        error.textContent =
            "❌ Error loading events. Please try again.";

        console.error(err);
    }
}


// ==========================================
// RENDER EVENTS
// ==========================================

function renderEvents() {

    const container =
        document.getElementById("eventsContainer");

    container.innerHTML = "";

    const start =
        (eventCurrentPage - 1) *
        eventRecordsPerPage;

    const end =
        start + eventRecordsPerPage;

    const currentRecords =
        filteredEvents.slice(start, end);


    if (currentRecords.length === 0) {

        container.innerHTML =
            "<p>No events found.</p>";

        document.getElementById(
            "eventsPagination"
        ).innerHTML = "";

        return;
    }


    currentRecords.forEach(event => {

        const card =
            document.createElement("div");

        card.className = "card event-data-card";

        const eventDetails = [
            ["Type", event.type],
            ["Category", event.category],
            ["Venue", event.venue],
            ["Date", `${event.startDate}${event.startDate !== event.endDate ? " to " + event.endDate : ""}`],
            ["Level", event.level],
            ["Points", event.points]
        ];
        const title = document.createElement("h3");
        title.textContent = `Event: ${event.name}`;
        card.appendChild(title);
        eventDetails.forEach(([label, value]) => {
            const paragraph = document.createElement("p");
            const strong = document.createElement("strong");
            strong.textContent = `${label}: `;
            paragraph.append(strong, document.createTextNode(value == null ? "" : String(value)));
            card.appendChild(paragraph);
        });
        const registerButton = document.createElement("button");
        registerButton.type = "button";
        registerButton.className = "event-register-btn";
        registerButton.textContent = "Register";
        registerButton.addEventListener("click", () => registerForEvent(event.id));
        card.appendChild(registerButton);
        container.appendChild(card);

    });

    renderEventPagination();
}

function registerForEvent(id) {
    const user = getActiveStudent();
    if (!user || user.role !== "student") {
        alert("Please sign in as a student to register for an event.");
        return;
    }
    const event = eventsData.find(item => String(item.id) === String(id));
    if (!event) return;
    const registrations = getStoredList(EVENT_REGISTRATIONS_KEY);
    const alreadyRegistered = registrations.some(item =>
        String(item.eventId) === String(event.id) && item.studentUsername === user.username
    );
    if (alreadyRegistered) {
        alert("You are already registered for this event.");
        return;
    }
    registrations.push({
        eventId: event.id,
        eventName: event.name,
        studentUsername: user.username,
        studentName: user.displayName || user.username,
        registeredAt: new Date().toISOString()
    });
    try {
        localStorage.setItem(EVENT_REGISTRATIONS_KEY, JSON.stringify(registrations));
    } catch (error) {
        alert("Your registration could not be saved in this browser.");
        console.error(error);
        return;
    }
    alert("You are registered for " + event.name + ".");
}

function saveStudentEvent(form) {
    const user = getActiveStudent();
    if (!user || user.role !== "student") { alert("Please sign in as a student to add an event."); return; }
    const name = form.elements.eventName.value.trim();
    const type = form.querySelector("input[name='type']:checked");
    const venue = document.getElementById("eventVenue").value.trim();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const levelText = form.elements.Level.value;
    const match = levelText.match(/^(.*?)\s*\((\d+)\)$/);
    if (!name || !type || !venue || !startDate || !endDate || endDate < startDate) {
        alert("Enter the event name, type, venue, and valid start and end dates."); return;
    }
    const events = getStoredList(CUSTOM_EVENTS_KEY);
    const event = {
        id: "student-" + Date.now(), name, type: type.value, venue, startDate, endDate,
        level: match ? match[1].replace(/ Level$/, "") : levelText,
        points: match ? Number(match[2]) : 20,
        category: "Student Event", createdBy: user.displayName || user.username
    };
    events.unshift(event);
    try {
        localStorage.setItem(CUSTOM_EVENTS_KEY, JSON.stringify(events));
    } catch (error) {
        alert("Your event could not be saved in this browser.");
        console.error(error);
        return;
    }
    eventsData.unshift(event);
    filterEvents();
    form.reset();
    alert("Event added and is now visible to students and faculty.");
}


// ==========================================
// SEARCH + FILTER
// ==========================================

function filterEvents() {

    const searchValue =
        document
            .getElementById("eventSearch")
            .value
            .toLowerCase();

    const category =
        document.getElementById(
            "eventCategory"
        ).value;

    const type =
        document.getElementById(
            "eventType"
        ).value;


    filteredEvents =
        eventsData.filter(event => {

            const matchesSearch =
                event.name
                    .toLowerCase()
                    .includes(searchValue);

            const matchesCategory =
                category === "all" ||
                event.category === category;

            const matchesType =
                type === "all" ||
                event.type === type;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesType
            );

        });


    eventCurrentPage = 1;

    renderEvents();
}


// ==========================================
// SORT EVENTS
// ==========================================

function sortEvents() {

    const sortValue =
        document.getElementById(
            "eventSort"
        ).value;


    if (sortValue === "nameAsc") {

        filteredEvents.sort((a, b) =>
            a.name.localeCompare(b.name)
        );

    } else if (sortValue === "nameDesc") {

        filteredEvents.sort((a, b) =>
            b.name.localeCompare(a.name)
        );

    } else if (sortValue === "dateAsc") {

        filteredEvents.sort((a, b) =>
            new Date(a.startDate) -
            new Date(b.startDate)
        );

    } else if (sortValue === "dateDesc") {

        filteredEvents.sort((a, b) =>
            new Date(b.startDate) -
            new Date(a.startDate)
        );

    } else if (sortValue === "pointsAsc") {

        filteredEvents.sort(
            (a, b) => a.points - b.points
        );

    } else if (sortValue === "pointsDesc") {

        filteredEvents.sort(
            (a, b) => b.points - a.points
        );
    }


    eventCurrentPage = 1;

    renderEvents();
}


// ==========================================
// PAGINATION
// ==========================================

function renderEventPagination() {

    const pagination =
        document.getElementById(
            "eventsPagination"
        );

    pagination.innerHTML = "";


    const totalPages =
        Math.ceil(
            filteredEvents.length /
            eventRecordsPerPage
        );


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const button =
            document.createElement("button");

        button.textContent = page;

        if (page === eventCurrentPage) {
            button.classList.add("active");
        }


        button.addEventListener(
            "click",
            function () {

                eventCurrentPage = page;

                renderEvents();

            }
        );


        pagination.appendChild(button);
    }
}


// ==========================================
// SELECT EVENT
// ==========================================

function selectEvent(id) {

    const event =
        eventsData.find(
            item => item.id === id
        );


    if (!event) {
        return;
    }


    const eventNameInput =
        document.querySelector(
            "#eventRegistrationForm input[name='eventName']"
        );

    if (eventNameInput) {
        eventNameInput.value =
            event.name;
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ==========================================
// EVENT LISTENERS
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const search =
            document.getElementById(
                "eventSearch"
            );

        const category =
            document.getElementById(
                "eventCategory"
            );

        const type =
            document.getElementById(
                "eventType"
            );

        const sort =
            document.getElementById(
                "eventSort"
            );


        if (search) {
            search.addEventListener(
                "input",
                filterEvents
            );
        }

        if (category) {
            category.addEventListener(
                "change",
                filterEvents
            );
        }

        if (type) {
            type.addEventListener(
                "change",
                filterEvents
            );
        }

        if (sort) {
            sort.addEventListener(
                "change",
                sortEvents
            );
        }

        const eventForm = document.getElementById("eventRegistrationForm");
        if (eventForm) eventForm.addEventListener("submit", function (event) {
            event.preventDefault();
            saveStudentEvent(eventForm);
        });

        loadEvents();

    }
);
