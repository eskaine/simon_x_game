// Game Data
export default {
    level: 0,
    isGameStart: false,
    isStrictOn: false,
    isGameover: true,
    isRunning: false,
    isPanelsLock: true,
    sequences: [],
    inputs: [],
    panelsID: ["p1", "p2", "p3", "p4", "p5", "p6"],
    params: {
      flashTime: 800,
      toggleColors: { on: "#2E7D32", off: "#c62828" },
      turnStatus: {
        go: { color: "#2ecc71", text: "Your Turn" },
        wait: { color: "#f1c40f", text: "Running Sequence" },
        stop: { color: "#e74c3c", text: "Game Over" },
        retry: { color: "#e74c3c", text: "Retry" },
      },
    },
    audio: {
      clips: [
        "assets/do.wav",
        "assets/re.wav",
        "assets/mi.wav",
        "assets/fa.wav",
        "assets/so.wav",
        "assets/la.wav",
      ],
      error: "assets/error.wav",
    },
    runningEvents: {
      timeouts: [],
      intervals: []
    }
  };