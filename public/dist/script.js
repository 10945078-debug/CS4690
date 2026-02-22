"use strict";
$(() => {
    //Function for loading courses dynamically
    async function LoadCourses() {
        const response = await axios.get('/api/v1/courses');
        const data = response.data;
        console.log(data);
        let optionsHTML = '<option selected value="">Choose Courses</option>';
        data.forEach(item => {
            optionsHTML += `<option value="${item.id}">${item.display}</option>`;
        });
        $('#course').html(optionsHTML);
        $('#uvuId').hide();
        $('#course').on('change', function () {
            const val = $(this).val();
            const $stdIDInput = $('#uvuId');
            if (val === '') {
                $stdIDInput.hide().val('');
            }
            else {
                $stdIDInput.show();
                if ($stdIDInput.val().length === 8) {
                    LoadLogs(val);
                }
            }
        });
    }
    //Checks if number in uvuID input is exactly 8 digits
    function numChecker() {
        const $stdIDInput = $('#uvuId');
        $stdIDInput.on('input', function () {
            var val = $(this).val();
            if (val.length > 8) {
                $(this).val.slice(0, 8);
                console.warn('ID cannot be exceed 8 digits');
            }
        });
        $stdIDInput.on('change', function () {
            var val = $(this).val();
            if (val.length !== 8 && val.length > 0) {
                $(this).addClass('is-invalid').removeClass('is-valid'); // Adds Bootstrap red border and icon
                alert('UVU ID must be exactly 8 digits long');
                $(this).val('');
            }
            else if (val.length === 8) {
                $(this).removeClass('is-invalid').addClass('is-valid'); // Adds Bootstrap green border
                const courseId = $('#course').val();
                if (courseId)
                    LoadLogs(courseId);
            }
        });
    }
    async function LoadLogs(courseId) {
        const logSelect = $('#logs');
        const logHeader = $('#uvuIdDisplay');
        const uvuId = $('#uvuId').val();
        var logBtn = $('#log_btn');
        // Warning for if uvuId is entered 
        if (!courseId || !uvuId || uvuId.length !== 8) {
            console.warn("Cannot load: courseId or uvuId is incomplete.");
            return;
        }
        //Clear Previous Results
        logSelect.empty();
        const response = await axios.get(`/api/v1/logs?courseId=${courseId}&uvuId=${uvuId}`);
        const urlStream = `/api/v1/logs?courseId=${courseId}&uvuId=${uvuId}`;
        console.log(urlStream);
        const data = await response.data;
        console.log(data);
        logHeader.html(`Students Logs for ${uvuId}`);
        if (data && data.length > 0) {
            let items = data.map(log => `<li class="list-group-item list-group-item-action border-start border-4 border-success mb-2 shadow-sm">
          <div class="d-flex w-100 justify-content-between">
            <small class="text-muted fw-bold">${log.date}</small>
          </div>
          <p class="mb-1 mt-2 font-monospace" style="white-space: pre-wrap;">${log.text}</p>
        </li>`).join('');
            logSelect.html(items);
        }
        else {
            logSelect.html('<li class="list-group-item text-center text-muted">No logs found for this student.</li>');
        }
        logBtn.prop('disabled', false);
    }
    //Helper Function for displaying logs. Click the log header to make the logs hide/appear
    function logDisplay() {
        const logHeader = $('#uvuIdDisplay');
        const logSelect = $('#logs');
        var logBtn = $('#log_btn');
        logHeader.on('click', function () {
            const isHidden = logSelect.is(':hidden');
            logSelect.toggle();
            logBtn.prop('disabled', !isHidden);
        });
    }
    //Add a new log.
    function addLog() {
        const addBtn = $('#log_btn');
        const textArea = $('#log_textarea');
        const courseInput = $('#course');
        const uvuIdInput = $('#uvuId');
        addBtn.on('click', async function (event) {
            event.preventDefault();
            const courseId = courseInput.val();
            const uvuId = uvuIdInput.val();
            const logText = textArea.val();
            let logDate = new Date();
            let randId = randomId();
            //Check for empty logs
            if (!logText.trim())
                return;
            // Add a new log to the logs in db.json
            try {
                await axios.post('/api/v1/logs', {
                    courseId: courseId,
                    uvuId: uvuId,
                    date: `${logDate.toLocaleDateString()}, ${logDate.toLocaleTimeString()}`,
                    text: logText,
                    id: randId
                });
                console.log('Log added successfully');
                // Clear the text area value after added to logs
                textArea.val('');
                // Reload logs after a new log is added
                await LoadLogs(courseId);
            }
            catch (error) {
                console.error('Error adding log:', error);
            }
        });
    }
    // Helper function for generating a Log Id
    function randomId() {
        let final = '';
        const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 7; i++) {
            const randChar = Math.floor(Math.random() * charSet.length);
            final += charSet.charAt(randChar);
        }
        return final;
    }
    //Toggle
    $('#theme-toggle').on('click', () => {
        var currentTheme = $('html').attr('data-bs-theme');
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
    //Support function to apply themes
    // Update the attribute name to Bootstrap standard
    function applyTheme(newTheme) {
        const modeText = $('.mode-text');
        // Bootstrap 5.3+ looks for 'data-bs-theme'
        $('html').attr('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        // Update button text to show what the NEXT click will do
        modeText.text(newTheme === 'dark' ? 'Switch to Light' : 'Switch to Dark');
    }
    function initTheme() {
        //User Presf
        const userPref = localStorage.getItem('theme') || 'unknown';
        //Browswer/System Pref Logic
        var osPref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        console.log(`User Pref: ${userPref}`);
        console.log(`Browser Pref: ${osPref}`);
        console.log(`OS Pref: ${osPref}`);
        let currentTheme = 'light'; //Default
        if (userPref !== 'unknown') {
            currentTheme = userPref;
        }
        else if (osPref !== 'unknown') {
            currentTheme = osPref;
        }
        applyTheme(currentTheme);
    }
    function init() {
        // Disables the add log button when page loads
        $('#log_btn').prop('disabled', true);
        LoadCourses();
        initTheme();
        numChecker();
        logDisplay();
        addLog();
    }
    //On Load
    init();
});
//# sourceMappingURL=script.js.map