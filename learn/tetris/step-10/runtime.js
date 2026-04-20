/*
 * Step 10 runtime.
 *
 * Loads CheerpJ, writes the SDK + student jars into /str/, loads them
 * as a CJ3Library (cheerpjRunLibrary, not cheerpjRunMain), invokes
 * MyTetris.main() so the student's "new MyTetris().run()" fires, then
 * drives the game loop from JS by calling tick(dtMs) on the instance
 * that run() parked in Game.current.
 *
 * Auto-generated -- edit .claude/build-tetris.py and rerun, don't
 * hand-edit this file.
 */
(function () {
  "use strict";

  var SDK_JAR_B64  = "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";
  var STEP_JAR_B64 = "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";
  var STEP_JAR_VFS = "/str/step-10.jar";

  function b64ToBytes(b64) {
    var bin = atob(b64);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  var canvas    = document.getElementById("stage-canvas");
  var ctx       = canvas.getContext("2d");
  var runBtn    = document.getElementById("run-btn");
  var statusEl  = document.getElementById("run-status");
  var loadEl    = document.getElementById("loading-overlay");
  var consoleEl = document.getElementById("console-output");

  var cheerpjReady = false;
  var lib = null;
  var gameInstance = null;
  var rafId = 0;
  var tickInFlight = false;
  var lastT = 0;
  var running = false;
  var keyQueue = [];

  function setStatus(text, mode) {
    statusEl.textContent = text;
    statusEl.dataset.mode = mode || "idle";
  }
  function logLine(msg) {
    var line = document.createElement("div");
    line.textContent = msg;
    consoleEl.appendChild(line);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }
  function showLoading(visible) {
    loadEl.dataset.visible = visible ? "true" : "false";
  }
  function describeError(e) {
    if (!e) return "unknown";
    if (typeof e === "string") return e;
    if (e.message) return e.message;
    try { return JSON.stringify(e); } catch (_) { return String(e); }
  }

  /* ---------- Screen natives ---------- */
  function nClear(_lib, r, g, b) {
    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  function nFillRect(_lib, x, y, w, h, r, g, b) {
    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    ctx.fillRect(x, y, w, h);
  }
  function nStrokeRect(_lib, x, y, w, h, r, g, b) {
    ctx.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  }
  function nText(_lib, x, y, s, r, g, b) {
    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    ctx.font = "13px 'JetBrains Mono', ui-monospace, monospace";
    ctx.textBaseline = "top";
    ctx.fillText(String(s), x, y);
  }
  function nWidth(_lib)  { return canvas.width;  }
  function nHeight(_lib) { return canvas.height; }

  /* ---------- Keyboard ----------
     CheerpJ refuses to have two Java calls in-flight at once, so we
     can't invoke handleKey() directly from the keydown listener while
     the rAF loop's tick() is awaiting. Queue keys here; the frame loop
     drains them at the top of each tick. */
  window.addEventListener("keydown", function (e) {
    if (!running || !gameInstance) return;
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) !== -1) {
      e.preventDefault();
    }
    keyQueue.push(e.keyCode | 0);
  });

  /* ---------- CheerpJ setup ---------- */
  async function loadCheerpJScript() {
    if (typeof cheerpjInit !== "undefined") return;
    await new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = "https://cjrtnc.leaningtech.com/4.2/loader.js";
      s.onload = resolve;
      s.onerror = function () { reject(new Error("CheerpJ loader failed to load")); };
      document.head.appendChild(s);
    });
  }

  async function ensureCheerpJ() {
    if (cheerpjReady) return;
    setStatus("Java runtime loading...", "loading");
    showLoading(true);
    logLine("[init] loading CheerpJ runtime (first time can take 10-30s)");

    await loadCheerpJScript();

    await cheerpjInit({
      version: 8,
      status: "none",
      natives: {
        Java_dev_yasuda_tetris_Screen_jsClear:      nClear,
        Java_dev_yasuda_tetris_Screen_jsFillRect:   nFillRect,
        Java_dev_yasuda_tetris_Screen_jsStrokeRect: nStrokeRect,
        Java_dev_yasuda_tetris_Screen_jsText:       nText,
        Java_dev_yasuda_tetris_Screen_jsWidth:      nWidth,
        Java_dev_yasuda_tetris_Screen_jsHeight:     nHeight,
      },
    });

    await cheerpOSAddStringFile("/str/sdk.jar", b64ToBytes(SDK_JAR_B64));
    await cheerpOSAddStringFile(STEP_JAR_VFS,   b64ToBytes(STEP_JAR_B64));
    logLine("[init] jars loaded into /str/");

    cheerpjReady = true;
    showLoading(false);
    setStatus("ready", "ready");
    logLine("[init] CheerpJ ready");
  }

  /* ---------- Frame loop (JS-driven) ---------- */
  function startFrameLoop() {
    cancelAnimationFrame(rafId);
    lastT = performance.now();
    keyQueue.length = 0;
    async function frame(t) {
      if (!running) return;
      if (gameInstance && !tickInFlight) {
        tickInFlight = true;
        try {
          while (keyQueue.length > 0) {
            await gameInstance.handleKey(keyQueue.shift() | 0);
          }
          var dtMs = Math.max(0, Math.round(t - lastT));
          lastT = t;
          await gameInstance.tick(dtMs | 0);
        } catch (e) {
          running = false;
          setStatus("error: " + describeError(e), "error");
          logLine("[tick error] " + describeError(e));
          return;
        } finally {
          tickInFlight = false;
        }
      } else {
        lastT = t;
      }
      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);
  }

  /* ---------- Run button ---------- */
  runBtn.addEventListener("click", async function () {
    runBtn.disabled = true;
    running = false;
    gameInstance = null;
    cancelAnimationFrame(rafId);
    try {
      await ensureCheerpJ();
      setStatus("starting Java...", "loading");
      logLine("[run] cheerpjRunLibrary");

      // Fresh library each run.
      lib = await cheerpjRunLibrary("/str/sdk.jar:" + STEP_JAR_VFS);

      // Fire the student's main() -- new MyTetris().run() stashes
      // the instance in Game.current.
      var MyTetris = await lib.MyTetris;
      await MyTetris.main([]);
      logLine("[run] MyTetris.main() returned");

      // Grab the instance.
      var GameClass = await lib.dev.yasuda.tetris.Game;
      gameInstance = await GameClass.current();
      if (!gameInstance) {
        setStatus("error: Game.current was null", "error");
        logLine("[error] Game.run() did not stash an instance");
        return;
      }

      running = true;
      setStatus("running", "running");
      logLine("[run] frame loop starting");
      // Focus the canvas so the player can use arrow keys immediately.
      try { canvas.focus(); } catch (_) {}
      startFrameLoop();
    } catch (e) {
      console.error(e);
      setStatus("error: " + describeError(e), "error");
      logLine("[error] " + describeError(e));
    } finally {
      runBtn.disabled = false;
    }
  });

  setStatus("ready to run", "idle");
})();
