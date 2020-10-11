import state from "./data.js";
import DOM from "./app.js";
import animation from "./animation.js";

export default (() => {
  function runGame() {
    sequencing(true);
  }

  function nextLevel() {
    state.level++;
    state.sequences = [];
    state.inputs = [];
  }

  function resetGame() {
    state.level = 1;
    state.speed = 1200;
    state.isGameover = false;
    animation.changeLevel(() => {
      DOM.levelText.innerText = `Level: ${state.level}`;
    });
  }

  function resetState() {
    state.inputs = [];
    state.sequences = [];
  }

  // Track player input
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
        if (state.isStrictOff) {
          changeStatus(DOM.turnText, state.params.turnStatus.retry);
          setTimeout(() => sequencing(false), 2000);
        } else {
          state.isGameover = true;
          changeStatus(DOM.turnText, state.params.turnStatus.stop);
        }
        break;
      }

      // continue game if all input is correct
      if (i == state.sequences.length - 1) {
        nextLevel();
        animation.changeLevel(() => {
          DOM.levelText.innerText = `Level: ${state.level}`;
          DOM.turnText.innerText = `Next...`;
        });
        setTimeout(() => runGame(), 1500);
      }
    }
  }

  // Generate new sequence or replay existing seqeunce
  function sequencing(isNew) {
    setSpeed(isNew);
    togglePlayButton(true);
    changeStatus(DOM.turnText, state.params.turnStatus.wait);
    state.isRunning = true;
    let n;

    if (isNew) {
      n = state.level;
    } else {
      state.inputs = [];
      n = 0;
    }

    let interval = setInterval(() => {
      let index;

      // generate new sequence
      if (isNew) {
        index = Math.round(Math.random() * (state.panelsID.length - 1));
        state.sequences.push(index);
        n--;
        // set to existing sequence
      } else {
        index = state.sequences[n];
        n++;
      }

      // display sequence
      let flashSpeed =
        state.speed < state.params.flashTime
          ? state.speed
          : state.params.flashTime;
      playAudio(state.audio.clips[index]);
      flashPanel(
        DOM.document.getElementById(state.panelsID[index]),
        flashSpeed
      );

      // pass control to player when sequencing end
      if (n === (isNew ? 0 : state.sequences.length)) {
        clearInterval(interval);
        prepPlayer();
        setTimeout(() => {
          togglePlayButton(false);
        }, 800);
      }
    }, state.speed);
  }

  /* Helper functions */

  // Set panel flash speed
  function setSpeed(isNotRepeat) {
    // speed up
    if (
      !state.isMaxSpeed &&
      state.isSpeedUp &&
      isNotRepeat &&
      state.level > 1 &&
      state.speed > 200
    ) {
      state.speed -= 50;
    }

    // set max speed
    if (state.isMaxSpeed) {
      state.speed = 200;
    }
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

  // Setup player turn
  function prepPlayer() {
    setTimeout(() => {
      state.isRunning = false;
      state.isPanelsLock = false;
      changeStatus(DOM.turnText, state.params.turnStatus.go);
    }, 1200);
  }

  // Panel flash
  function flashPanel(element, flashTime = state.params.flashTime) {
    element.classList.add("active");
    setTimeout(() => {
      element.classList.remove("active");
    }, flashTime);
  }

  // Change status text
  function changeStatus(element, status) {
    element.style.color = status.color;
    element.innerHTML = status.text;
  }

  function playAudio(clips) {
    if (state.isAudioOn) {
      new Audio(clips).play();
    }
  }

  function togglePlayButton(toDisable) {
    if (toDisable) {
      DOM.playButton.classList.add("toggleOff");
    } else {
      DOM.playButton.classList.remove("toggleOff");
    }
  }

  return {
    runGame: runGame,
    resetGame: resetGame,
    resetState: resetState,
    clearEvents: clearEvents,
    playerInput: playerInput,
    flashPanel: flashPanel
  };
})();
