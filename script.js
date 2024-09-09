(function() {
    // Helper function to get URL parameters
    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const weekdays = params.get('weekdays') ? params.get('weekdays').split(',').map(Number) : [];
        const startTime = params.get('starttime') || '00:00';
        const endTime = params.get('endtime') || '23:59';
        const timeZone = params.get('timezone') || 'UTC';  // Time zone parameter
        return { weekdays, startTime, endTime, timeZone };
    }

    // Helper function to check if the current day and time match the conditions in a specific timezone
    function isWithinTimeRange(weekdays, startTime, endTime, timeZone) {
        // Get the current UTC time based on the client's local time zone
        const nowUtc = moment.utc();

        // Get the current time in the specified timezone
        const nowInTimeZone = moment.tz(nowUtc, timeZone);

        const currentDay = nowInTimeZone.day();    // Get the current day (0 = Sunday, 6 = Saturday)
        const currentTimeInMinutes = nowInTimeZone.hour() * 60 + nowInTimeZone.minute();

        // Parse the start and end time from the parameter, and convert it to UTC in the specified time zone
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        const startTimeInMinutes = startHour * 60 + startMinute;
        const endTimeInMinutes = endHour * 60 + endMinute;

        // Check if the current day is in the specified weekdays and within the time range
        if (weekdays.includes(currentDay)) {
            return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
        }
        return false;
    }

    // Main function to control the visibility of the parent element
    function controlParentVisibility() {
        const { weekdays, startTime, endTime, timeZone } = getUrlParams();
        const parent = document.currentScript.parentElement;

        if (isWithinTimeRange(weekdays, startTime, endTime, timeZone)) {
            parent.style.display = 'block';  // Make parent visible
        } else {
            parent.style.display = 'none';   // Hide parent
        }
    }

    // Update visibility every 5 seconds
    setInterval(controlParentVisibility, 5000);

    // Run the function initially when the script is loaded
    controlParentVisibility();
})();
