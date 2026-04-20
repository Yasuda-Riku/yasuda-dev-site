/*
 * Step 1 runtime.
 *
 * Loads CheerpJ, writes SDK + student jars into CheerpJs /str/ virtual
 * filesystem (so no HTTP jar fetches happen, sidestepping Cloudflare
 * Range issues), then calls cheerpjRunMain. The game loop runs entirely
 * inside Java (Game.run() while-loops with Thread.sleep) because CheerpJ
 * 4.2 s JS->Java instance method bridge triggers WASM memory errors.
 *
 * JS -> Java flow:
 *   - Canvas draw primitives (Screen.jsClear, jsFillRect, ...)
 *   - Keyboard events are queued in JS; Java polls via Game.jsPollKey().
 */
(function () {
  "use strict";

  /* ---------- Embedded jars (regenerate when SDK changes) ---------- */
  var SDK_JAR_B64    = "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";
  var STEP01_JAR_B64 = "UEsDBAoAAAgAAEV8lFwAAAAAAAAAAAAAAAAJAAQATUVUQS1JTkYv/soAAFBLAwQUAAgICABFfJRcAAAAAAAAAAAAAAAAFAAAAE1FVEEtSU5GL01BTklGRVNULk1G803My0xLLS7RDUstKs7Mz7NSMNQz4OVyLkpNLElN0XWqtFIwAoroWShoeKWWOBUlZuYVKxTrFenl62nycvFyAQBQSwcIX6bnKEEAAABAAAAAUEsDBBQACAgIAEV8lFwAAAAAAAAAAAAAAAAOAAAATXlUZXRyaXMuY2xhc3N9Ut1OE1EQ/k5326XL1i7aP6BV/IP+KNXE9EYkKVUJYZGkS2qIF3Joj7i63ZrtloR7XsBX4MZruCiJJj4AT+CzEKLOWWskAdxNZuabnflmvnP25OfX7wCe4LGOCBQNqoEoYgyZjtit7vH+oMOrgQh8p19d5l3BEFtwPCdYZFCKpZaGMYaxtb2NsEKHBkWacQOGJFH8gRfHNSQ1mAYmcJ0he5G30XN7PkN0yao3VhkmrStKnupIIa0hYyCLHEPuYp3d9oXwiKvtCk6c+eKVZKWW3GzKwLRcK/683lx9u9ysb8ohBQM3cYuUvXNctynaAcNMcYWe/7AxqI11y2ZgKwyJRs/rB9wLWtwdCIVOWKfvzfXXtoxTsvaFZck4J+Nehw42aTmeeDXobgt/g2+7lFG73CExmeIb6wPf5VWXeztVm6Z6O+HAmC+8jiCZhctk/jmLsDBhB7z9cY1/GhHrdm/gt8VLR4LE3+ubl0Nwm+4vQospyGGGEMMdQhHcJXzvHL5PePYcnqMOJv8dskXKFMgz8tHyMdghBQwlsrEwGae3jMqodI7aZXb8G7TNY8SH0P816OE2JvkJyjzAw1HTZ6KKkW9UjpAY4obyLG+mDlBTFgumfoBiwcy9r6l5aaOVtKpupaPqlpkxM0eYHCK/r7Avv37sR8ieHIYC5LBZ2gtI0xFkkSSBWUySkCkSP40a4QXKLNG/MR+upJ4hzs6gsVOUT0k6QzVkevQbUEsHCNXkMD8pAgAAVgMAAFBLAQIKAAoAAAgAAEV8lFwAAAAAAAAAAAAAAAAJAAQAAAAAAAAAAAAAAAAAAABNRVRBLUlORi/+ygAAUEsBAhQAFAAICAgARXyUXF+m5yhBAAAAQAAAABQAAAAAAAAAAAAAAAAAKwAAAE1FVEEtSU5GL01BTklGRVNULk1GUEsBAhQAFAAICAgARXyUXNXkMD8pAgAAVgMAAA4AAAAAAAAAAAAAAAAArgAAAE15VGV0cmlzLmNsYXNzUEsFBgAAAAADAAMAuQAAABMDAAAAAA==";

  function b64ToBytes(b64) {
    var bin = atob(b64);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  /* ---------- DOM ---------- */
  var canvas    = document.getElementById("stage-canvas");
  var ctx       = canvas.getContext("2d");
  var runBtn    = document.getElementById("run-btn");
  var statusEl  = document.getElementById("run-status");
  var loadEl    = document.getElementById("loading-overlay");
  var consoleEl = document.getElementById("console-output");

  var cheerpjReady = false;
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

  /* ---------- Java -> JS natives (all async per CheerpJ convention) ---------- */
  async function nClear(lib, r, g, b) {
    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  async function nFillRect(lib, x, y, w, h, r, g, b) {
    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    ctx.fillRect(x, y, w, h);
  }
  async function nStrokeRect(lib, x, y, w, h, r, g, b) {
    ctx.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  }
  async function nText(lib, x, y, s, r, g, b) {
    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    ctx.font = "13px 'JetBrains Mono', ui-monospace, monospace";
    ctx.textBaseline = "top";
    ctx.fillText(String(s), x, y);
  }
  async function nWidth(lib)  { return canvas.width;  }
  async function nHeight(lib) { return canvas.height; }

  async function nStarted(lib) {
    running = true;
    setStatus("running", "running");
    logLine("[java] setup done, game loop running");
  }

  /* (keyboard polling/queue wiring lands when the first interactive
     step needs it; Step 1 is a static render.) */

  /* ---------- CheerpJ init + jar load ---------- */
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
        Java_dev_yasuda_tetris_Game_jsStarted:      nStarted,
      },
    });

    await cheerpOSAddStringFile("/str/sdk.jar",    b64ToBytes(SDK_JAR_B64));
    await cheerpOSAddStringFile("/str/step01.jar", b64ToBytes(STEP01_JAR_B64));
    logLine("[init] jars loaded into /str/");

    cheerpjReady = true;
    showLoading(false);
    setStatus("ready", "ready");
    logLine("[init] CheerpJ ready");
  }

  /* ---------- Run button ---------- */
  runBtn.addEventListener("click", async function () {
    runBtn.disabled = true;
    running = false;
    keyQueue.length = 0;
    try {
      await ensureCheerpJ();
      setStatus("starting Java...", "loading");
      logLine("[run] cheerpjRunMain MyTetris");
      // Java's main() enters an infinite game loop (see Game.run). This
      // call effectively never resolves while the page is open, so we
      // do NOT await it. nStarted() sets the 'running' status.
      cheerpjRunMain("MyTetris", "/str/sdk.jar:/str/step01.jar")
        .then(function (exit) {
          running = false;
          logLine("[run] main() returned (exit " + exit + ")");
          setStatus("stopped (exit " + exit + ")", exit === 0 ? "idle" : "error");
        })
        .catch(function (e) {
          running = false;
          logLine("[run error] " + describeError(e));
          setStatus("error: " + describeError(e), "error");
        });
    } catch (e) {
      console.error(e);
      setStatus("error: " + describeError(e), "error");
      logLine("[error] " + describeError(e));
    } finally {
      // Keep disabled until main returns — pressing Run again would
      // try to start a second JVM, which CheerpJ doesn't support.
      // Re-enable only on explicit stop/error.
      setTimeout(function () {
        if (!running) runBtn.disabled = false;
      }, 2000);
    }
  });

  setStatus("ready to run", "idle");
})();
