declare var $: any;

interface Course {
  id: string;
  display: string;
}

interface Log {
  id: string;
  courseId: string;
  uvuId: string;
  date: string;
  text: string;
}

$(() => {
  //Function for loading courses dynamically
  async function LoadCourses() {
    const response = await axios.get<Course[]>('/api/v1/courses');
    const data = response.data;
    console.log(data);

    //const courseSelect = document.getElementById('course') as HTMLSelectElement;
    let optionsHTML = '<option selected value="">Choose Courses</option>';
    data.forEach(item => {
      optionsHTML += `<option value="${item.id}">${item.display}</option>`;
    });

    /*
    for (const item of data) {
      optionsHTML += `<option value="${item.id}">${item.display}</option>`;
    }
    */
    $('#course').html(optionsHTML);
    $('#uvuId').hide();

    $('#course').on('change', function(this: HTMLSelectElement) {
      const val = $(this).val();
      const $stdIDInput = $('#uvuId');
      
      if (val === '') {
        $stdIDInput.hide().val('');
      } else {
        $stdIDInput.show();
        if ($stdIDInput.val().length === 8) {
          LoadLogs(val as string);
        }
      }
    });
  }

  //Checks if number in uvuID input is exactly 8 digits
  function numChecker() {
    const $stdIDInput = $('#uvuId');

    $stdIDInput.on('input', function(this: HTMLInputElement) {
      var val = $(this).val() as string;
      if(val.length > 8) {
        $(this).val.slice(0,8);
        console.warn('ID cannot be exceed 8 digits')
      }
    });

    $stdIDInput.on('change', function(this: HTMLInputElement) {
      var val = $(this).val() as string;
      if(val.length !== 8 && val.length > 0) {
        //this.classList.add('is-invalid'); 
        $(this).addClass('is-invalid').removeClass('is-valid'); // Adds Bootstrap red border and icon
        //this.classList.remove('is-valid');
        alert('UVU ID must be exactly 8 digits long');
        $(this).val('');
      } else if (val.length === 8) {
        //this.classList.remove('is-invalid');
        //this.classList.add('is-valid'); // Adds Bootstrap green border
        $(this).removeClass('is-invalid').addClass('is-valid'); // Adds Bootstrap green border
        const courseId = $('#course').val();
        if(courseId) LoadLogs(courseId as string);
      }
    });
  }

  async function LoadLogs(courseId: string) {
    //const logSelect = document.getElementById('logs') as HTMLElement;
    const logSelect = $('#logs');
    //const logHeader = document.getElementById('uvuIdDisplay') as HTMLElement;
    const logHeader = $('#uvuIdDisplay');
    const uvuId = $('#uvuId').val() as string;
    //var logBtn = document.getElementById('log_btn') as HTMLButtonElement;
    var logBtn = $('#log_btn');
    
    // Warning for if uvuId is entered 
    if(!courseId || !uvuId || uvuId.length !== 8) {
      console.warn("Cannot load: courseId or uvuId is incomplete.");
      return;
    }

    //Clear Previous Results
    logSelect.empty();

    const response = await axios.get<Log[]>(
      `/api/v1/logs?courseId=${courseId}&uvuId=${uvuId}`
    );
    const urlStream = `/api/v1/logs?courseId=${courseId}&uvuId=${uvuId}`;
    console.log(urlStream);

    const data = await response.data;
    console.log(data);

    logHeader.html(`Students Logs for ${uvuId}`);
    
    if(data && data.length > 0) {
      let items = data.map(log =>
        `<li class="list-group-item list-group-item-action border-start border-4 border-success mb-2 shadow-sm">
          <div class="d-flex w-100 justify-content-between">
            <small class="text-muted fw-bold">${log.date}</small>
          </div>
          <p class="mb-1 mt-2 font-monospace" style="white-space: pre-wrap;">${log.text}</p>
        </li>`).join('');
      logSelect.html(items);
    } else {
      logSelect.html('<li class="list-group-item text-center text-muted">No logs found for this student.</li>');
    }
    logBtn.prop('disabled', false);
  }

  //Helper Function for displaying logs. Click the log header to make the logs hide/appear
  function logDisplay() {
    //const logHeader = document.getElementById('uvuIdDisplay') as HTMLElement;
    const logHeader = $('#uvuIdDisplay');
    //const logSelect = document.getElementById('logs') as HTMLElement;
    const logSelect = $('#logs');
    //var logBtn = document.getElementById('log_btn') as HTMLButtonElement;
    var logBtn = $('#log_btn');
    logHeader.on('click', function (this: HTMLElement) {
      const isHidden = logSelect.is(':hidden');

      logSelect.toggle();
      logBtn.prop('disabled', !isHidden);
      /*
      if(logSelect.hidden == false) {
        logSelect.hidden = true;
        logBtn.disabled = true;
      } else {
        logSelect.hidden = false;
        logBtn.disabled = false;
      }
      */
    });
  }

  //Add a new log.
  function addLog() {
    //const addBtn = document.getElementById('log_btn')  as HTMLButtonElement;
    const addBtn = $('#log_btn');
    //const textArea = document.getElementById('log_textarea') as HTMLInputElement;
    const textArea = $('#log_textarea');
    //const courseInput = document.getElementById('course') as HTMLSelectElement;
    const courseInput = $('#course');
    //const uvuIdInput = document.getElementById('uvuId') as HTMLInputElement;
    const uvuIdInput = $('#uvuId');

    addBtn.on('click', async function (event: any) {
      event.preventDefault();

      const courseId = courseInput.val() as string;
      const uvuId = uvuIdInput.val() as string;
      const logText = textArea.val() as string;
      let logDate = new Date();
      let randId = randomId();

      //Check for empty logs
      if(!logText.trim()) return;

      // Add a new log to the logs in db.json
      try{
        await axios.post<Log[]>('/api/v1/logs', {
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
  /*
  const themeToggle = document.getElementById('theme-toggle') as HTMLInputElement;
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  });
  */
 $('#theme-toggle').on('click', () => {
    var currentTheme = $('html').attr('data-bs-theme');
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  //Support function to apply themes
  // Update the attribute name to Bootstrap standard
  function applyTheme(newTheme: string): void {
    const modeText = $('.mode-text');//= document.querySelector('.mode-text') as HTMLElement;
    // Bootstrap 5.3+ looks for 'data-bs-theme'
    //document.documentElement.setAttribute('data-bs-theme', newTheme);
    $('html').attr('data-bs-theme', newTheme);

    localStorage.setItem('theme', newTheme);
    
    // Update button text to show what the NEXT click will do
    modeText.text(newTheme === 'dark' ? 'Switch to Light' : 'Switch to Dark');

    /*
    // Toggle check
    const themeToggle = document.getElementById('theme-toggle') as HTMLInputElement;
    if (themeToggle) {
      themeToggle.checked = newTheme === 'dark';
    }
    */
  }
  
  function initTheme() {
    //User Presf
    const userPref = localStorage.getItem('theme') || 'unknown';

    //Browswer/System Pref Logic
    var osPref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    /*
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
    */

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

//Graveyard
//const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';
  /*
  function applyTheme(newTheme: string): void {
    //Apply Stage
    const modeText = document.querySelector('.mode-text') as HTMLElement;
    document.documentElement.setAttribute('data-theme', newTheme);

    //Swap text on toggle
    localStorage.setItem('theme', newTheme);
    modeText.innerText = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';

    // Toggle check
    const themeToggle = document.getElementById('theme-toggle') as HTMLInputElement;
    if (themeToggle) {
      themeToggle.checked = newTheme === 'dark';
    }
  }

  function randomId() {
    let final = '';
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for(let i = 0; i < 7; i++) {
      const randChar = Math.floor(Math.random() * charSet.length);
      final += charSet.charAt(randChar);
    }
    return final;
  }

  const themeToggle = document.getElementById('theme-toggle') as HTMLInputElement;
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
  // Update the attribute name to Bootstrap standard
  function applyTheme(newTheme: string): void {
    const modeText = document.querySelector('.mode-text') as HTMLElement;
    // Bootstrap 5.3+ looks for 'data-bs-theme'
    document.documentElement.setAttribute('data-bs-theme', newTheme);

    localStorage.setItem('theme', newTheme);
    
    // Update button text to show what the NEXT click will do
    modeText.innerText = newTheme === 'dark' ? 'Switch to Light' : 'Switch to Dark';

    // Toggle check
    const themeToggle = document.getElementById('theme-toggle') as HTMLInputElement;
    if (themeToggle) {
      themeToggle.checked = newTheme === 'dark';
    }
  }
  */