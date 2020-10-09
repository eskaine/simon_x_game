export { introScreen, runGame, resetGame, clearEvents, playerInput, runningLights };
import state from "./data.js";
import DOM from "./app.js";


function runGame() {
  if(state.level === 0) {
    triggerAnimation("animate__bounceInRight");
  }
  state.level++;
  state.sequences = [];
  state.inputs = [];
  DOM.levelText.innerText = `Level: ${state.level}`;
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

  // log player input
  state.inputs.push(index);

  // player can only input as long as the generated sequences length
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
        changeStatus(DOM.turnText, state.params.turnStatus.retry);
        setTimeout(() => repeatSeq(), 2000);
      } else {
        changeStatus(DOM.turnText, state.params.turnStatus.stop);
      }
      break;
    }

    // continue game if all input is correct
    if (i == state.sequences.length - 1) {
      setTimeout(() => runGame(), 500);
    }
  }
}

// Generate memory sequences
function genSequence() {
  changeStatus(DOM.turnText, state.params.turnStatus.wait);
  let n = state.level;
  state.isRunning = true;
  // generate panel state.sequences
  let interval = setInterval(() => {
    let index = Math.round(Math.random() * (state.panelsID.length - 1));
    playAudio(state.audio.clips[index]);
    state.sequences.push(index);
    flashPanel(DOM.document.getElementById(state.panelsID[index]));
    n--;

    // setup player's turn
    if (n === 0) {
      clearInterval(interval);
      prepPlayer(DOM.turnText);
    }
  }, 1600);
}

// Retry
function repeatSeq() {
  changeStatus(DOM.turnText, state.params.turnStatus.wait);
  state.inputs = [];
  state.isRunning = true;
  let n = 0;

  // run through panel state.sequences
  let interval = setInterval(() => {
    let index = state.sequences[n];
    playAudio(state.audio.clips[index]);
    flashPanel(DOM.document.getElementById(state.panelsID[index]));
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
    flashPanel(DOM.document.getElementById(state.panelsID[index]));
    index++;

    // running light interval flash
    if (round >= 6 && index === state.panelsID.length) {
      //clearInterval(interval);
      clearEvents();
      let timeout1 = setTimeout(() => {
        for (let i = 0; i < state.panelsID.length; i++) {
          flashPanel(DOM.document.getElementById(state.panelsID[i]), 400);
          //DOM.document.getElementById(state.panelsID[i]).classList.toggle("active");
        }

        let timeout2 = setTimeout(() => {
          runningLights();
        }, 1000);
        // storing timeouts 1
        state.runningEvents.timeouts.push(timeout2);
      }, 1100);
      // storing timeouts 2
      state.runningEvents.timeouts.push(timeout1);
    }

    // setting up for the above interval flash
    if (index >= state.panelsID.length) {
      index = 0;
      round++;
    }
  }, 100);

  // storing intervals
  state.runningEvents.intervals.push(interval);
}

// Clear all timeouts and intervals
function clearEvents() {
  let timeouts = state.runningEvents.timeouts;
  let intervals = state.runningEvents.intervals;

  for (let i of intervals) {
    window.clearInterval(i);
  }

  for (let t of timeouts) {
    window.clearTimeout(t);
  }
}

// Intro screen before actual game
function introScreen() {
  let brandOverlay = DOM.document.querySelector('.brand-overlay');
  let underlay = DOM.document.querySelector('.underlay');
  let brand = DOM.document.querySelector('.brand');

  timeOut("animate__fadeInDown", 1500, brand, () => {
    brandOverlay.classList.remove("animate__fadeIn");
  });
  
  timeOut("animate__fadeOut", 3500, brandOverlay, () => {
    timeOut(null, 2000, null, () => {
      brandOverlay.style.display = "none";
    });
  });

  timeOut("animate__fadeOut", 6000, underlay, () => {
    timeOut(null, 2000, null, () => {
      underlay.style.display = "none";
    });
  });
}

/* Helper functions */
function prepPlayer() {
  setTimeout(() => {
    state.isRunning = false;
    state.isPanelsLock = false;
    changeStatus(DOM.turnText, state.params.turnStatus.go);
  }, 1200);
}

function flashPanel(element, flashTime = state.params.flashTime) {
  element.classList.add("active");
  setTimeout(() => {
    element.classList.remove("active");
  }, flashTime);
}

function changeStatus(element, status) {
  element.style.color = status.color;
  element.innerHTML = status.text;
}

function playAudio(clips) {
  new Audio(clips).play();
}

function timeOut(className, timing, element = null,  callback = null) {
  setTimeout(() => {
    if(callback) {
      callback();
    }

    if(element) {
      element.classList.toggle(className);
    }
  }, timing);
}