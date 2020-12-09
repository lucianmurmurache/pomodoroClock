const pomodoroTimer = document.querySelector('#pomodoroTimer');

/* Buttons */
const startBtn = document.querySelector('#pomodoroStart');
const stopBtn = document.querySelector('#pomodoroStop');

/* 25 minutes in seconds */
let workSessionDuration = 1500;
let currentTimeLeftInSession = 1500;

/* 5 minutes in seconds */
let breakSessionDuration = 300;

/* Variable declarations */
let type = 'Work';
let timeSpentInCurrentSession = 0;

let isClockRunning = false;
let isClockStopped = true;

let updatedWorkSessionDuration;
let updatedBreakSessionDuration;

// Labels
let currentTaskLabel = document.querySelector('#pomodoroClockTask');
let workDurationInput = document.querySelector('#inputWorkDuration');
let breakDurationInput = document.querySelector('#inputBreakDuration');

workDurationInput.value = '25';
breakDurationInput.value = '5';

/* Event listeners */

// Convert minutes to seconds
const minutesToSeconds = (mins) => {
  return mins * 60;
};

// Update work time
workDurationInput.addEventListener('input', () => {
  updatedWorkSessionDuration = minutesToSeconds(workDurationInput.value);
});

// Update pause time
breakDurationInput.addEventListener('input', () => {
  updatedBreakSessionDuration = minutesToSeconds(breakDurationInput.value);
});

/* Display time left function */
const displayCurrentTimeLeftInSession = () => {
  const secondsLeft = currentTimeLeftInSession;
  let result = '';
  const seconds = secondsLeft % 60;
  const minutes = parseInt(secondsLeft / 60) % 60;
  const hours = parseInt(secondsLeft / 3600);
  // If less than 10
  addLeadingZero = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  if (hours > 0) result += `${hours}:`;
  result += `${addLeadingZero(minutes)}:${addLeadingZero(seconds)}`;
  progressBar.text.innerText = result.toString();
};

/* Display session log */
const displaySessionLog = (type) => {
  const sessionsList = document.querySelector('#pomodoroSessions');
  // Append li element to sessionList
  const li = document.createElement('li');

  if (type === 'Work') {
    sessionLabel = currentTaskLabel.value ? currentTaskLabel.value : 'Work';
    workSessionLabel = sessionLabel;
  } else {
    sessionLabel = 'Break';
  }

  let elapsedTime = parseInt(timeSpentInCurrentSession / 60);
  elapsedTime = elapsedTime > 0 ? elapsedTime : 'less than 1';

  const text = document.createTextNode(`${sessionLabel}: ${elapsedTime} min`);
  li.appendChild(text);
  sessionsList.appendChild(li);
};

/* Toggle between work and break sessions */
const stepDown = () => {
  if (currentTimeLeftInSession > 0) {
    // Decrease time left
    currentTimeLeftInSession--;
    // Increase time spent
    timeSpentInCurrentSession++;
  } else if (currentTimeLeftInSession === 0) {
    // Reset timer each time a session ends
    timeSpentInCurrentSession = 0;
    // Switch break to work or work to break
    if (type === 'Work') {
      currentTimeLeftInSession = breakSessionDuration;
      displaySessionLog('Work');
      type = 'Break';
      currentTaskLabel.value = 'Break';
      currentTaskLabel.disabled = true;
    } else {
      currentTimeLeftInSession = workSessionDuration;
      type = 'Work';
      if (currentTaskLabel.value === 'Break') {
        currentTaskLabel.value = workSessionLabel;
      }
      currentTaskLabel.disabled = false;
      displaySessionLog('Break');
    }
  }

  displayCurrentTimeLeftInSession();
};

/* Toggle stop button */
const showStopIcon = () => {
  const stopBtn = document.querySelector('#pomodoroStop');
  stopBtn.classList.remove('hidden');
};

/* Hide pause btn when clock not working */
const togglePlayPauseIcon = (reset) => {
  const playIcon = document.querySelector('#playIcon');
  const pauseIcon = document.querySelector('#pauseIcon');

  if (reset) {
    if (playIcon.classList.contains('hidden')) {
      playIcon.classList.remove('hidden');
    }

    if (!pauseIcon.classList.contains('hidden')) {
      pauseIcon.classList.add('hidden');
    }
  } else {
    playIcon.classList.toggle('hidden');
    pauseIcon.classList.toggle('hidden');
  }
};

/* Set new session duration based on the user input value */
const setUpdatedTimers = () => {
  if (type === 'Work') {
    currentTimeLeftInSession = updatedWorkSessionDuration
      ? updatedWorkSessionDuration
      : workSessionDuration;
    workSessionDuration = currentTimeLeftInSession;
  } else {
    currentTimeLeftInSession = updatedBreakSessionDuration
      ? updatedBreakSessionDuration
      : breakSessionDuration;
    breakSessionDuration = currentTimeLeftInSession;
  }
};

/* Progress bar */
const progressBar = new ProgressBar.Circle('#pomodoroTimer', {
  strokeWidth: 7,
  text: {
    value: '25:00',
    style: {
      fontSize: '6rem',
      color: '#006400',
      position: 'absolute',
      left: '50%',
      top: '50%',
      padding: 0,
      margin: 0,
      textShadow:
        '0px -1px 0 #fff, 0px 1px 0 #fff, 0px 0px 0 #fff, 0px 1px 0 #999999',
      transition: 'all 0.5s ease-in-out',
      transform: {
        prefix: true,
        value: 'translate(-50%, -50%)',
      },
    },
  },
  fill: 'rgba(0, 0, 0, 0.2)',
  trailColor: '#ff3232',
  color: '#006400',
});

/* Progress bar progress */
const calculateSessionProgress = () => {
  const sessionDuration =
    type === 'Work' ? workSessionDuration : breakSessionDuration;
  return (timeSpentInCurrentSession / sessionDuration) * 25;
};

/* Stop clock */
const stopClock = () => {
  setUpdatedTimers();
  displaySessionLog(type);
  // Reset timer
  clearInterval(clockTimer);
  // Update variables that timer has stopped
  isClockStopped = true;
  isClockRunning = false;
  // Reset time left to original state
  currentTimeLeftInSession = workSessionDuration;
  // Update displayed timer
  displayCurrentTimeLeftInSession();
  // Toggle between work and break
  type = 'Work';
  timeSpentInCurrentSession = 0;
};

/* Toggle clock function */
const toggleClock = (reset) => {
  togglePlayPauseIcon(reset);
  if (reset) {
    // Stop timer
    stopClock();
  } else {
    if (isClockStopped) {
      // Pause timer
      setUpdatedTimers();
      isClockStopped = false;
    }
    if (isClockRunning === true) {
      // Pause
      clearInterval(clockTimer);
      // Start timer
      isClockRunning = false;
    } else {
      // Start
      clockTimer = setInterval(() => {
        stepDown();
        displayCurrentTimeLeftInSession();
        progressBar.set(calculateSessionProgress());
      }, 1000);
      isClockRunning = true;
    }
    showStopIcon();
  }
};

/* Start */
startBtn.addEventListener('click', () => {
  toggleClock();
});

/* Stop */
stopBtn.addEventListener('click', () => {
  toggleClock(true);
});
