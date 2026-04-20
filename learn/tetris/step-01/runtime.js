/*
 * Step 1 runtime — loads CheerpJ, wires Screen native methods to the canvas,
 * and runs the pre-compiled MyTetris against the SDK jar.
 *
 * This file is intentionally self-contained and reused across steps.
 * Student-visible Java lives in src/MyTetris.java.
 */
(function () {
  'use strict';

  const canvas    = document.getElementById('stage-canvas');
  const ctx       = canvas.getContext('2d');
  const runBtn    = document.getElementById('run-btn');
  const statusEl  = document.getElementById('run-status');
  const loadEl    = document.getElementById('loading-overlay');
  const consoleEl = document.getElementById('console-output');

  let cheerpjReady = false;
  let gameLoopInstance = null;
  let frameId = 0;
  let tickInFlight = false;
  let loopActive = false;

  function setStatus(text, mode) {
    statusEl.textContent = text;
    statusEl.dataset.mode = mode || 'idle';
  }
  function logLine(msg) {
    const line = document.createElement('div');
    line.textContent = msg;
    consoleEl.appendChild(line);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }
  function showLoading(visible) {
    loadEl.dataset.visible = visible ? 'true' : 'false';
  }

  /* ---------- Java → JS (native implementations) ---------- */

  function nClear(lib, r, g, b) {
    ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  function nFillRect(lib, x, y, w, h, r, g, b) {
    ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
    ctx.fillRect(x, y, w, h);
  }
  function nStrokeRect(lib, x, y, w, h, r, g, b) {
    ctx.strokeStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  }
  function nText(lib, x, y, s, r, g, b) {
    ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
    ctx.font = '13px "JetBrains Mono", ui-monospace, monospace';
    ctx.textBaseline = 'top';
    ctx.fillText(String(s), x, y);
  }
  function nWidth()  { return canvas.width;  }
  function nHeight() { return canvas.height; }

  function nRegisterLoop(lib, inst) {
    gameLoopInstance = inst;
    logLine('[init] GameLoop instance registered');
    // NOTE: rAF is started by the Run button handler AFTER cheerpjRunMain
    // resolves. Starting it here races with the still-running main().
  }

  /* ---------- Frame loop ---------- */

  function startFrameLoop() {
    if (loopActive) return;
    loopActive = true;
    cancelAnimationFrame(frameId);

    async function frame() {
      if (!loopActive) return;
      if (gameLoopInstance && !tickInFlight) {
        tickInFlight = true;
        try {
          await gameLoopInstance.tick();
        } catch (e) {
          loopActive = false;
          setStatus('error: ' + describeError(e), 'error');
          logLine('[tick error] ' + describeError(e));
          return;
        } finally {
          tickInFlight = false;
        }
      }
      frameId = requestAnimationFrame(frame);
    }
    frameId = requestAnimationFrame(frame);
  }

  function stopFrameLoop() {
    loopActive = false;
    cancelAnimationFrame(frameId);
  }

  function describeError(e) {
    if (!e) return 'unknown';
    if (typeof e === 'string') return e;
    if (e.message) return e.message;
    try { return JSON.stringify(e); } catch (_) { return String(e); }
  }

  /* ---------- Keyboard routing ---------- */

  window.addEventListener('keydown', function (e) {
    if (!gameLoopInstance) return;
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 &&
        document.activeElement && document.activeElement.tagName === 'CANVAS') {
      e.preventDefault();
    }
    try { gameLoopInstance.onKey(e.keyCode | 0); } catch (_) {}
  });

  /* ---------- CheerpJ init ---------- */

  async function loadCheerpJScript() {
    if (typeof cheerpjInit !== 'undefined') return;
    await new Promise(function (resolve, reject) {
      const s = document.createElement('script');
      s.src = 'https://cjrtnc.leaningtech.com/4.2/loader.js';
      s.onload = resolve;
      s.onerror = function () { reject(new Error('CheerpJ loader の読み込みに失敗しました')); };
      document.head.appendChild(s);
    });
  }

  async function ensureCheerpJ() {
    if (cheerpjReady) return;
    setStatus('Java ランタイムを取得中…', 'loading');
    showLoading(true);
    logLine('[init] loading CheerpJ runtime (first time only — this can take 10-30 seconds)');

    await loadCheerpJScript();

    await cheerpjInit({
      version: 8,
      status: 'none',
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

    cheerpjReady = true;
    showLoading(false);
    setStatus('ready', 'ready');
    logLine('[init] CheerpJ ready');
  }

  /* ---------- Run ---------- */

  runBtn.addEventListener('click', async function () {
    runBtn.disabled = true;
    stopFrameLoop();
    gameLoopInstance = null;
    try {
      await ensureCheerpJ();
      setStatus('Java を実行中…', 'running');
      logLine('[run] cheerpjRunMain MyTetris');
      const exit = await cheerpjRunMain(
        'MyTetris',
        '/app/learn/tetris/sdk/sdk.jar:/app/learn/tetris/step-01/step01.jar'
      );
      logLine('[run] main() returned (exit ' + exit + ')');
      if (exit !== 0) {
        setStatus('exit ' + exit, 'error');
        return;
      }
      if (!gameLoopInstance) {
        setStatus('Game instance が登録されませんでした', 'error');
        logLine('[error] nRegisterLoop was never invoked');
        return;
      }
      setStatus('running', 'running');
      startFrameLoop();
    } catch (e) {
      console.error(e);
      setStatus('error: ' + describeError(e), 'error');
      logLine('[error] ' + describeError(e));
    } finally {
      runBtn.disabled = false;
    }
  });

  setStatus('ready to run', 'idle');
})();
