/*
 * Step 12 runtime.
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
  var STEP_JAR_VFS = "/str/step-12.jar";

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
