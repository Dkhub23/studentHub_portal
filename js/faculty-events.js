(function () {
    const CUSTOM_EVENTS_KEY = "studentHubCustomEvents";
    const EVENT_REGISTRATIONS_KEY = "studentHubEventRegistrations";

    function readList(key) {
        try { return JSON.parse(localStorage.getItem(key) || "[]"); }
        catch (error) { return []; }
    }

    function escapeHtml(value) {
        const element = document.createElement("span");
        element.textContent = value == null ? "" : String(value);
        return element.innerHTML;
    }

    document.addEventListener("DOMContentLoaded", async function () {
        const container = document.getElementById("facultyEventRegistrations");
        if (!container) return;
        if (!window.AuthGuard || AuthGuard.getUserRole() !== "faculty") {
            container.textContent = "Faculty access is required to view registrations.";
            return;
        }
        try {
            const response = await fetch("data/events.json");
            if (!response.ok) throw new Error("Could not load events");
            const events = [...readList(CUSTOM_EVENTS_KEY), ...await response.json()];
            const registrations = readList(EVENT_REGISTRATIONS_KEY);
            if (!events.length) { container.textContent = "No events are available."; return; }
            container.innerHTML = events.map(event => {
                const attendees = registrations.filter(item => String(item.eventId) === String(event.id));
                const roster = attendees.length
                    ? `<ul>${attendees.map(item => `<li>${escapeHtml(item.studentName)} (${escapeHtml(item.studentUsername)}) — registered ${escapeHtml(new Date(item.registeredAt).toLocaleString())}</li>`).join("")}</ul>`
                    : "<p>No students registered yet.</p>";
                return `<article class="card"><h3>${escapeHtml(event.name)}</h3>
                    <p>${escapeHtml(event.startDate)} · ${escapeHtml(event.type)} · ${escapeHtml(event.venue)}</p>
                    ${event.createdBy ? `<p>Added by ${escapeHtml(event.createdBy)}</p>` : ""}
                    <h4>Registered students (${attendees.length})</h4>${roster}</article>`;
            }).join("");
        } catch (error) {
            container.textContent = "Unable to load event registrations.";
            console.error(error);
        }
    });
})();
