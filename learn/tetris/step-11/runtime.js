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
