import "../styles/styles.scss";
import func from "./scripts.js";
import animate from "./animation.js";
import state from "./data.js";

const levelText = document.getElementById("level");
const turnText = document.getElementById("turn");
const playButton = document.getElementById("play");
const settingsOverlay = document.querySelector(".settings-overlay");

// Autorun Game Intro
window.addEventListener("load", (e) => {
  animate.introScreen();
});

// Clear Home Screen
document.querySelector(".overlay").addEventListener("click", (e) => {
  if (e.target.classList.value.includes("overlay")) {
    func.clearEvents();
    animate.startScreen();
  }
});

// Start Game
playButton.addEventListener("click", (e) => {
  if (state.isGameover) {
    func.resetGame();
  }

  if (!state.isRunning) {
    state.isGameStart = true;
    state.isRunning = true;
    func.resetState();
    func.runGame();
  }
});

// Player Input
document.querySelector(".panels-container").addEventListener("click", (e) => {
  if (!state.isPanelsLock && state.inputs.length < state.sequences.length) {
    func.playerInput(e.target.dataset.panel);
  }
});

// Settings Toggle
document.querySelector(".settings-modal").addEventListener("click", (e) => {
  if (e.target.tagName === "I") {
    e.target.classList.toggle("toggleOff");
  }

  if (e.target.parentNode.id === "volume") {
    state.isAudioOn = state.isAudioOn ? false : true;
  }

  if (e.target.parentNode.id === "redo") {
    state.isStrictOff = state.isStrictOff ? false : true;
  }

  if (e.target.parentNode.id === "speed") {
    state.isSpeedUp = state.isSpeedUp ? false : true;
  }

  if (e.target.parentNode.id === "max-speed") {
    state.isMaxSpeed = state.isMaxSpeed ? false : true;
  }
});

// Display Modal
document.getElementById("settings").addEventListener("click", (e) => {
  animate.toggleSettings(true);
  settingsOverlay.style.display = "block";
  animate.toggleModal(false);
});

// Hide Modal
settingsOverlay.addEventListener("click", (e) => {
  if (e.target.classList.value.includes("settings-overlay")) {
    animate.toggleModal(true);

    setTimeout(() => {
      settingsOverlay.style.display = "none";
      animate.toggleSettings(false);
    }, 800);
  }
});

export default { document, levelText, turnText, playButton };
