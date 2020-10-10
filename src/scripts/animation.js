import DOM from "./app.js";

export default (() => {
  // Intro screen before actual game
  function introScreen() {
    let brandOverlay = DOM.document.querySelector(".brand-overlay");
    let underlay = DOM.document.querySelector(".underlay");
    let brand = DOM.document.querySelector(".brand");

    timeOut("animate__fadeInDown", 1500, brand, () => {
      brandOverlay.classList.remove("animate__fadeIn");
    });

    timeOut("animate__fadeOut", 3500, brandOverlay, () => {
      timeOut(null, 2000, null, () => {
        brandOverlay.style.display = "none";
      });
    });

    timeOut("animate__fadeOut", 6000, underlay, () => {
      toggleSettings(false);
      timeOut(null, 2000, null, () => {
        underlay.style.display = "none";
      });
    });
  }

  function startScreen() {
    let playClick = DOM.document.querySelector(".play-click");

    // remove unused classes
    playClick.classList.remove(
      "animate__infinite",
      "animate__slow",
      "animate__flash"
    );

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

  function toggleSettings(toHide) {
    let settingsBtn = document.getElementById("settings");
    settingsBtn.classList.remove("animate__fadeIn", "animate__fadeOut");
    if(toHide) {
      settingsBtn.classList.add("animate__fadeOut");
    } else {
      settingsBtn.classList.add("animate__fadeIn");
    }
  }

  function toggleModal(toHide) {
    let settingsBtn = document.querySelector(".settings-modal");
    settingsBtn.classList.remove("animate__slideInDown", "animate__slideOutUp");
    if(toHide) {
      settingsBtn.classList.add("animate__slideOutUp");
    } else {
      settingsBtn.classList.add("animate__slideInDown");
    }
  }

  return {
    introScreen: introScreen,
    startScreen: startScreen,
    changeLevel: changeLevel,
    toggleSettings: toggleSettings,
    toggleModal, toggleModal
  };
})();
