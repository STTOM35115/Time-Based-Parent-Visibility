(function() {
    let scriptTag;

    // Helper function to get parameters from the script tag's data attributes
    function getScriptParams() {
        // Get the script element by its ID or class
        if (!scriptTag) {
            scriptTag = document.getElementById('visibilityscript');  // Reference the script by its ID
        }

        if (!scriptTag) {
            console.error("Script tag not found.");
            return { weekdays: [], startTime: '00:00', endTime: '23:59', timeZone: 'UTC' };
        }

        // Retrieve data-* attributes from the script tag
        const weekdays = scriptTag.getAttribute('data-weekdays') ? scriptTag.getAttribute('data-weekdays').split(',').map(Number) : [];
        const startTime = scriptTag.getAttribute('data-starttime') || '00:00';
        const endTime = scriptTag.getAttribute('data-endtime') || '23:59';
        const timeZone = scriptTag.getAttribute('data-timezone') || 'UTC';  // Time zone parameter

        console.log(`Script tag Params extracted:`);
        console.log(`- Weekdays: ${weekdays}`);
        console.log(`- Start Time: ${startTime}`);
        console.log(`- End Time: ${endTime}`);
        console.log(`- Time Zone: ${timeZone}`);
        console.log(`v2`);

        return { weekdays, startTime, endTime, timeZone };
    }

    // Helper function to check if the current day and time match the conditions in a specific timezone
    function isWithinTimeRange(weekdays, startTime, endTime, timeZone) {
        console.log(`Checking if current time is within the range in the specified time zone: ${timeZone}...`);

        // Get the current UTC time based on the client's local time zone
        const nowUtc = moment.utc();
        console.log(`Current UTC time: ${nowUtc.format('YYYY-MM-DD HH:mm:ss')}`);

        // Get the current time in the specified timezone
        const nowInTimeZone = moment.tz(nowUtc, timeZone);
        console.log(`Current time in ${timeZone}: ${nowInTimeZone.format('YYYY-MM-DD HH:mm:ss')}`);

        const currentDay = nowInTimeZone.day();    // Get the current day (0 = Sunday, 6 = Saturday)
        const currentTimeInMinutes = nowInTimeZone.hour() * 60 + nowInTimeZone.minute();
        console.log(`Current day of the week (0 = Sunday, 6 = Saturday): ${currentDay}`);
        console.log(`Current time in minutes since start of the day: ${currentTimeInMinutes}`);

        // Parse the start and end time from the parameter, and convert it to minutes
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        const startTimeInMinutes = startHour * 60 + startMinute;
        const endTimeInMinutes = endHour * 60 + endMinute;

        console.log(`Parsed Start Time: ${startHour}:${startMinute} => ${startTimeInMinutes} minutes`);
        console.log(`Parsed End Time: ${endHour}:${endMinute} => ${endTimeInMinutes} minutes`);

        // Check if the current day is in the specified weekdays and within the time range
        const isCorrectDay = weekdays.includes(currentDay);
        const isWithinTime = currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;

        console.log(`Is today one of the specified weekdays? ${isCorrectDay}`);
        console.log(`Is the current time within the specified time range? ${isWithinTime}`);

        return isCorrectDay && isWithinTime;
    }

    // Main function to control the visibility of the parent element
    function controlParentVisibility() {
        console.log("Running controlParentVisibility()...");

        const { weekdays, startTime, endTime, timeZone } = getScriptParams();
        const parent = scriptTag.parentElement;

        if (!parent) {
            console.error("Parent element not found.");
            return;
        }

        console.log(`Parent element:`, parent);
        console.log(`Checking if parent should be visible...`);

        const shouldBeVisible = isWithinTimeRange(weekdays, startTime, endTime, timeZone);
        if (shouldBeVisible) {
            console.log("Conditions met, making the parent element visible.");
            parent.style.display = 'block';  // Make parent visible
        } else {
            console.log("Conditions not met, hiding the parent element.");
            parent.style.display = 'none';   // Hide parent
        }

        console.log("Parent element visibility updated.");
    }

    // Update visibility every 5 seconds
    console.log("Setting up interval to update visibility every 5 seconds.");
    setInterval(controlParentVisibility, 5000);

    // Run the function initially when the script is loaded
    console.log("Running controlParentVisibility for the first time...");
    controlParentVisibility();
})();
