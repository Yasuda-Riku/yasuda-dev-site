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
  var STEP_JAR_B64 = "UEsDBAoAAAgAALeClFwAAAAAAAAAAAAAAAAJAAQATUVUQS1JTkYv/soAAFBLAwQUAAgICAC3gpRcAAAAAAAAAAAAAAAAFAAAAE1FVEEtSU5GL01BTklGRVNULk1G803My0xLLS7RDUstKs7Mz7NSMNQz4OVyLkpNLElN0XWqtFIwAoroWShoeKWWOBUlZuYVKxTrFenl62nycvFyAQBQSwcIX6bnKEEAAABAAAAAUEsDBBQACAgIALaClFwAAAAAAAAAAAAAAAAOAAAATXlUZXRyaXMuY2xhc3OFUt9zC1EU/m522222m2ZpGimJX0UioaGqfra0SRmEmMQwHQ+63awK241JNzXe/Q8ePPHimdGaYcYf4N2MF/+DZ2PUd68UMxj7cPece79zzne+c95/e/MOwDhKJiLQDOgWetArkGx4K8WHznKn4RRDL2w3l4vnnSVPoPd0M2iGUwJabv/1KPoQNWBa6Icl0Hf54TWFpbngt9x7pZYvIC5I2ICFuMKoh1rrgbzcZGEzBgX6HdftLHV8J2y1GVA2+abJI2lhi6SjtTtBFMPYamCbhTQyAlv+ZMhyMr5npjJduiQwXPkH5JSJHdhpYJeF3RgRSP2Jq7ttzwuYy/U9hznTuX8mkzIMY6+FfZJWtDxdu3TrfG16ThbJWdiPPLu+3fT9mueGAjtzF/j9J9sBCwdlNq02WxbQS9VKXSBWagXLoROE1x2/42mcm8m3WvVGXdoJiZutVKSdErDKterVW/XZUvVKud575jPUJzGtBscYrzQD70pnacFrX3MWfN7oS06TDSdzNyt3nRWn6DvBYrFOZsEiSXHwnfsNJ5TAXFn6sXrouPcuO/e78b1tL2h4lCrzN6l+6KkSmfVWp+1655oyKraxMqOyKHZx5hHyNJDCKCzyLdKL4BD9w7/5Y/SP/OaP0z+KwZ/+BE+upOo53v1z03jqxHDDeR6ndxwaLYqXfw2RN1Zh5LVVxPIDq7BfKL1OqEhd5dG5jFFWGuCEojiJU90sWVaUWfrfom/uNRJrGPoVbKqG0vxneHMak92gFmnIWZ3Iz72CnXVZMU8j/vgJcuoqviivaMX0ecmJhp14uv5JMXy+/uGF6lSW2Mp+QO1MrvMgRlhoDzntZZksplTPEfMgy57B2W7xd4yQMY3CS6TWsF2bTNuJZ5jQpjK2+Qy5jJ26M6Gn5dlTGNL1+aEefd5O2smX2LOG7CNNPF//+CjC8z15GcRNKn6pO1OFtD6f2QAXCP7Fc0xNosDpjlLNItU8RK6HyXiMEytSnFHM4BgukmONES41lvxt6F8RFV9hiC/If6FwAtMq68x3UEsHCCN3fPkNAwAAwQQAAFBLAQIKAAoAAAgAALeClFwAAAAAAAAAAAAAAAAJAAQAAAAAAAAAAAAAAAAAAABNRVRBLUlORi/+ygAAUEsBAhQAFAAICAgAt4KUXF+m5yhBAAAAQAAAABQAAAAAAAAAAAAAAAAAKwAAAE1FVEEtSU5GL01BTklGRVNULk1GUEsBAhQAFAAICAgAtoKUXCN3fPkNAwAAwQQAAA4AAAAAAAAAAAAAAAAArgAAAE15VGV0cmlzLmNsYXNzUEsFBgAAAAADAAMAuQAAAPcDAAAAAA==";
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
