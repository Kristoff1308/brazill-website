const eventsTableBody = document.getElementById("eventsTableBody");
const fromDate = document.getElementById("fromDate");
const toDate = document.getElementById("toDate");
const searchEventsBtn = document.getElementById("searchEventsBtn");
const showAllBtn = document.getElementById("showAllBtn");
console.log("events.js loaded");
function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}
function displayEvents(events) {
    eventsTableBody.innerHTML = "";
    if (!events || events.length === 0) {
        eventsTableBody.innerHTML = `
            <tr>
                <td colspan="6">No events found for this date range.</td>
            </tr>
   `;
        return;
    }
    events.forEach(event => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${event.name}</td>
            <td>${event.city}</td>
            <td>${event.state}</td>
            <td>${formatDate(event.start_date)}</td>
            <td>${formatDate(event.end_date)}</td>
            <td>${event.description}</td>
        `;
        eventsTableBody.appendChild(row);
    });
}
async function loadAllEvents() {
    try {
        const response = await fetch("/events-data");
        const events = await response.json();
        console.log("EVENTS FROM SERVER:", events);
        displayEvents(events);
    } catch (error) {
        console.log("ERROR LOADING EVENTS:", error);
    }
}
searchEventsBtn.addEventListener("click", async () => {
    if (!fromDate.value || !toDate.value) {
        alert("Please select both dates.");
        return;
    }
    const response = await fetch(
        `/events-search?from=${fromDate.value}&to=${toDate.value}`
    );
    const events = await response.json();
    displayEvents(events);
});
showAllBtn.addEventListener("click", () => {
    fromDate.value = "";
    toDate.value = "";
    loadAllEvents();
});
loadAllEvents();