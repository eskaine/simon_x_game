import state from "./data.js";
import func from "./scripts.js";
import DOM from "./app.js";

export default (() => {
  // Intro screen before actual game
  function introScreen() {
    let brandOverlay = DOM.document.querySelector(".brand-overlay");
    let underlay = DOM.document.querySelector(".underlay");
    let brand = DOM.document.querySelector(".brand");

    timeOut("animate__fadeInDown", 1500, brand, () => {
      brandOverlay.classList.remove("animate__fadeIn");
      timeOut("animate__bounce", 700, brand, () => {
        brand.classList.remove("animate__fadeInDown");
      });
    });

    timeOut("animate__fadeOut", 3800, brandOverlay, () => {
      timeOut(null, 2300, null, () => {
        brandOverlay.style.display = "none";
      });
    });

    timeOut("animate__fadeOut", 6300, underlay, () => {
      runningLights();
      toggleSettings(false);
      timeOut(null, 300, null, () => {
        underlay.style.display = "none";
      });
    });
  }

  // Title/Start screen
  function startScreen() {
    let playClick = DOM.document.querySelector(".play-click");

    // remove unused classes
    playClick.classList.remove(
      "animate__infinite",
      "animate__slow",
      "animate__flash"
    );

    // clear start screen
    DOM.document.querySelector(".title").classList.add("animate__backOutUp");
    playClick.classList.add("animate__backOutDown");
    timeOut(null, 500, null, () => {
      DOM.document.querySelector(".overlay").style.display = "none";
      DOM.document
        .querySelector(".status")
        .classList.add("animate__slideInDown");
      DOM.document.getElementById("play").classList.add("animate__slideInUp");
    });
  }

  // Status text
  function changeLevel(changeLevelTextCallback) {
    let status = DOM.document.querySelector(".status");
    status.classList.remove("animate__slideInDown", "animate__fadeInDown");

    timeOut(null, 0, null, () => {
      status.classList.add("animate__fadeOutUp");
      setTimeout(() => {
        changeLevelTextCallback();
        status.classList.remove("animate__fadeOutUp");
        status.classList.add("animate__fadeInDown");
      }, 500);
    });
  }

  // Start screen running lights
  function runningLights() {
    let index = 0;
    let round = 0;
    let interval = setInterval(() => {
      func.flashPanel(DOM.document.getElementById(state.panelsID[index]), 800);
      index++;

      // running light interval flash
      if (round >= 6 && index === state.panelsID.length) {
        //clearInterval(interval);
        func.clearEvents();
        let timeout1 = setTimeout(() => {
          for (let i = 0; i < state.panelsID.length; i++) {
            func.flashPanel(DOM.document.getElementById(state.panelsID[i]), 500);
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

  // Settings button
  function toggleSettings(toHide) {
    let settingsBtn = document.getElementById("settings");
    settingsBtn.classList.remove("animate__fadeIn", "animate__fadeOut");
    if (toHide) {
      settingsBtn.classList.add("animate__fadeOut");
    } else {
      settingsBtn.classList.add("animate__fadeIn");
    }
  }

  // Modal
  function toggleModal(toHide) {
    let settingsBtn = document.querySelector(".settings-modal");
    settingsBtn.classList.remove("animate__slideInDown", "animate__slideOutUp");
    if (toHide) {
      settingsBtn.classList.add("animate__slideOutUp");
    } else {
      settingsBtn.classList.add("animate__slideInDown");
    }
  }

   // Timeout helper
   function timeOut(className, timing, element = null, callback = null) {
    setTimeout(() => {
      if (callback) {
        callback();
      }

      if (element) {
        element.classList.toggle(className);
      }
    }, timing);
  }

  return {
    introScreen: introScreen,
    startScreen: startScreen,
    changeLevel: changeLevel,
    toggleSettings: toggleSettings,
    toggleModal,
    toggleModal,
  };
})();
