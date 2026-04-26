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

    let optionsHTML = '<option selected value="">Choose Courses</option>';
    data.forEach(item => {
      optionsHTML += `<option value="${item.id}">${item.display}</option>`;
    });

    $('#course').html(optionsHTML);
    $('#uvuId').hide();

    $('#course').on('change', function(this: HTMLSelectElement) {
      if ($(this).val() === '') {
        $('#uvuId').hide().val('');
      } else {
        $('#uvuId').show();
        if ($('#uvuId').val().length === 8) {
          LoadLogs($(this).val() as string);
        }
      }
    });
  }

  //Checks if number in uvuID input is exactly 8 digits
  function numChecker() {
    $('#uvuId').on('input', function(this: HTMLInputElement) {
      if($(this).val().length > 8) {
        $(this).val.slice(0,8);
        console.warn('ID cannot be exceed 8 digits')
      }
    });

    $('#uvuId').on('change', function(this: HTMLInputElement) {
      if($(this).val().length !== 8 && $(this).val().length > 0) {
        $(this).addClass('is-invalid').removeClass('is-valid'); // Adds Bootstrap red border and icon
        alert('UVU ID must be exactly 8 digits long');
        $(this).val('');
      } else if ($(this).val().length === 8) {
        $(this).removeClass('is-invalid').addClass('is-valid'); // Adds Bootstrap green border
        if($('#course').val()) LoadLogs($('#course').val() as string);
      }
    });
  }

  async function LoadLogs(courseId: string) {
    // Warning for if uvuId is entered 
    if(!courseId || !$('#uvuId').val() || $('#uvuId').val().length !== 8) {
      console.warn("Cannot load: courseId or uvuId is incomplete.");
      return;
    }

    //Clear Previous Results
    $('#logs').empty();

    const response = await axios.get<Log[]>(
      `/api/v1/logs?courseId=${courseId}&uvuId=${$('#uvuId').val()}`
    );

    const data = await response.data;
    console.log(data);

    $('#uvuIdDisplay').html(`Students Logs for ${$('#uvuId').val()}`);
    
    if(data && data.length > 0) {
      let items = data.map(log =>
        `<li class="list-group-item list-group-item-action border-start border-4 border-success mb-2 shadow-sm">
          <div class="d-flex w-100 justify-content-between">
            <small class="text-muted fw-bold">${log.date}</small>
          </div>
          <p class="mb-1 mt-2 font-monospace" style="white-space: pre-wrap;">${log.text}</p>
        </li>`).join('');
      $('#logs').html(items);
    } else {
      $('#logs').html('<li class="list-group-item text-center text-muted">No logs found for this student.</li>');
    }
    $('#log_btn').prop('disabled', false);
  }

  //Helper Function for displaying logs. Click the log header to make the logs hide/appear
  function logDisplay() {
    $('#uvuIdDisplay').on('click', function (this: HTMLElement) {
      const isHidden = $('#logs').is(':hidden');

      $('#logs').toggle();
      $('#log_btn').prop('disabled', !isHidden);
    });
  }

  //Add a new log.
  function addLog() {
    $('#log_btn').on('click', async function (event: any) {
      event.preventDefault();

      let logDate = new Date();
      let randId = randomId();

      //Check for empty logs
      if(!$('#log_textarea').val().trim()) return;

      // Add a new log to the logs in db.json
      try{
        await axios.post<Log[]>('/api/v1/logs', {
          courseId: $('#course').val(),
          uvuId: $('#uvuId').val(),
          date: `${logDate.toLocaleDateString()}, ${logDate.toLocaleTimeString()}`,
          text: $('#log_textarea').val(),
          id: randId
        });

        console.log('Log added successfully');

        // Clear the text area value after added to logs
        $('#log_textarea').val('');

        // Reload logs after a new log is added
        await LoadLogs($('#course').val() as string);
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
 $('#theme-toggle').on('click', () => {
    var currentTheme = $('html').attr('data-bs-theme');
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  //Support function to apply themes
  // Update the attribute name to Bootstrap standard
  function applyTheme(newTheme: string): void {
    // Bootstrap 5.3+ looks for 'data-bs-theme'
    $('html').attr('data-bs-theme', newTheme);

    localStorage.setItem('theme', newTheme);
    
    // Update button text to show what the NEXT click will do
    $('.mode-text').text(newTheme === 'dark' ? 'Switch to Light' : 'Switch to Dark');
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