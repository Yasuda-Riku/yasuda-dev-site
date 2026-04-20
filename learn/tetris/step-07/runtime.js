/*
 * Step 07 runtime.
 *
 * Editor content is compiled at run time with javac (loaded from
 * /app/learn/tetris/javac/tools.jar). The resulting classes are loaded
 * via cheerpjRunLibrary along with the SDK (embedded below as base64),
 * the student's static main() is called, and Game.current() becomes
 * the tick target for the rAF loop.
 *
 * Auto-generated -- edit .claude/build-tetris.py, rerun, don't
 * hand-edit this file.
 */
(function () {
  "use strict";

  var SDK_JAR_B64  = "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";
  var STARTER_CODE = "import dev.yasuda.tetris.*;\n\n/**\n * Step 7 \u2014 7 \u7a2e\u985e\u306e\u30df\u30ce\u3002\n *\n * \u76ee\u6a19: 1 \u30bb\u30eb\u306e\u30d6\u30ed\u30c3\u30af\u3092\u3001I, O, T, S, Z, L, J \u306e\u30c6\u30c8\u30ed\u30df\u30ce\u306b\u7f6e\u304d\u63db\u3048\u308b\u3002\n *       \u3068\u308a\u3042\u3048\u305a\u9806\u756a\u306b\u30eb\u30fc\u30d7\u51fa\u73fe\u3059\u308b\uff08\u30e9\u30f3\u30c0\u30e0\u306f Step 8\uff09\u3002\n *\n * \u5b66\u3076\u3053\u3068:\n *  - \u30d5\u30a3\u30fc\u30eb\u30c9\u3092\u6301\u3064 enum\uff08Shape \u306b\u8272\u3068 \u30bb\u30eb\u914d\u5217\u3092\u6301\u305f\u305b\u308b\uff09\n *  - \u8907\u6570\u30bb\u30eb\u306e\u885d\u7a81\u5224\u5b9a: canMove \u304c shape \u306e\u5168\u30bb\u30eb\u3092\u30eb\u30fc\u30d7\n *  - \u300c\u73fe\u5728\u306e\u30d4\u30fc\u30b9\uff08\u5f62 + \u4f4d\u7f6e\uff09\u300d\u3068\u300c\u56fa\u5b9a\u76e4\u9762\u300d\u306e\u5206\u96e2\n */\npublic class MyTetris extends Game {\n\n    static final int COLS = 10;\n    static final int ROWS = 20;\n    static final int CELL = 24;\n\n    static final double DROP_SECONDS = 1.0;\n\n    /** \u5404\u30df\u30ce\u306f\u300c\u8272\u300d\u3068\u300c1/0 \u306e\u30bb\u30eb\u914d\u5217\u300d\u3092\u6301\u3064\u3002 */\n    enum Shape {\n        I(Color.CYAN,   new int[][]{\n            {0,0,0,0},\n            {1,1,1,1},\n            {0,0,0,0},\n            {0,0,0,0}\n        }),\n        O(Color.YELLOW, new int[][]{\n            {1,1},\n            {1,1}\n        }),\n        T(Color.PURPLE, new int[][]{\n            {0,1,0},\n            {1,1,1},\n            {0,0,0}\n        }),\n        S(Color.GREEN,  new int[][]{\n            {0,1,1},\n            {1,1,0},\n            {0,0,0}\n        }),\n        Z(Color.RED,    new int[][]{\n            {1,1,0},\n            {0,1,1},\n            {0,0,0}\n        }),\n        L(Color.ORANGE, new int[][]{\n            {0,0,1},\n            {1,1,1},\n            {0,0,0}\n        }),\n        J(Color.BLUE,   new int[][]{\n            {1,0,0},\n            {1,1,1},\n            {0,0,0}\n        });\n\n        final Color color;\n        final int[][] cells;\n\n        Shape(Color color, int[][] cells) {\n            this.color = color;\n            this.cells = cells;\n        }\n    }\n\n    int[][] board = new int[ROWS][COLS];\n\n    // \u73fe\u5728\u306e\u843d\u4e0b\u30d4\u30fc\u30b9\n    Shape[] bag = Shape.values();\n    int bagIndex = 0;\n    Shape current = bag[0];\n    int pieceCol = 3;\n    int pieceRow = 0;\n\n    double accumulator = 0.0;\n\n    public static void main(String[] args) {\n        new MyTetris().run();\n    }\n\n    @Override\n    public void update(double dt) {\n        accumulator += dt;\n        while (accumulator >= DROP_SECONDS) {\n            accumulator -= DROP_SECONDS;\n            if (canMove(current, pieceCol, pieceRow + 1)) {\n                pieceRow++;\n            } else {\n                lockPiece();\n                spawnNext();\n            }\n        }\n    }\n\n    @Override\n    public void onKey(Key key) {\n        if (key == Key.LEFT  && canMove(current, pieceCol - 1, pieceRow)) pieceCol--;\n        if (key == Key.RIGHT && canMove(current, pieceCol + 1, pieceRow)) pieceCol++;\n        if (key == Key.DOWN  && canMove(current, pieceCol, pieceRow + 1)) pieceRow++;\n    }\n\n    /** shape \u3092 (col, row) \u306b\u7f6e\u3044\u305f\u3068\u304d\u3001\u5168\u30bb\u30eb\u304c\u76e4\u9762\u306e\u4e2d\u304b\u3064\u7a7a\u306a\u3089 true\u3002 */\n    boolean canMove(Shape shape, int col, int row) {\n        int[][] cells = shape.cells;\n        for (int r = 0; r < cells.length; r++) {\n            for (int c = 0; c < cells[r].length; c++) {\n                if (cells[r][c] == 0) continue;\n                int bc = col + c;\n                int br = row + r;\n                if (bc < 0 || bc >= COLS) return false;\n                if (br < 0 || br >= ROWS) return false;\n                if (board[br][bc] != 0)   return false;\n            }\n        }\n        return true;\n    }\n\n    /** \u73fe\u5728\u306e\u30d4\u30fc\u30b9\u3092\u76e4\u9762\u306b\u56fa\u5b9a\u3059\u308b\uff08= \u66f8\u304d\u8fbc\u3080\uff09\u3002 */\n    void lockPiece() {\n        int[][] cells = current.cells;\n        for (int r = 0; r < cells.length; r++) {\n            for (int c = 0; c < cells[r].length; c++) {\n                if (cells[r][c] == 0) continue;\n                board[pieceRow + r][pieceCol + c] = current.ordinal() + 1;\n            }\n        }\n    }\n\n    /** \u6b21\u306e\u30df\u30ce\u3078\uff08bag \u3092\u9806\u306b\u56de\u3059\uff09\u3002 */\n    void spawnNext() {\n        bagIndex = (bagIndex + 1) % bag.length;\n        current = bag[bagIndex];\n        pieceCol = 3;\n        pieceRow = 0;\n    }\n\n    @Override\n    public void render(Screen screen) {\n        screen.clear(Color.BLACK);\n\n        // \u76e4\u9762: \u7a7a\u30bb\u30eb\u306f\u6697\u3044\u30b0\u30ec\u30fc\u3001\u56fa\u5b9a\u6e08\u307f\u306f\u305d\u306e\u30df\u30ce\u306e\u8272\n        for (int row = 0; row < ROWS; row++) {\n            for (int col = 0; col < COLS; col++) {\n                int x = col * CELL;\n                int y = row * CELL;\n                int cell = board[row][col];\n                Color c = (cell == 0) ? Color.DARK_GRAY : bag[cell - 1].color;\n                screen.fillRect(x + 1, y + 1, CELL - 2, CELL - 2, c);\n            }\n        }\n\n        // \u73fe\u5728\u306e\u30d4\u30fc\u30b9: \u57cb\u307e\u3063\u3066\u3044\u308b\u30bb\u30eb\u3060\u3051\u3092 current.color \u3067\u63cf\u304f\n        int[][] cells = current.cells;\n        for (int r = 0; r < cells.length; r++) {\n            for (int c = 0; c < cells[r].length; c++) {\n                if (cells[r][c] == 0) continue;\n                int x = (pieceCol + c) * CELL;\n                int y = (pieceRow + r) * CELL;\n                screen.fillRect(x + 1, y + 1, CELL - 2, CELL - 2, current.color);\n            }\n        }\n    }\n}\n";
  var STEP_ID      = "step-07";

  function b64ToBytes(b64) {
    var bin = atob(b64);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  var canvas    = document.getElementById("stage-canvas");
  var ctx       = canvas.getContext("2d");
  var runBtn    = document.getElementById("run-btn");
  var resetBtn  = document.getElementById("reset-btn");
  var editor    = document.getElementById("code-editor");
  var gutter    = document.getElementById("code-gutter");
  var errorsEl  = document.getElementById("code-errors");
  var statusEl  = document.getElementById("run-status");
  var loadEl    = document.getElementById("loading-overlay");
  var consoleEl = document.getElementById("console-output");
  // CheerpJ auto-writes Java stdout/stderr (including javac errors)
  // into an element with id="console". We keep it hidden and mirror
  // its text into our visible console pane, with compile-error lines
  // highlighted so students can read the exact file:line:column.
  var cjConsole = document.getElementById("console");

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
  function logLine(msg, cls) {
    var line = document.createElement("div");
    line.textContent = msg;
    if (cls) line.className = cls;
    consoleEl.appendChild(line);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }

  /* ---------- Mirror Java stdout/stderr into our console pane ----------
     CheerpJ adds text nodes directly under #console. We watch for them,
     split on newlines, and stream each line into consoleEl. Lines that
     match the javac error format are stripped, translated into
     Japanese where we can pattern-match, and tagged for error styling
     so students can jump straight to the line number. */
  var ERROR_LINE_RE = /^\/str\/MyTetris\.java:(\d+):\s*(error|warning):\s*(.*)$/;
  var seenIssueKeys = {}; // reset in clearCjConsole() before each Run

  // javac の英語メッセージを日本語に置き換える。見つからなければ元のまま。
  function translateJavacMessage(english) {
    var rules = [
      [/^';' expected$/,                          "セミコロン ; が足りません"],
      [/^'\(' expected$/,                         "開き括弧 ( が足りません"],
      [/^'\)' expected$/,                         "閉じ括弧 ) が足りません"],
      [/^'\{' expected$/,                         "開き中括弧 { が足りません"],
      [/^'\}' expected$/,                         "閉じ中括弧 } が足りません"],
      [/^'\[' expected$/,                         "開き角括弧 [ が足りません"],
      [/^'\]' expected$/,                         "閉じ角括弧 ] が足りません"],
      [/^'<' expected$/,                          "< が足りません"],
      [/^'>' expected$/,                          "> が足りません"],
      [/^cannot find symbol$/,                    "シンボルが見つかりません（変数名・メソッド名のタイポかもしれません）"],
      [/^class, interface, or enum expected$/,    "class・interface・enum のいずれかが必要です"],
      [/^illegal start of expression$/,           "式として正しくない書き方です"],
      [/^illegal start of type$/,                 "型として正しくない書き方です"],
      [/^not a statement$/,                       "単独の文として書けない形です"],
      [/^unreachable statement$/,                 "到達不能な文です（前の return などで届かない）"],
      [/^missing return statement$/,              "return 文が足りません"],
      [/^variable (\S+) might not have been initialized$/,
                                                  function(m){ return "変数 " + m[1] + " が未初期化のまま使われています"; }],
      [/^incompatible types: (.+) cannot be converted to (.+)$/,
                                                  function(m){ return "型が合いません: " + m[1] + " を " + m[2] + " に変換できません"; }],
      [/^bad operand types? for binary operator '(.+)'$/,
                                                  function(m){ return "二項演算子 " + m[1] + " のオペランド型が合いません"; }],
      [/^cannot be applied to given types;?$/,    "この引数では呼び出せません（引数の型・個数を確認）"],
      [/^reference to (\S+) is ambiguous$/,       function(m){ return m[1] + " の呼び出しが曖昧です（候補が複数）"; }],
      [/^(\S+) has private access in (\S+)$/,     function(m){ return m[1] + " は " + m[2] + " の private で外から呼べません"; }],
      [/^package (\S+) does not exist$/,          function(m){ return "パッケージ " + m[1] + " が見つかりません（import を確認）"; }],
      [/^cannot access (\S+)$/,                   function(m){ return m[1] + " にアクセスできません"; }],
      [/^unchecked call to (.+)$/,                function(m){ return "未検査の呼び出し: " + m[1]; }],
      [/^unexpected type$/,                       "予期しない型です"],
      [/^int cannot be dereferenced$/,            "int は . でメンバー参照できません"],
      [/^array required, but (.+) found$/,        function(m){ return "配列が必要ですが " + m[1] + " が来ました"; }],
    ];
    for (var i = 0; i < rules.length; i++) {
      var m = rules[i][0].exec(english);
      if (m) {
        var rep = rules[i][1];
        return (typeof rep === "function") ? rep(m) : rep;
      }
    }
    return english;
  }

  function emitJavaLine(raw) {
    var s = raw.replace(/\s+$/, "");
    if (!s) return;
    var m = ERROR_LINE_RE.exec(s);
    if (m) {
      var lineNum = parseInt(m[1], 10);
      var level   = m[2];
      var msg     = translateJavacMessage(m[3]);
      var key = lineNum + "\x00" + level + "\x00" + msg;
      if (seenIssueKeys[key]) return; // drop duplicate in the console too
      seenIssueKeys[key] = true;
      addCompileIssue({ line: lineNum, level: level, message: msg });
      var label = (level === "error") ? "エラー" : "警告";
      logLine("MyTetris.java 行 " + lineNum + " · " + label + ": " + msg,
              level === "error" ? "log-error" : "log-warn");
    } else if (/^\s+\^\s*$/.test(s)) {
      logLine(s, "log-caret");
    } else if (/^(\d+)\s+error(s)?$/.test(s)) {
      var n = /^(\d+)/.exec(s)[1];
      logLine("エラー " + n + " 件", "log-error");
    } else if (/^(\d+)\s+warning(s)?$/.test(s)) {
      var n = /^(\d+)/.exec(s)[1];
      logLine("警告 " + n + " 件", "log-warn");
    } else {
      logLine(s, "log-java");
    }
  }
  if (cjConsole) {
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var added = muts[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var t = (added[j].textContent || "").split(/\r?\n/);
          for (var k = 0; k < t.length; k++) emitJavaLine(t[k]);
        }
      }
    }).observe(cjConsole, { childList: true, subtree: true, characterData: true });
  }
  function clearCjConsole() {
    if (cjConsole) cjConsole.innerHTML = "";
    seenIssueKeys = {};
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

  /* ---------- Editor: load saved content, persist on input, gutter ---------- */
  var LS_KEY = "tetris-editor-" + STEP_ID;

  // Compile errors/warnings gathered from the current javac run.
  // Reset every time compileAndRun starts. Each entry: {line, level, message}.
  var compileIssues = [];

  function updateGutter() {
    if (!gutter) return;
    var errorLines = {}, warnLines = {};
    for (var i = 0; i < compileIssues.length; i++) {
      var it = compileIssues[i];
      if (it.level === "error") errorLines[it.line] = true;
      else if (it.level === "warning") warnLines[it.line] = true;
    }
    var lines = editor.value.split("\n").length;
    gutter.innerHTML = "";
    for (var n = 1; n <= lines; n++) {
      var span = document.createElement("span");
      span.textContent = String(n);
      if (errorLines[n])      span.className = "gutter-error";
      else if (warnLines[n])  span.className = "gutter-warn";
      gutter.appendChild(span);
      gutter.appendChild(document.createTextNode("\n"));
    }
  }
  function syncGutterScroll() {
    if (!gutter) return;
    gutter.scrollTop = editor.scrollTop;
  }

  function focusEditorLine(lineNum) {
    editor.focus();
    var lines = editor.value.split("\n");
    var pos = 0;
    for (var i = 0; i < lineNum - 1 && i < lines.length; i++) {
      pos += lines[i].length + 1; // +1 for \n
    }
    editor.selectionStart = pos;
    editor.selectionEnd   = pos + (lines[lineNum - 1] || "").length;
    // Scroll so the line sits near the top of the visible area.
    var approxLineH = 13 * 1.7; // matches CSS font-size 13 * line-height 1.7
    editor.scrollTop = Math.max(0, (lineNum - 3) * approxLineH);
  }

  function renderErrorBar() {
    if (!errorsEl) return;
    errorsEl.innerHTML = "";
    if (compileIssues.length === 0) {
      errorsEl.hidden = true;
      return;
    }
    errorsEl.hidden = false;
    for (var i = 0; i < compileIssues.length; i++) {
      (function (it) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "playground__errors-item playground__errors-item--" + it.level;
        btn.textContent = "行 " + it.line + " · " + it.message;
        btn.addEventListener("click", function () { focusEditorLine(it.line); });
        errorsEl.appendChild(btn);
      })(compileIssues[i]);
    }
  }

  function clearCompileIssues() {
    compileIssues = [];
    renderErrorBar();
    updateGutter();
  }
  function addCompileIssue(issue) {
    // MutationObserver can fire multiple times for the same line of
    // text while CheerpJ is flushing its buffer. De-dupe by
    // (line, level, message) so students see each problem once.
    for (var i = 0; i < compileIssues.length; i++) {
      var e = compileIssues[i];
      if (e.line === issue.line && e.level === issue.level && e.message === issue.message) {
        return;
      }
    }
    compileIssues.push(issue);
    renderErrorBar();
    updateGutter();
  }
  (function initEditor() {
    var saved = null;
    try { saved = localStorage.getItem(LS_KEY); } catch (_) {}
    editor.value = (saved !== null) ? saved : STARTER_CODE;
    updateGutter();
    editor.addEventListener("input", function () {
      try { localStorage.setItem(LS_KEY, editor.value); } catch (_) {}
      updateGutter();
    });
    editor.addEventListener("scroll", syncGutterScroll);
  })();
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (confirm("参照コードに戻します。よろしいですか？")) {
        editor.value = STARTER_CODE;
        try { localStorage.removeItem(LS_KEY); } catch (_) {}
        updateGutter();
      }
    });
  }

  /* ---------- Screen natives (sync, no mid-render yields) ---------- */
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

  async function nStarted(_lib) {
    running = true;
    setStatus("running", "running");
    logLine("[java] setup done");
  }

  /* ---------- Keyboard queue ---------- */
  window.addEventListener("keydown", function (e) {
    if (!running || !gameInstance) return;
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) !== -1) {
      e.preventDefault();
    }
    keyQueue.push(e.keyCode | 0);
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
        Java_dev_yasuda_tetris_Screen_jsClear:      nClear,
        Java_dev_yasuda_tetris_Screen_jsFillRect:   nFillRect,
        Java_dev_yasuda_tetris_Screen_jsStrokeRect: nStrokeRect,
        Java_dev_yasuda_tetris_Screen_jsText:       nText,
        Java_dev_yasuda_tetris_Screen_jsWidth:      nWidth,
        Java_dev_yasuda_tetris_Screen_jsHeight:     nHeight,
        Java_dev_yasuda_tetris_Game_jsStarted:      nStarted,
      },
    });

    // SDK jar available for compile + runtime classpath.
    await cheerpOSAddStringFile("/str/sdk.jar", b64ToBytes(SDK_JAR_B64));
    logLine("[init] sdk.jar mounted at /str/sdk.jar");

    cheerpjReady = true;
    showLoading(false);
    setStatus("ready", "ready");
    logLine("[init] CheerpJ ready");
  }

  /* ---------- Frame loop ---------- */
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

  /* ---------- Compile + run ---------- */
  async function compileAndRun() {
    // Fresh state: stop any prior loop, clear console.
    running = false;
    gameInstance = null;
    cancelAnimationFrame(rafId);

    await ensureCheerpJ();

    // Write the editor's current Java source into CheerpJ's VFS.
    await cheerpOSAddStringFile("/str/MyTetris.java", editor.value);

    // Wipe previous compiled artefacts so stale classes don't linger.
    // (cheerpOSAddStringFile with empty content is the simplest way.)
    try { await cheerpOSAddStringFile("/files/MyTetris.class", new Uint8Array(0)); } catch (_) {}

    clearCjConsole();
    clearCompileIssues();
    setStatus("compiling...", "loading");
    logLine("[compile] javac /str/MyTetris.java");
    var compileCp = "/app/learn/tetris/javac/tools.jar:/str/sdk.jar:/files/";
    var compileExit = await cheerpjRunMain(
      "com.sun.tools.javac.Main",
      compileCp,
      "/str/MyTetris.java",
      "-cp", "/str/sdk.jar",
      "-d", "/files/",
      "-Xlint:-options"
    );
    if (compileExit !== 0) {
      setStatus("compile error", "error");
      logLine("[compile] FAILED (exit " + compileExit + ")");
      return;
    }
    logLine("[compile] OK");

    setStatus("starting Java...", "loading");
    logLine("[run] cheerpjRunLibrary /files/:/str/sdk.jar");
    lib = await cheerpjRunLibrary("/files/:/str/sdk.jar");

    var MyTetris = await lib.MyTetris;
    await MyTetris.main([]);
    logLine("[run] MyTetris.main() returned");

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
    try { canvas.focus(); } catch (_) {}
    startFrameLoop();
  }

  runBtn.addEventListener("click", async function () {
    runBtn.disabled = true;
    try {
      await compileAndRun();
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
