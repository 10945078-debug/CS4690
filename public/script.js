document.addEventListener('DOMContentLoaded', function() {
  //Function for loading courses dynamically
  async function LoadCourses() {
    const response = await axios.get('/api/v1/courses');
    const courseSelect = document.getElementById('course');
    let optionsHTML = '<option selected value="">Choose Courses</option>';
    const data = response.data;
    console.log(data);

    for (const item of data) {
      optionsHTML += `<option value="${item.id}">${item.display}</option>`;
    }

    courseSelect.innerHTML = optionsHTML;

    const stdIDInput = document.getElementById('uvuId');
    stdIDInput.hidden = true;

    courseSelect.addEventListener('change', function () {
      const uvuId = document.getElementById('uvuId');
      if (this.value == '') {
        stdIDInput.hidden = true;
        uvuId.value = '';
      } else {
        stdIDInput.hidden = false;
        if(uvuId.value.length === 8 ) {
          LoadLogs(this.value);
        }
      }
    });
  }

  //Checks if number in uvuID input is exactly 8 digits
  function numChecker() {
    const stdIDInput = document.getElementById('uvuId');

    stdIDInput.addEventListener('input', function() {
      if(this.value.length > this.maxLength) {
        this.value = this.value.slice(0,8);
        console.warn('ID cannot be exceed 8 digits')
      }
    });

    stdIDInput.addEventListener('change', function() {
      if(this.value.length !== 8 && this.value.length > 0) {
        alert('UVU ID must be exactly 8 digits long');
        this.value = '';
        this.style.borderColor = 'red';
      } else {
        this.style.borderColor = '';
        const courseId = document.getElementById('course').value;
        if(courseId) LoadLogs(courseId);
      }
    })
  }

  async function LoadLogs(courseId) {
    const logSelect = document.getElementById('logs');
    const logHeader = document.getElementById('uvuIdDisplay');
    const uvuId = document.getElementById('uvuId').value;
    var logBtn = document.getElementById('log_btn');
    
    // Warning for if uvuId is entered 
    if(!courseId || !uvuId || uvuId.length !== 8) {
      console.warn("Cannot load: courseId or uvuId is incomplete.");
      return;
    }

    //Clear Previous Results
    logSelect.innerHTML = '';

    const response = await axios.get(
      `/api/v1/logs?courseId=${courseId}&uvuId=${uvuId}`
    );
    const data = await response.data;

    logHeader.innerHTML = `Students Logs for ${uvuId}`;
    
    if(data && data.length > 0) {
      let innerHTML = '';
      for(log of data) {
        innerHTML += `<li><div><small>${log.date}</small></div><pre id=text><p>${log.text}</p></pre></li>`
        logBtn.disabled = false;
      }
      logSelect.innerHTML = innerHTML;
    } else {
      logSelect.innerHTML = '<li><div>There are no logs available</div></li>';
      logBtn.disabled = false;
    }
  }

  //Helper Function for displaying logs. Click the log header to make the logs hide/appear
  function logDisplay() {
    const logHeader = document.getElementById('uvuIdDisplay');
    const logSelect = document.getElementById('logs');
    var logBtn = document.getElementById('log_btn');
    logHeader.addEventListener('click', function () {
      if(logSelect.hidden == false) {
        logSelect.hidden = true;
        logBtn.disabled = true;
      } else {
        logSelect.hidden = false;
        logBtn.disabled = false;
      }
    });
  }

  //Add a new log.
  function addLog() {
    const addBtn = document.getElementById('log_btn');
    const textArea = document.getElementById('log_textarea');
    const couseInput = document.getElementById('course');
    const uvuIdInput = document.getElementById('uvuId');

    addBtn.addEventListener('click', async function (event) {
      event.preventDefault();

      const courseId = couseInput.value;
      const uvuId = uvuIdInput.value;
      const logText = textArea.value;
      let logDate = new Date();
      let randId = randomId();

      //Check for empty logs
      if(!logText.trim()) return;

      // Add a new log to the logs in db.json
      try{
        await axios.post('/api/v1/logs', {
          courseId: courseId,
          uvuId: uvuId,
          date: `${logDate.toLocaleDateString()}, ${logDate.toLocaleTimeString()}`,
          text: logText,
          id: randId
        });

        console.log('Log added successfully');

        // Clear the text area value after added to logs
        textArea.value = '';

        // Reload logs after a new log is added
        await LoadLogs(courseId);
      } catch (error) {
        console.error('Error adding log:', error);
      }
    });
  }

  // Helper function for generating a Log Id
  function randomId() {
    let final = '';
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for(let i = 0; i < 7; i++) {
      const randChar = Math.floor(Math.random() * charSet.length);
      final += charSet.charAt(randChar);
    }
    return final;
  }

  //Toggle
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  });

  function initTheme() {
    //User Presf
    const userPref = localStorage.getItem('theme') || 'unknown';

    //Browswer/System Pref Logic
    let osPref = 'unknown';
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      osPref = 'dark';
    } else if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches
    ) {
      osPref = 'light';
    }

    console.log(`User Pref: ${userPref}`);
    console.log(`Browser Pref: ${osPref}`);
    console.log(`OS Pref: ${osPref}`);

    let currentTheme = 'light'; //Default

    if (userPref !== 'unknown') {
      currentTheme = userPref;
    } else if (osPref !== 'unknown') {
      currentTheme = osPref;
    }

    applyTheme(currentTheme);
  }

  //Support function to apply themes
  function applyTheme(newTheme) {
    //Apply Stage
    const modeText = document.querySelector('.mode-text');
    document.documentElement.setAttribute('data-theme', newTheme);

    //Swap text on toggle
    localStorage.setItem('theme', newTheme);
    modeText.innerText = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';

    // Toggle check
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.checked = newTheme === 'dark';
    }
  }

  function init() {
    LoadCourses();
    initTheme();
    numChecker();
    logDisplay();
    addLog();
  }

  // Disables the add log button when page loads
  document.getElementById('log_btn').disabled = true;
  //On Load
  init();
});