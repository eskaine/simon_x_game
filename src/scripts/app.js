import "../styles/styles.scss";
import func from "./scripts.js";
import animate from "./animation.js";
import state from "./data.js";

const status = document.querySelector(".status");
const levelText = document.getElementById("level");
const turnText = document.getElementById("turn");
// const toggleButton = document.getElementById("toggleBtn");
// const toggle = toggleButton.parentNode;
const panels = document.querySelector(".panels-container");

window.addEventListener("load", (e) => {
  animate.introScreen();
  func.runningLights();
});

document.querySelector(".overlay").addEventListener("click", (e) => {
  if (e.target.classList.value.includes("overlay")) {
    // clear running lights
    func.clearEvents();
    // clear title and start
    animate.startScreen();
  }
});

document.getElementById("play").addEventListener("click", (e) => {
  if (!state.isRunning) {
    state.isGameStart = true;
    state.isRunning = true;
    state.isGameover = false;
    func.resetGame();
    func.runGame();
  }
});

panels.addEventListener("click", (e) => {
  if (!state.isPanelsLock) {
    console.log(e.target.dataset.panel);
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

export default { document, status, levelText, turnText, panels };
