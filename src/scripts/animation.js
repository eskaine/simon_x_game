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
    timeOut(null, 1000, null, () => {
      DOM.document.querySelector(".overlay").style.display = "none";
      DOM.document
        .querySelector(".status")
        .classList.add("animate__slideInDown");
      DOM.document.getElementById("play").classList.add("animate__slideInUp");
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

  return {
    introScreen: introScreen,
    startScreen: startScreen
  };
})();
