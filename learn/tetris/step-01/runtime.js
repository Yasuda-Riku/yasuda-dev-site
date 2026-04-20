/*
 * Step 1 runtime -- loads CheerpJ, injects jar bytes into the CheerpJ
 * virtual filesystem (no HTTP requests for jars needed), wires Screen
 * native methods to the canvas, and runs MyTetris.
 *
 * Why embed jars? Cloudflare Workers CDN doesnt honor HTTP Range on
 * static assets under ~2 MB, and CheerpJ refuses to run without Range.
 * Writing the jars directly to CheerpJs /str/ mount via
 * cheerpOSAddStringFile sidesteps the whole HTTP stack for class loading.
 */
(function () {
  "use strict";

  /* ---------- Embedded jars (regenerate when SDK changes) ---------- */
  var SDK_JAR_B64    = "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";
  var STEP01_JAR_B64 = "UEsDBAoAAAgAAAR6lFwAAAAAAAAAAAAAAAAJAAQATUVUQS1JTkYv/soAAFBLAwQUAAgICAAEepRcAAAAAAAAAAAAAAAAFAAAAE1FVEEtSU5GL01BTklGRVNULk1G803My0xLLS7RDUstKs7Mz7NSMNQz4OVyLkpNLElN0XWqtFIwAoroWShoeKWWOBUlZuYVKxTrFenl62nycvFyAQBQSwcIX6bnKEEAAABAAAAAUEsDBBQACAgIAAR6lFwAAAAAAAAAAAAAAAAOAAAATXlUZXRyaXMuY2xhc3N9Ut1OE1EQ/k5326XL1i7aP6BV/IP+KNXE9EYkKVUJYZGkS2qIF3Joj7i63ZrtloR7XsBX4MZruCiJJj4AT+CzEKLOWWskAdxNZuabnflmvnP25OfX7wCe4LGOCBQNqoEoYgyZjtit7vH+oMOrgQh8p19d5l3BEFtwPCdYZFCKpZaGMYaxtb2NsEKHBkWacQOGJFH8gRfHNSQ1mAYmcJ0he5G30XN7PkN0yao3VhkmrStKnupIIa0hYyCLHEPuYp3d9oXwiKvtCk6c+eKVZKWW3GzKwLRcK/683lx9u9ysb8ohBQM3cYuUvXNctynaAcNMcYWe/7AxqI11y2ZgKwyJRs/rB9wLWtwdCIVOWKfvzfXXtoxTsvaFZck4J+Nehw42aTmeeDXobgt/g2+7lFG73CExmeIb6wPf5VWXeztVm6Z6O+HAmC+8jiCZhctk/jmLsDBhB7z9cY1/GhHrdm/gt8VLR4LE3+ubl0Nwm+4vQospyGGGEMMdQhHcJXzvHL5PePYcnqMOJv8dskXKFMgz8tHyMdghBQwlsrEwGae3jMqodI7aZXb8G7TNY8SH0P816OE2JvkJyjzAw1HTZ6KKkW9UjpAY4obyLG+mDlBTFgumfoBiwcy9r6l5aaOVtKpupaPqlpkxM0eYHCK/r7Avv37sR8ieHIYC5LBZ2gtI0xFkkSSBWUySkCkSP40a4QXKLNG/MR+upJ4hzs6gsVOUT0k6QzVkevQbUEsHCNXkMD8pAgAAVgMAAFBLAQIKAAoAAAgAAAR6lFwAAAAAAAAAAAAAAAAJAAQAAAAAAAAAAAAAAAAAAABNRVRBLUlORi/+ygAAUEsBAhQAFAAICAgABHqUXF+m5yhBAAAAQAAAABQAAAAAAAAAAAAAAAAAKwAAAE1FVEEtSU5GL01BTklGRVNULk1GUEsBAhQAFAAICAgABHqUXNXkMD8pAgAAVgMAAA4AAAAAAAAAAAAAAAAArgAAAE15VGV0cmlzLmNsYXNzUEsFBgAAAAADAAMAuQAAABMDAAAAAA==";

  function b64ToBytes(b64) {
    // atob yields a binary string; convert to a proper Uint8Array so
    // cheerpOSAddStringFile stores the raw bytes verbatim (a string
    // would be subject to UTF-8 re-encoding and mangle bytes >= 0x80).
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
  var gameLoopInstance = null;
  var frameId = 0;
  var tickInFlight = false;
  var loopActive = false;

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

  /* ---------- Java -> JS natives ---------- */
  function nClear(lib, r, g, b) {
    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  function nFillRect(lib, x, y, w, h, r, g, b) {
    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    ctx.fillRect(x, y, w, h);
  }
  function nStrokeRect(lib, x, y, w, h, r, g, b) {
    ctx.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  }
  function nText(lib, x, y, s, r, g, b) {
    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    ctx.font = "13px 'JetBrains Mono', ui-monospace, monospace";
    ctx.textBaseline = "top";
    ctx.fillText(String(s), x, y);
  }
  function nWidth()  { return canvas.width;  }
  function nHeight() { return canvas.height; }
  function nRegisterLoop(lib, inst) {
    gameLoopInstance = inst;
    logLine("[init] GameLoop instance registered");
  }

  /* ---------- Frame loop ---------- */
  function startFrameLoop() {
    if (loopActive) return;
    loopActive = true;
    cancelAnimationFrame(frameId);
    function frame() {
      if (!loopActive) return;
      if (gameLoopInstance && !tickInFlight) {
        tickInFlight = true;
        gameLoopInstance.tick()
          .catch(function (e) {
            loopActive = false;
            setStatus("error: " + describeError(e), "error");
            logLine("[tick error] " + describeError(e));
          })
          .finally(function () { tickInFlight = false; });
      }
      frameId = requestAnimationFrame(frame);
    }
    frameId = requestAnimationFrame(frame);
  }
  function stopFrameLoop() {
    loopActive = false;
    cancelAnimationFrame(frameId);
  }

  /* ---------- Keyboard ---------- */
  window.addEventListener("keydown", function (e) {
    if (!gameLoopInstance) return;
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 &&
        document.activeElement && document.activeElement.tagName === "CANVAS") {
      e.preventDefault();
    }
    try { gameLoopInstance.onKey(e.keyCode | 0); } catch (_) {}
  });

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
        Java_dev_yasuda_tetris_Screen_jsClear:          nClear,
        Java_dev_yasuda_tetris_Screen_jsFillRect:       nFillRect,
        Java_dev_yasuda_tetris_Screen_jsStrokeRect:     nStrokeRect,
        Java_dev_yasuda_tetris_Screen_jsText:           nText,
        Java_dev_yasuda_tetris_Screen_jsWidth:          nWidth,
        Java_dev_yasuda_tetris_Screen_jsHeight:         nHeight,
        Java_dev_yasuda_tetris_GameLoop_jsRegisterLoop: nRegisterLoop,
      },
    });

    // Write jars directly into /str/ so CheerpJ does not have to fetch
    // them over HTTP (where Cloudflare blocks Range). atob yields a
    // binary string of raw bytes.
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
    stopFrameLoop();
    gameLoopInstance = null;
    try {
      await ensureCheerpJ();
      setStatus("Java running...", "running");
      logLine("[run] cheerpjRunMain MyTetris");
      var exit = await cheerpjRunMain("MyTetris", "/str/sdk.jar:/str/step01.jar");
      logLine("[run] main() returned (exit " + exit + ")");
      if (exit !== 0) {
        setStatus("exit " + exit, "error");
        return;
      }
      if (!gameLoopInstance) {
        setStatus("Game instance was not registered", "error");
        logLine("[error] nRegisterLoop was never invoked");
        return;
      }
      setStatus("running", "running");
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
