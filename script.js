// Function to check and update visibility of elements
function checkElementVisibility() {
    // Get all elements with the "timedvisibility=1" attribute
    const elements = document.querySelectorAll('[timedvisibility="1"]');
    
    elements.forEach((element) => {
        // Get the relevant attributes
        const weekdays = element.getAttribute("weekdays").split(',').map(Number); // Convert to array of numbers
        const startTime = element.getAttribute("starttime"); // Format: HHMM
        const endTime = element.getAttribute("endtime"); // Format: HHMM
        const timezone = element.getAttribute("timezone"); // Timezone
        const enabledVisibility = element.getAttribute("enabledvisibility") || 'block'; // Default to block

        // Parse start and end times into Date objects
        const currentTime = new Date();

        // Get the day of the week (0 is Sunday, 6 is Saturday)
        const currentDay = currentTime.getDay();

        // Check if the current day is in the list of allowed weekdays
        if (!weekdays.includes(currentDay)) {
            element.style.display = 'none';
            return;
        }

        // Get current time in the specified timezone
        const options = {
            timeZone: timezone,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
        };
        const currentTimeStr = currentTime.toLocaleTimeString('en-US', options).replace(':', '');

        // Compare current time with the start and end times
        if (currentTimeStr >= startTime && currentTimeStr < endTime) {
            // If within the visibility period, show the element
            element.style.display = enabledVisibility;
        } else {
            // Otherwise, hide the element
            element.style.display = 'none';
        }
    });
}

// Wait until the page is fully loaded
window.addEventListener('load', () => {
    // Run the visibility check immediately after page load
    checkElementVisibility();

    // Repeat the check every 10 seconds
    setInterval(checkElementVisibility, 10000);
});
