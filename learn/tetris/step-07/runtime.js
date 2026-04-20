/*
 * Step 07 runtime.
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
  var STEP_JAR_VFS = "/str/step-07.jar";

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
