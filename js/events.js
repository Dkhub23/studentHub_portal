// ==========================================
// EVENTS MODULE
// ==========================================

let eventsData = [];
let filteredEvents = [];

let eventCurrentPage = 1;

const eventRecordsPerPage = 6;


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

        eventsData = await response.json();

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

        card.innerHTML = `
            <h3>🎯 ${event.name}</h3>

            <p>
                <strong>Type:</strong>
                ${event.type}
            </p>

            <p>
                <strong>Category:</strong>
                ${event.category}
            </p>

            <p>
                <strong>Venue:</strong>
                ${event.venue}
            </p>

            <p>
                <strong>Date:</strong>
                ${event.startDate}
                ${event.startDate !== event.endDate
                    ? " to " + event.endDate
                    : ""}
            </p>

            <p>
                <strong>Level:</strong>
                ${event.level}
            </p>

            <p>
                <strong>Points:</strong>
                ${event.points}
            </p>

            <button
                type="button"
                class="event-register-btn"
                onclick="selectEvent(${event.id})">
                Register
            </button>
        `;

        container.appendChild(card);

    });

    renderEventPagination();
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


        loadEvents();

    }
);