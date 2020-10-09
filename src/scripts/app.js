import "../styles/styles.scss";
import * as func from "./scripts.js";
import state from "./data.js";

const anim = require("animate");
const levelText = document.getElementById("level");
const turnText = document.getElementById("turn");
// const toggleButton = document.getElementById("toggleBtn");
// const toggle = toggleButton.parentNode;
const playButton = document.getElementById("play");
const panels = document.querySelector(".panels-container");
const panelsList = state.panelsID;
const status = document.querySelector(".status");

window.addEventListener('load', (e) => {
  func.introScreen();
  func.runningLights(panelsList);
});

playButton.addEventListener("click", (e) => {
  if (!state.isRunning) {
    //console.log(state.lightShow);
    //clearInterval(state.lightShow);
    func.clearEvents();
    
    state.isGameStart = true;
    state.isRunning = true;
    state.isGameover = false;
    func.resetGame();
    func.runGame();
  }
});

panels.addEventListener("click", (e) => {
  console.log("click 2");
  if (!state.isPanelsLock) {
    func.playerInput(e.target.dataset.panel);
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

export default { document, status, levelText, turnText, panels};