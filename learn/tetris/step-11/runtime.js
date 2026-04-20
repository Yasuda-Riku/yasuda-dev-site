/*
 * Step 11 runtime.
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
  var STEP_JAR_VFS = "/str/step-11.jar";

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
