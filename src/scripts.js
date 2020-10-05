import "./styles.scss";

const levelText = document.getElementById("level");
const turnText = document.getElementById("turn");
const toggleButton = document.getElementById("toggleBtn");
const toggle = toggleButton.parentNode;
const startButton = document.getElementById("startBtn");
const panels = document.getElementById("panels");
const panelsList = panels.children;

// Game Data
var state = {
  level: 0,
  isGameStart: false,
  isStrictOn: false,
  isGameover: true,
  isRunning: false,
  isPanelsLock: true,
  sequences: [],
  inputs: [],
  params: {
    flashTime: 800,
    toggleColors: { on: "#2E7D32", off: "#c62828" },
    turnStatus: {
      go: { color: "#2ecc71", text: "Your Turn" },
      wait: { color: "#f1c40f", text: "Running Sequence" },
      stop: { color: "#e74c3c", text: "Game Over" },
      retry: { color: "#e74c3c", text: "Retry" },
    },
  },
  audio: {
    clips: [
      "assets/do.wav",
      "assets/re.wav",
      "assets/mi.wav",
      "assets/fa.wav",
      "assets/so.wav",
      "assets/la.wav",
    ],
    error: "assets/error.wav",
  },
};

//runningLights();

startButton.addEventListener("click", (e) => {
  // if (!state.isRunning) {
  //   state.isGameStart = true;
  //   state.isRunning = true;
  //   state.isGameover = false;
  //   resetGame();
  //   runGame();
  // }
  runningLights();
});

panels.addEventListener("click", (e) => {
  if (!state.isPanelsLock) {
    playerInput(e.target.dataset.panel);
  }
});

toggle.addEventListener("click", (e) => {
  if (!state.isRunning) {
    if (toggle.style.justifyContent === "flex-start") {
      toggle.style.justifyContent = "flex-end";
      toggleButton.style.backgroundColor = state.params.toggleColors.on;
      state.isStrictOn = true;
    } else {
      toggle.style.justifyContent = "flex-start";
      toggleButton.style.backgroundColor = state.params.toggleColors.off;
      state.isStrictOn = false;
    }
  }
});

function runGame() {
  state.level++;
  state.sequences = [];
  state.inputs = [];
  levelText.innerHTML = `Level: ${state.level}`;
  genSequence();
}

function resetGame() {
  state.level = 0;
  state.sequences = [];
  state.inputs = [];
}

function playerInput(panel) {
  let index = Number(panel);
  playAudio(state.audio.clips[index]);
  state.inputs.push(index);
  if (state.inputs.length === state.sequences.length) {
    state.isPanelsLock = true;
    setTimeout(() => checkInput(), 500);
  }
}

// Compare player input to state.sequences
function checkInput() {
  for (let i in state.sequences) {
    if (state.inputs[i] !== state.sequences[i]) {
      playAudio(state.audio.error);

      // retry if strict is off else game over
      if (!state.isStrictOn) {
        changeStatus(turnText, state.params.turnStatus.retry);
        setTimeout(() => repeatSeq(), 2000);
      } else {
        changeStatus(turnText, state.params.turnStatus.stop);
      }
      break;
    }

    // continue game if all input is correct
    if (i == state.sequences.length - 1) {
      setTimeout(() => runGame(), 500);
    }
  }
}

function genSequence() {
  changeStatus(turnText, state.params.turnStatus.wait);
  let n = state.level;
  state.isRunning = true;

  // generate panel state.sequences
  let interval = setInterval(() => {
    console.log(panelsList.length);
    let index = Math.round(Math.random() * (panelsList.length - 1));
    playAudio(state.audio.clips[index]);
    state.sequences.push(index);
    flashPanel(index);
    n--;

    // setup player's turn
    if (n === 0) {
      clearInterval(interval);
      prepPlayer();
    }
  }, 1600);
}

// Retry
function repeatSeq() {
  changeStatus(turnText, state.params.turnStatus.wait);
  state.inputs = [];
  state.isRunning = true;
  let n = 0;

  // run through panel state.sequences
  let interval = setInterval(() => {
    let index = state.sequences[n];
    playAudio(state.audio.clips[index]);
    flashPanel(index);
    n++;

    // setup player's turn
    if (n === state.sequences.length) {
      clearInterval(interval);
      prepPlayer();
    }
  }, 1600);
}

function runningLights() {
  let index = 0;
  let round = 0;

  let interval = setInterval(() => {
    flashPanel(index);
    index++;

    // running light interval flash
    if (round >= 6 && index === panelsList.length) {
      clearInterval(interval);
      setTimeout(() => {
        for (let i = 0; i < panelsList.length; i++) {
          flashPanel(i, 500);
        }
        setTimeout(() => {
          runningLights();
        }, 1000);
      }, 800);
    }

    if (index >= panelsList.length) {
      index = 0;
      round++;
    }
  }, 100);
}

/* Helper functions */
function prepPlayer() {
  setTimeout(() => {
    state.isRunning = false;
    state.isPanelsLock = false;
    changeStatus(turnText, state.params.turnStatus.go);
  }, 1200);
}

function flashPanel(index, flashTime = state.params.flashTime) {
  panelsList[index].classList.add("active");
  setTimeout(() => {
    panelsList[index].classList.remove("active");
  }, flashTime);
}

function changeStatus(element, status) {
  element.style.color = status.color;
  element.innerHTML = status.text;
}

function playAudio(clips) {
  new Audio(clips).play();
}
