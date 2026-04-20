/*
 * Step 03 runtime.
 *
 * Loads CheerpJ, writes SDK + student jars into CheerpJ's /str/ virtual
 * filesystem (so no HTTP jar fetches happen, sidestepping Cloudflare
 * Range issues), then calls cheerpjRunMain. Auto-generated -- edit
 * .claude/build-tetris.py and rerun, don't hand-edit this file.
 */
(function () {
  "use strict";

  var SDK_JAR_B64  = "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";
  var STEP_JAR_B64 = "UEsDBAoAAAgAAESDlFwAAAAAAAAAAAAAAAAJAAQATUVUQS1JTkYv/soAAFBLAwQUAAgICABEg5RcAAAAAAAAAAAAAAAAFAAAAE1FVEEtSU5GL01BTklGRVNULk1G803My0xLLS7RDUstKs7Mz7NSMNQz4OVyLkpNLElN0XWqtFIwAoroWShoeKWWOBUlZuYVKxTrFenl62nycvFyAQBQSwcIX6bnKEEAAABAAAAAUEsDBBQACAgIAESDlFwAAAAAAAAAAAAAAAAOAAAATXlUZXRyaXMuY2xhc3OFUt9zC1EU/m522222m2ZpGimJX0UioaGqfra0SRmEmMQwHQ+63awK241JNzXe/Q8ePPHimdGaYcYf4N2MF/+DZ2PUd68UMxj7cPece79zzne+c95/e/MOwDhKJiLQDOgWetArkGx4K8WHznKn4RRDL2w3l4vnnSVPoPd0M2iGUwJabv/1KPoQNWBa6Icl0Hf54TWFpbngt9x7pZYvIC5I2ICFuMKoh1rrgbzcZGEzBgX6HdftLHV8J2y1GVA2+abJI2lhi6SjtTtBFMPYamCbhTQyAlv+ZMhyMr5npjJduiQwXPkH5JSJHdhpYJeF3RgRSP2Jq7ttzwuYy/U9hznTuX8mkzIMY6+FfZJWtDxdu3TrfG16ThbJWdiPPLu+3fT9mueGAjtzF/j9J9sBCwdlNq02WxbQS9VKXSBWagXLoROE1x2/42mcm8m3WvVGXdoJiZutVKSdErDKterVW/XZUvVKud575jPUJzGtBscYrzQD70pnacFrX3MWfN7oS06TDSdzNyt3nRWn6DvBYrFOZsEiSXHwnfsNJ5TAXFn6sXrouPcuO/e78b1tL2h4lCrzN6l+6KkSmfVWp+1655oyKraxMqOyKHZx5hHyNJDCKCzyLdKL4BD9w7/5Y/SP/OaP0z+KwZ/+BE+upOo53v1z03jqxHDDeR6ndxwaLYqXfw2RN1Zh5LVVxPIDq7BfKL1OqEhd5dG5jFFWGuCEojiJU90sWVaUWfrfom/uNRJrGPoVbKqG0vxneHMak92gFmnIWZ3Iz72CnXVZMU8j/vgJcuoqviivaMX0ecmJhp14uv5JMXy+/uGF6lSW2Mp+QO1MrvMgRlhoDzntZZksplTPEfMgy57B2W7xd4yQMY3CS6TWsF2bTNuJZ5jQpjK2+Qy5jJ26M6Gn5dlTGNL1+aEefd5O2smX2LOG7CNNPF//+CjC8z15GcRNKn6pO1OFtD6f2QAXCP7Fc0xNosDpjlLNItU8RK6HyXiMEytSnFHM4BgukmONES41lvxt6F8RFV9hiC/If6FwAtMq68x3UEsHCCN3fPkNAwAAwQQAAFBLAQIKAAoAAAgAAESDlFwAAAAAAAAAAAAAAAAJAAQAAAAAAAAAAAAAAAAAAABNRVRBLUlORi/+ygAAUEsBAhQAFAAICAgARIOUXF+m5yhBAAAAQAAAABQAAAAAAAAAAAAAAAAAKwAAAE1FVEEtSU5GL01BTklGRVNULk1GUEsBAhQAFAAICAgARIOUXCN3fPkNAwAAwQQAAA4AAAAAAAAAAAAAAAAArgAAAE15VGV0cmlzLmNsYXNzUEsFBgAAAAADAAMAuQAAAPcDAAAAAA==";
  var STEP_JAR_VFS = "/str/step-03.jar";

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
  var running = false;

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
    logLine("[java] setup done");
  }

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

    await cheerpOSAddStringFile("/str/sdk.jar", b64ToBytes(SDK_JAR_B64));
    await cheerpOSAddStringFile(STEP_JAR_VFS,   b64ToBytes(STEP_JAR_B64));
    logLine("[init] jars loaded into /str/");

    cheerpjReady = true;
    showLoading(false);
    setStatus("ready", "ready");
    logLine("[init] CheerpJ ready");
  }

  runBtn.addEventListener("click", async function () {
    runBtn.disabled = true;
    running = false;
    try {
      await ensureCheerpJ();
      setStatus("starting Java...", "loading");
      logLine("[run] cheerpjRunMain MyTetris");
      cheerpjRunMain("MyTetris", "/str/sdk.jar:" + STEP_JAR_VFS)
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
      setTimeout(function () {
        if (!running) runBtn.disabled = false;
      }, 2000);
    }
  });

  setStatus("ready to run", "idle");
})();
