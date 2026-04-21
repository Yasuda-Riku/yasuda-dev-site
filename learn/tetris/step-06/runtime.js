/*
 * Step 06 runtime.
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

  var SDK_JAR_B64   = "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";
  var STARTER_CODE  = "import dev.yasuda.tetris.*;\n\n/**\n * Step 6 \u2014 \u30d6\u30ed\u30c3\u30af\u306e\u56fa\u5b9a\u3068\u65b0\u30d6\u30ed\u30c3\u30af\u751f\u6210\u3002\n *\n * \u76ee\u6a19: \u843d\u3061\u5207\u3063\u305f\u30d6\u30ed\u30c3\u30af\u3092\u76e4\u9762\u306b\u66f8\u304d\u8fbc\u307f\u3001\u65b0\u3057\u3044\u30d6\u30ed\u30c3\u30af\u3092\u4e0a\u304b\u3089\u51fa\u3059\u3002\n *\n * TODO \u306f\u672a\u5b9a\u7fa9\u306e\u8b58\u5225\u5b50\u3067\u3059\u3002\u6b8b\u3057\u305f\u307e\u307e Run \u3059\u308b\u3068\u30b3\u30f3\u30d1\u30a4\u30eb\u30a8\u30e9\u30fc\u306b\u306a\u308a\u307e\u3059\u3002\n */\npublic class MyTetris extends Game {\n\n    static final int COLS = 10;\n    static final int ROWS = 20;\n    static final int CELL = 24;\n\n    static final double DROP_SECONDS = 1.0;\n    // 0 = \u7a7a\u30010 \u4ee5\u5916 = \u56fa\u5b9a\u6e08\u307f\u30d6\u30ed\u30c3\u30af\n    int[][] board = new int[ROWS][COLS];\n\n    int blockCol = 4;\n    int blockRow = 0;\n    double accumulator = 0.0;\n\n    public static void main(String[] args) {\n        new MyTetris().run();\n    }\n\n    @Override\n    public void update(double dt) {\n        accumulator += dt;\n        while (accumulator >= DROP_SECONDS) {\n            accumulator -= DROP_SECONDS;\n            if (canMove(blockCol, blockRow + 1)) {\n                blockRow++;\n            } else {\n                // \u4e0b\u306b\u884c\u3051\u306a\u3044\u306e\u3067\u300c\u56fa\u5b9a\u300d\u3057\u3066\u65b0\u3057\u3044\u30d6\u30ed\u30c3\u30af\u3092\u51fa\u3059\n                board[blockRow][blockCol] = TODO;   // \u2190 1 \u3092\u5165\u308c\u308b\uff08= \u57cb\u307e\u3063\u3066\u3044\u308b\u5370\uff09\n                blockRow = TODO;                    // \u2190 \u4e0a\u7aef 0 \u306b\u623b\u3059\n                blockCol = TODO;                    // \u2190 \u4e2d\u592e\u5bc4\u308a\u3078\uff08\u4f8b: COLS / 2 - 1 = 4\uff09\n            }\n        }\n    }\n\n    @Override\n    public void onKey(Key key) {\n        if (key == Key.LEFT  && canMove(blockCol - 1, blockRow)) blockCol--;\n        if (key == Key.RIGHT && canMove(blockCol + 1, blockRow)) blockCol++;\n        if (key == Key.DOWN  && canMove(blockCol, blockRow + 1)) blockRow++;\n    }\n\n    /** \u76e4\u9762\u306e\u4e2d\u304b\u3064\u7a7a\u3044\u3066\u3044\u308c\u3070 true\u3002 */\n    boolean canMove(int col, int row) {\n        if (col < 0 || col >= COLS) return false;\n        if (row < 0 || row >= ROWS) return false;\n        // \u65e2\u306b\u57cb\u307e\u3063\u3066\u3044\u308b\u30bb\u30eb\u306b\u3082\u5165\u308c\u306a\u3044\n        if (board[row][col] != TODO) return false;   // \u2190 0 \u3068\u6bd4\u3079\u308b\n        return true;\n    }\n\n    @Override\n    public void render(Screen screen) {\n        screen.clear(Color.BLACK);\n\n        for (int row = 0; row < ROWS; row++) {\n            for (int col = 0; col < COLS; col++) {\n                int x = col * CELL;\n                int y = row * CELL;\n                Color c = (board[row][col] == 0) ? Color.DARK_GRAY : Color.RED;\n                screen.fillRect(x + 1, y + 1, CELL - 2, CELL - 2, c);\n            }\n        }\n\n        int bx = blockCol * CELL;\n        int by = blockRow * CELL;\n        screen.fillRect(bx + 1, by + 1, CELL - 2, CELL - 2, Color.RED);\n    }\n}\n";
  var SOLUTION_CODE = "import dev.yasuda.tetris.*;\n\n/**\n * Step 6 \u2014 \u30d6\u30ed\u30c3\u30af\u306e\u56fa\u5b9a\u3068\u65b0\u30d6\u30ed\u30c3\u30af\u751f\u6210\u3002\n *\n * \u76ee\u6a19: \u843d\u3061\u5207\u3063\u305f\u30d6\u30ed\u30c3\u30af\u3092\u76e4\u9762\u306b\u66f8\u304d\u8fbc\u307f\uff08\u300c\u56fa\u5b9a\u300d\uff09\u3001\n *       \u65b0\u3057\u3044\u30d6\u30ed\u30c3\u30af\u3092\u4e0a\u304b\u3089\u51fa\u3059\u3002\u30d6\u30ed\u30c3\u30af\u304c\u7a4d\u307f\u4e0a\u304c\u308a\u59cb\u3081\u308b\u3002\n *\n * \u5b66\u3076\u3053\u3068:\n *  - 2\u6b21\u5143\u914d\u5217 int[ROWS][COLS] \u3092\u300c\u76e4\u9762\u306e\u72b6\u614b\u300d\u3068\u3057\u3066\u4f7f\u3046\n *  - \u914d\u5217\u3078\u306e\u66f8\u304d\u8fbc\u307f: board[row][col] = 1\n *  - canMove \u306b\u300c\u305d\u3053\u304c\u65e2\u306b\u57cb\u307e\u3063\u3066\u3044\u308b\u300d\u30c1\u30a7\u30c3\u30af\u3092\u8ffd\u52a0\n *  - \u843d\u4e0b\u4e2d\u306e\u30d6\u30ed\u30c3\u30af\u3068\u3001\u56fa\u5b9a\u6e08\u307f\u306e\u76e4\u9762\u306f\u5225\u7269\n */\npublic class MyTetris extends Game {\n\n    static final int COLS = 10;\n    static final int ROWS = 20;\n    static final int CELL = 24;\n\n    static final double DROP_SECONDS = 1.0;\n\n    // 0 = \u7a7a\u30010 \u4ee5\u5916 = \u56fa\u5b9a\u6e08\u307f\u30d6\u30ed\u30c3\u30af\u3042\u308a\n    int[][] board = new int[ROWS][COLS];\n\n    int blockCol = 4;\n    int blockRow = 0;\n    double accumulator = 0.0;\n\n    public static void main(String[] args) {\n        new MyTetris().run();\n    }\n\n    @Override\n    public void update(double dt) {\n        accumulator += dt;\n        while (accumulator >= DROP_SECONDS) {\n            accumulator -= DROP_SECONDS;\n            if (canMove(blockCol, blockRow + 1)) {\n                blockRow++;\n            } else {\n                // \u3053\u3053\u3067\u300c\u7740\u5730\u300d\u3002\u76e4\u9762\u306b\u66f8\u304d\u8fbc\u3093\u3067\u3001\u65b0\u3057\u3044\u30d6\u30ed\u30c3\u30af\u3092\u4e0a\u304b\u3089\u51fa\u3059\u3002\n                board[blockRow][blockCol] = 1;\n                blockRow = 0;\n                blockCol = COLS / 2 - 1;\n            }\n        }\n    }\n\n    @Override\n    public void onKey(Key key) {\n        if (key == Key.LEFT  && canMove(blockCol - 1, blockRow)) blockCol--;\n        if (key == Key.RIGHT && canMove(blockCol + 1, blockRow)) blockCol++;\n        if (key == Key.DOWN  && canMove(blockCol, blockRow + 1)) blockRow++;\n    }\n\n    /** (col, row) \u304c\u76e4\u9762\u306e\u4e2d\u304b\u3064\u7a7a\u3044\u3066\u3044\u308c\u3070 true\u3002 */\n    boolean canMove(int col, int row) {\n        if (col < 0 || col >= COLS) return false;\n        if (row < 0 || row >= ROWS) return false;\n        if (board[row][col] != 0)   return false;\n        return true;\n    }\n\n    @Override\n    public void render(Screen screen) {\n        screen.clear(Color.BLACK);\n\n        for (int row = 0; row < ROWS; row++) {\n            for (int col = 0; col < COLS; col++) {\n                int x = col * CELL;\n                int y = row * CELL;\n                Color c = (board[row][col] == 0) ? Color.DARK_GRAY : Color.RED;\n                screen.fillRect(x + 1, y + 1, CELL - 2, CELL - 2, c);\n            }\n        }\n\n        int bx = blockCol * CELL;\n        int by = blockRow * CELL;\n        screen.fillRect(bx + 1, by + 1, CELL - 2, CELL - 2, Color.RED);\n    }\n}\n";
  var HINTS         = ["TODO 1a: board[blockRow][blockCol] = 1; の 1 行。2 次元配列への代入です。", "TODO 1b: blockRow = 0; と blockCol = COLS / 2 - 1; の 2 行を並べる（上から中央寄りに戻す）。", "TODO 2: if (board[row][col] != 0) return false; の 1 行。境界チェックの後ろに追加します。"];
  var TESTS         = [{"name": "↓ 連打でブロックが床に固定される", "type": "press-keys-then-cell-color", "keyCode": 40, "count": 25, "intervalMs": 25, "col": 4, "row": 19, "color": [200, 80, 80]}, {"name": "さらに ↓ 連打で新しいブロックが上から出る", "type": "press-keys-then-col-has-color", "keyCode": 40, "count": 25, "intervalMs": 25, "col": 4, "color": [200, 80, 80], "rowMin": 0, "rowMax": 3}, {"name": "固定されたブロックは盤面に残り続ける", "type": "cell-color", "col": 4, "row": 19, "color": [200, 80, 80]}];
  var STEP_ID       = "step-06";

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
  var hintBtn   = document.getElementById("hint-btn");
  var answerBtn = document.getElementById("answer-btn");
  var hintsEl   = document.getElementById("hints-area");
  var editor    = document.getElementById("code-editor");
  var gutter    = document.getElementById("code-gutter");
  var highlight = document.getElementById("code-highlight");
  var errorsEl  = document.getElementById("code-errors");
  var testsEl   = document.getElementById("tests-area");
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

  /* ---------- Syntax overlay: highlight TODO tokens in red ---------- */
  function escHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function updateHighlight() {
    if (!highlight) return;
    // Use \b to match whole-word TODO (not TODO_XYZ). Trailing newline
    // helps the overlay grow with the textarea when a fresh line is added.
    var html = escHtml(editor.value)
      .replace(/\bTODO\b/g, '<span class="tok-todo">TODO</span>');
    highlight.innerHTML = html + "\n";
    syncHighlightScroll();
  }
  function syncHighlightScroll() {
    if (!highlight) return;
    highlight.scrollTop  = editor.scrollTop;
    highlight.scrollLeft = editor.scrollLeft;
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
    updateHighlight();
    editor.addEventListener("input", function () {
      try { localStorage.setItem(LS_KEY, editor.value); } catch (_) {}
      updateGutter();
      updateHighlight();
    });
    editor.addEventListener("scroll", function () {
      syncGutterScroll();
      syncHighlightScroll();
    });
  })();
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (confirm("スタートコードに戻します。今のコードは失われます。続けますか？")) {
        editor.value = STARTER_CODE;
        try { localStorage.removeItem(LS_KEY); } catch (_) {}
        updateGutter();
        updateHighlight();
        clearHints();
      }
    });
  }

  /* ---------- Hints: reveal one at a time ---------- */
  var hintsShown = 0;
  function renderHints() {
    if (!hintsEl) return;
    hintsEl.innerHTML = "";
    if (hintsShown === 0) {
      hintsEl.hidden = true;
      return;
    }
    hintsEl.hidden = false;
    for (var i = 0; i < hintsShown; i++) {
      var item = document.createElement("div");
      item.className = "playground__hints-item";
      var label = document.createElement("span");
      label.className = "playground__hints-label";
      label.textContent = "ヒント " + (i + 1);
      var body = document.createElement("span");
      body.textContent = HINTS[i];
      item.appendChild(label);
      item.appendChild(body);
      hintsEl.appendChild(item);
    }
  }
  function clearHints() {
    hintsShown = 0;
    renderHints();
    if (hintBtn) {
      hintBtn.disabled = false;
      hintBtn.textContent = HINTS.length ? "ヒント" : "ヒントなし";
      if (!HINTS.length) hintBtn.disabled = true;
    }
  }
  if (hintBtn) {
    hintBtn.addEventListener("click", function () {
      if (hintsShown >= HINTS.length) return;
      hintsShown++;
      renderHints();
      if (hintsShown >= HINTS.length) {
        hintBtn.disabled = true;
        hintBtn.textContent = "ヒントはここまで";
      } else {
        hintBtn.textContent = "ヒント (" + hintsShown + "/" + HINTS.length + ")";
      }
    });
  }
  clearHints();

  /* ---------- Answer: reveal the reference solution ---------- */
  if (answerBtn) {
    if (STARTER_CODE === SOLUTION_CODE) {
      answerBtn.disabled = true;
      answerBtn.title = "このステップの解答例は starter と同じです";
    }
    answerBtn.addEventListener("click", function () {
      if (!confirm("解答例を表示します。今のコードは上書きされます。続けますか？")) return;
      editor.value = SOLUTION_CODE;
      try { localStorage.setItem(LS_KEY, editor.value); } catch (_) {}
      updateGutter();
      updateHighlight();
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

  /* ---------- Keyboard queue ----------
     Capture arrow/space for the game only when the editor does NOT
     have focus. Otherwise students can't use the caret to navigate
     their own code. */
  window.addEventListener("keydown", function (e) {
    if (!running || !gameInstance) return;
    if (document.activeElement === editor) return;
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

    // First run only: create the library. Subsequent runs reuse it.
    if (!lib) {
      setStatus("starting Java...", "loading");
      logLine("[run] cheerpjRunLibrary /str/sdk.jar");
      lib = await cheerpjRunLibrary("/str/sdk.jar");
    }

    // Every run: ask the SDK's Loader to reload MyTetris via a fresh
    // URLClassLoader. That way we pick up the newly-compiled bytecode
    // and dodge the "Only one library thread supported" error that
    // a second cheerpjRunLibrary would raise.
    var Loader = await lib.dev.yasuda.tetris.Loader;
    try {
      await Loader.loadAndRun("/files/", "MyTetris");
    } catch (e) {
      setStatus("runtime error", "error");
      logLine("[run error] " + describeError(e));
      return;
    }
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

    // Let the first couple of frames land before we start sampling.
    setTimeout(function () { runAutoTests(); }, 300);
  }

  /* ---------- Auto-grading: canvas pixel assertions ---------- */
  function sleep(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }
  function getPixel(x, y) {
    var d = ctx.getImageData(x, y, 1, 1).data;
    return [d[0], d[1], d[2]];
  }
  function getCellPixel(col, row) {
    // Cells are 24 px and the playfield starts at x=0, y=0. Sample
    // the center of each cell (12, 12) so we don't fall on the 1 px
    // gap between cells.
    return getPixel(col * 24 + 12, row * 24 + 12);
  }
  function colorMatches(actual, expected, tolerance) {
    var tol = (tolerance == null) ? 12 : tolerance;
    return Math.abs(actual[0] - expected[0]) <= tol &&
           Math.abs(actual[1] - expected[1]) <= tol &&
           Math.abs(actual[2] - expected[2]) <= tol;
  }
  function findColorRow(col, color, tolerance) {
    for (var r = 0; r < 20; r++) {
      if (colorMatches(getCellPixel(col, r), color, tolerance)) return r;
    }
    return -1;
  }

  function injectKey(code) { keyQueue.push(code | 0); }
  async function injectKeys(code, count, intervalMs) {
    for (var k = 0; k < count; k++) {
      injectKey(code);
      await sleep(intervalMs || 30);
    }
  }
  function colHasColor(col, color, tolerance, rowMin, rowMax) {
    var rmin = rowMin == null ? 0 : rowMin;
    var rmax = rowMax == null ? 19 : rowMax;
    for (var r = rmin; r <= rmax; r++)
      if (colorMatches(getCellPixel(col, r), color, tolerance)) return true;
    return false;
  }
  function areaHasColor(x1, y1, x2, y2, color, tolerance) {
    var step = 3;  // sample every 3 px for speed
    for (var y = y1; y <= y2; y += step)
      for (var x = x1; x <= x2; x += step)
        if (colorMatches(getPixel(x, y), color, tolerance)) return true;
    return false;
  }
  function snapshotRegion(x, y, w, h) {
    return ctx.getImageData(x, y, w, h).data;
  }
  function snapshotDiffCount(a, b) {
    var n = 0;
    for (var i = 0; i < a.length; i += 4) {
      if (Math.abs(a[i] - b[i]) > 12 ||
          Math.abs(a[i + 1] - b[i + 1]) > 12 ||
          Math.abs(a[i + 2] - b[i + 2]) > 12) n++;
    }
    return n;
  }

  async function evaluateTest(t) {
    switch (t.type) {
      case "cell-color":
        return colorMatches(getCellPixel(t.col, t.row), t.color, t.tolerance);
      case "cell-color-after":
        await sleep(t.waitMs || 1000);
        return colorMatches(getCellPixel(t.col, t.row), t.color, t.tolerance);
      case "pixel-color":
        return colorMatches(getPixel(t.x, t.y), t.color, t.tolerance);
      case "color-moves-down":
        var before = findColorRow(t.col, t.color, t.tolerance);
        if (before < 0) return false;
        await sleep(t.waitMs || 1200);
        var after = findColorRow(t.col, t.color, t.tolerance);
        if (after < 0) return false;
        return (after - before) >= (t.minDelta || 1);
      case "col-has-color":
        return colHasColor(t.col, t.color, t.tolerance, t.rowMin, t.rowMax);
      case "area-has-color":
        return areaHasColor(t.x1, t.y1, t.x2, t.y2, t.color, t.tolerance);

      case "press-key-then-cell-color":
        injectKey(t.keyCode);
        await sleep(t.waitMs || 80);
        return colorMatches(getCellPixel(t.col, t.row), t.color, t.tolerance);
      case "press-keys-then-cell-color":
        await injectKeys(t.keyCode, t.count || 1, t.intervalMs);
        await sleep(t.waitMs || 80);
        return colorMatches(getCellPixel(t.col, t.row), t.color, t.tolerance);
      case "press-keys-then-col-has-color":
        await injectKeys(t.keyCode, t.count || 1, t.intervalMs);
        await sleep(t.waitMs || 80);
        return colHasColor(t.col, t.color, t.tolerance, t.rowMin, t.rowMax);
      case "press-keys-then-area-has-color":
        await injectKeys(t.keyCode, t.count || 1, t.intervalMs);
        await sleep(t.waitMs || 80);
        return areaHasColor(t.x1, t.y1, t.x2, t.y2, t.color, t.tolerance);

      case "press-key-changes-canvas":
        var w = t.w || canvas.width;
        var h = t.h || 96;   // just the top few rows where pieces live
        var x = t.x || 0;
        var y = t.y || 0;
        var snap1 = snapshotRegion(x, y, w, h);
        injectKey(t.keyCode);
        await sleep(t.waitMs || 120);
        var snap2 = snapshotRegion(x, y, w, h);
        return snapshotDiffCount(snap1, snap2) >= (t.minPixelDiff || 30);

      default:
        return false;
    }
  }

  function renderTestItem(name, state) {
    var item = document.createElement("div");
    item.className = "playground__tests-item playground__tests-item--" + state;
    var mark = document.createElement("span");
    mark.className = "playground__tests-mark";
    item.appendChild(mark);
    var label = document.createElement("span");
    label.textContent = name;
    item.appendChild(label);
    testsEl.appendChild(item);
    return item;
  }

  async function runAutoTests() {
    if (!testsEl) return;
    testsEl.innerHTML = "";
    if (!TESTS || TESTS.length === 0) {
      testsEl.hidden = true;
      return;
    }
    testsEl.hidden = false;
    var header = document.createElement("div");
    header.className = "playground__tests-header";
    header.textContent = "自動チェック";
    testsEl.appendChild(header);

    var passed = 0;
    var items = [];
    for (var i = 0; i < TESTS.length; i++) {
      items.push(renderTestItem(TESTS[i].name, "pending"));
    }

    for (var j = 0; j < TESTS.length; j++) {
      try {
        var ok = await evaluateTest(TESTS[j]);
        items[j].classList.remove("playground__tests-item--pending");
        items[j].classList.add("playground__tests-item--" + (ok ? "pass" : "fail"));
        if (ok) passed++;
      } catch (e) {
        items[j].classList.remove("playground__tests-item--pending");
        items[j].classList.add("playground__tests-item--fail");
      }
    }

    var summary = document.createElement("div");
    summary.className = "playground__tests-summary";
    var allPass = (passed === TESTS.length);
    summary.textContent = allPass
      ? "🎉 全テスト通過！ このステップは完了です。"
      : ("通過 " + passed + " / " + TESTS.length + "。赤い項目を直してもう一度 Run。");
    summary.classList.add(allPass ? "playground__tests-summary--pass" : "playground__tests-summary--fail");
    testsEl.appendChild(summary);

    try {
      if (allPass) localStorage.setItem("tetris-done-" + STEP_ID, "1");
      else         localStorage.removeItem("tetris-done-" + STEP_ID);
    } catch (_) {}
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
