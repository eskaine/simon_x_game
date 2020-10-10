import "../styles/styles.scss";
import func from "./scripts.js";
import animate from "./animation.js";
import state from "./data.js";
import data from "./data.js";

const status = document.querySelector(".status");
const levelText = document.getElementById("level");
const turnText = document.getElementById("turn");
// const toggleButton = document.getElementById("toggleBtn");
// const toggle = toggleButton.parentNode;
const settingsModal = document.querySelector(".settings-overlay");

// Autorun Game Intro
window.addEventListener("load", (e) => {
  animate.introScreen();
  func.runningLights();
});

// Clear Home Screen
document.querySelector(".overlay").addEventListener("click", (e) => {
  if (e.target.classList.value.includes("overlay")) {
    func.clearEvents();
    animate.startScreen();
  }
});

// Start Game
document.getElementById("play").addEventListener("click", (e) => {
  if (!state.isRunning) {
    state.isGameStart = true;
    state.isRunning = true;
    state.isGameover = false;
    func.resetGame();
    func.runGame();
  }
});

// Player Input
document.querySelector(".panels-container").addEventListener("click", (e) => {
  if (!state.isPanelsLock && state.inputs.length < state.sequences.length) {
    func.playerInput(e.target.dataset.panel);
  }
})

// Sound Toggle
document.querySelector(".volume").addEventListener("click", e => {
  let element = e.target.parentNode;
  if(element.classList.value.includes("up")) {
    element.style.display = "none";
    document.querySelector(".volume-down").style.display = "block";
    data.isAudioOn = false;
  }
  if(element.classList.value.includes("down")) {
    element.style.display = "none";
    document.querySelector(".volume-up").style.display = "block";
    data.isAudioOn = true;
  }
});

// Display Modal
document.getElementById("settings").addEventListener("click", e => {
  animate.toggleSettings(true);
  settingsModal.style.display = "block";
  animate.toggleModal(false);
});

// Hide Modal
settingsModal.addEventListener("click", e => {
  if(e.target.classList.value.includes("settings-overlay")) {
    animate.toggleModal(true);
    
    setTimeout(() => {
      settingsModal.style.display = "none";
      animate.toggleSettings(false);
    }, 800);
  }
});

// toggle.addEventListener("click", (e) => {
//   if (!state.isRunning) {
//     if (toggle.style.justifyContent === "flex-start") {
//       toggle.style.justifyContent = "flex-end";
//       toggleButton.style.backgroundColor = state.params.toggleColors.on;
//       state.isStrictOn = true;
//     } else {
//       toggle.style.justifyContent = "flex-start";
//       toggleButton.style.backgroundColor = state.params.toggleColors.off;
//       state.isStrictOn = false;
//     }
//   }
// });

export default { document, status, levelText, turnText };
