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
