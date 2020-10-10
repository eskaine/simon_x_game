import state from "./data.js";
import DOM from "./app.js";
import animation from "./animation.js";

export default (() => {
  function runGame() {
    genSequence();
  }

  function nextLevel() {
    state.level++;
    state.sequences = [];
    state.inputs = [];
  }

  function resetGame() {
    state.level = 1;
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
        nextLevel();
        animation.changeLevel(() => {
          DOM.levelText.innerText = `Level: ${state.level}`;
          DOM.turnText.innerText = `Next...`;
        });
        setTimeout(() => runGame(), 1500);
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
    if(state.isAudioOn) {
      new Audio(clips).play();
    }
  }

  return {
    runGame: runGame,
    resetGame: resetGame,
    clearEvents: clearEvents,
    playerInput: playerInput,
    runningLights: runningLights,
  };
})();
