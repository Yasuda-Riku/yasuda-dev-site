/*
 * Step 09 runtime.
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
  var STEP_JAR_VFS = "/str/step-09.jar";

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
