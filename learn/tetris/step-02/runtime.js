/*
 * Step 02 runtime.
 *
 * Loads CheerpJ, writes SDK + student jars into CheerpJ's /str/ virtual
 * filesystem (so no HTTP jar fetches happen, sidestepping Cloudflare
 * Range issues), then calls cheerpjRunMain. Auto-generated -- edit
 * .claude/build-tetris.py and rerun, don't hand-edit this file.
 */
(function () {
  "use strict";

  var SDK_JAR_B64  = "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";
  var STEP_JAR_B64 = "UEsDBAoAAAgAAImDlFwAAAAAAAAAAAAAAAAJAAQATUVUQS1JTkYv/soAAFBLAwQUAAgICACJg5RcAAAAAAAAAAAAAAAAFAAAAE1FVEEtSU5GL01BTklGRVNULk1G803My0xLLS7RDUstKs7Mz7NSMNQz4OVyLkpNLElN0XWqtFIwAoroWShoeKWWOBUlZuYVKxTrFenl62nycvFyAQBQSwcIX6bnKEEAAABAAAAAUEsDBBQACAgIAIiDlFwAAAAAAAAAAAAAAAAOAAAATXlUZXRyaXMuY2xhc3OFUmtP02AUft61o6x0UpCNgRsXUSibUkWdNyCBgQQpknQEQ/wgpatYKa0pHYbv/BK++BkikGjCD+AX+FsIUc9bIJIgsUnP5T3PuZ/jX9+PADzGCxkJCBJEBUk0MGRrzqa+ZW3Ua5YeOVHobujT1rrD0DDi+m40xiBog4spNCIlQVbQBIWhcW5rIcaSuOIF9lol8BjYDIfdUNAcY2KDGXyR6VHgpFXBTZ5SCOt+ChlkJbQryKGDof1qFRQyCBmSE8Z4ZZahw7gG8lLGLeQlFBR0oZshdxVXtUPH8SmW7TkWxcxr1wbjrWbQq+A2Lys1OW7Ovp82x5d4kjsK7qKfOvvgep7p2BFDjzZD33+iaQoGeTTBnJpkECvzRpUhXQn8jcjyo0XLqzsC7UYmmzn/tsrlNo6bMgwu57gc1GglzYbrO2/q6ytOuGCtePQirlsuNZbV3hmfrE1L9yx/Va9SBf4qJaclho5fc6jlwr9aPptLDExXI8tem7M+nweWq0E9tJ1XLlfSF+se4knQS7tMUGFJ2l0RChhKpCVwj/T7l/Qh0vVL+gOidD7gX3PMBbLRFRJ9SJpOGMZtxUOworQPqSjsI71LTwzDRG8gnhNEtCCFVvof0UWfOQ+cOzf9QOPSIdQDtPx1lON6M8Sz9PIE5XOnI8rdQLxW2kPbATqF0bzatoOyMFZQ5R1oBTX3sSzmOU2WMqK4nEmKy2pWze6h5wB92wL7+vvndoLocfEbJMKNEk8THyvlxeXCBXiAwLvxDHg1w3HvnaCbpTl0oR3dJPWgjyZbJn2EtAn04zU1ZUKDTefzlDxUiKdIsVNI7ATFE5ocw7M46vM/UEsHCDcC4Sp3AgAA3wMAAFBLAQIKAAoAAAgAAImDlFwAAAAAAAAAAAAAAAAJAAQAAAAAAAAAAAAAAAAAAABNRVRBLUlORi/+ygAAUEsBAhQAFAAICAgAiYOUXF+m5yhBAAAAQAAAABQAAAAAAAAAAAAAAAAAKwAAAE1FVEEtSU5GL01BTklGRVNULk1GUEsBAhQAFAAICAgAiIOUXDcC4Sp3AgAA3wMAAA4AAAAAAAAAAAAAAAAArgAAAE15VGV0cmlzLmNsYXNzUEsFBgAAAAADAAMAuQAAAGEDAAAAAA==";
  var STEP_JAR_VFS = "/str/step-02.jar";

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
