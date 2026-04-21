/*
 * Step 07 runtime.
 *
 * Editor content is compiled at run time with javac (loaded from
 * /app/learn/othello/javac/tools.jar). The resulting classes are loaded
 * via cheerpjRunLibrary along with the SDK (embedded below as base64),
 * the student's static main() is called, and Game.current() becomes
 * the tick target for the rAF loop.
 *
 * Auto-generated -- edit .claude/build-othello.py, rerun, don't
 * hand-edit this file.
 */
(function () {
  "use strict";

  var SDK_JAR_B64   = "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";
  var STARTER_CODE  = "import dev.yasuda.othello.*;\nimport java.util.ArrayList;\nimport java.util.List;\nimport java.util.Random;\n\n/**\n * Step 07 \u2014 \u30e9\u30f3\u30c0\u30e0 AI\u3002\n *\n * \u76ee\u6a19: \u767d\u756a\u306b\u306a\u3063\u305f\u3089 AI \u304c\u5c11\u3057\u5f85\u3063\u3066\u304b\u3089\u81ea\u52d5\u3067\u624b\u3092\u6253\u3064\u3002\n *       \u5408\u6cd5\u624b\u306e\u4e00\u89a7\u3092 List \u3068\u3057\u3066\u53d6\u5f97\u3057\u3001Random \u3067 1 \u624b\u9078\u3076\u3060\u3051\u3002\n */\npublic class MyOthello extends Game {\n\n    static final int COLS = 8;\n    static final int ROWS = 8;\n    static final int CELL = 50;\n\n    static final int EMPTY = 0;\n    static final int BLACK = 1;\n    static final int WHITE = 2;\n\n    static final int HUMAN = BLACK;\n    static final int AI    = WHITE;\n\n    static final double AI_DELAY = 0.5;  // \u79d2\n\n    static final int[][] DIRECTIONS = {\n        {-1, -1}, {-1, 0}, {-1, 1},\n        { 0, -1},          { 0, 1},\n        { 1, -1}, { 1, 0}, { 1, 1}\n    };\n\n    int[][] board = new int[ROWS][COLS];\n    int currentPlayer = BLACK;\n    boolean gameOver = false;\n\n    int cursorCol = 3;\n    int cursorRow = 3;\n\n    Random rng = new Random();\n    double aiCooldown = 0.0;\n\n    public static void main(String[] args) {\n        new MyOthello().run();\n    }\n\n    @Override\n    public void setup() {\n        board[3][3] = WHITE;\n        board[4][4] = WHITE;\n        board[3][4] = BLACK;\n        board[4][3] = BLACK;\n    }\n\n    @Override\n    public void update(double dt) {\n        // AI \u306e\u624b\u756a\u3067\u306a\u3051\u308c\u3070\u4f55\u3082\u3057\u306a\u3044\u3002\n        if (gameOver || currentPlayer != AI) {\n            aiCooldown = 0.0;\n            return;\n        }\n        aiCooldown += dt;\n        if (aiCooldown < AI_DELAY) return;\n        aiCooldown = 0.0;\n        aiMove();\n    }\n\n    void aiMove() {\n        // TODO: AI \u5074\u306e\u5408\u6cd5\u624b\u4e00\u89a7\u3092 legalMoves(AI) \u3067\u53d6\u5f97\u3002\u7a7a\u306a\u3089\u4f55\u3082\u3057\u306a\u3044\u3002\n        //       \u7a7a\u3067\u306a\u3051\u308c\u3070 rng.nextInt(\u30b5\u30a4\u30ba) \u3067 1 \u624b\u9078\u3073\u3001placeAt \u2192 endTurn\u3002\n        TODO;\n    }\n\n    /** player \u304c\u5408\u6cd5\u306b\u6253\u3066\u308b\u30de\u30b9 (row, col) \u3092 List \u3067\u8fd4\u3059\u3002 */\n    List<int[]> legalMoves(int player) {\n        // TODO: 2 \u91cd for \u3067\u5168\u30de\u30b9\u3092\u8d70\u67fb\u3057\u3001isValidMove \u304c true \u306e\u30de\u30b9\u3092\n        //       new int[]{r, c} \u3068\u3057\u3066 ArrayList \u306b add\u3002\u6700\u5f8c\u306b return\u3002\n        TODO;\n    }\n\n    @Override\n    public void onKey(Key key) {\n        if (gameOver || currentPlayer != HUMAN) return;\n        if (key == Key.LEFT  && cursorCol > 0)        cursorCol--;\n        if (key == Key.RIGHT && cursorCol < COLS - 1) cursorCol++;\n        if (key == Key.UP    && cursorRow > 0)        cursorRow--;\n        if (key == Key.DOWN  && cursorRow < ROWS - 1) cursorRow++;\n        if (key == Key.ENTER) {\n            if (isValidMove(cursorRow, cursorCol, HUMAN)) {\n                placeAt(cursorRow, cursorCol, HUMAN);\n                endTurn();\n            }\n        }\n    }\n\n    void placeAt(int row, int col, int player) {\n        board[row][col] = player;\n        flip(row, col, player);\n    }\n\n    void endTurn() {\n        currentPlayer = (currentPlayer == BLACK) ? WHITE : BLACK;\n        if (!hasAnyLegalMove(currentPlayer)) {\n            currentPlayer = (currentPlayer == BLACK) ? WHITE : BLACK;\n            if (!hasAnyLegalMove(currentPlayer)) {\n                gameOver = true;\n            }\n        }\n    }\n\n    boolean hasAnyLegalMove(int player) {\n        for (int r = 0; r < ROWS; r++)\n            for (int c = 0; c < COLS; c++)\n                if (isValidMove(r, c, player)) return true;\n        return false;\n    }\n\n    void flip(int row, int col, int player) {\n        int opponent = (player == BLACK) ? WHITE : BLACK;\n        for (int[] d : DIRECTIONS) {\n            int dr = d[0], dc = d[1];\n            int r = row + dr, c = col + dc;\n            while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] == opponent) {\n                r += dr; c += dc;\n            }\n            if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;\n            if (board[r][c] != player) continue;\n            r -= dr; c -= dc;\n            while (!(r == row && c == col)) {\n                board[r][c] = player;\n                r -= dr; c -= dc;\n            }\n        }\n    }\n\n    boolean isValidMove(int row, int col, int player) {\n        if (board[row][col] != EMPTY) return false;\n        int opponent = (player == BLACK) ? WHITE : BLACK;\n        for (int[] d : DIRECTIONS) {\n            int dr = d[0], dc = d[1];\n            int r = row + dr, c = col + dc;\n            boolean sawOpponent = false;\n            while (r >= 0 && r < ROWS && c >= 0 && c < COLS) {\n                if (board[r][c] == opponent) {\n                    sawOpponent = true;\n                } else if (board[r][c] == player && sawOpponent) {\n                    return true;\n                } else {\n                    break;\n                }\n                r += dr; c += dc;\n            }\n        }\n        return false;\n    }\n\n    @Override\n    public void render(Screen screen) {\n        screen.clear(Color.DARK_GRAY);\n\n        for (int row = 0; row < ROWS; row++) {\n            for (int col = 0; col < COLS; col++) {\n                int x = col * CELL;\n                int y = row * CELL;\n                screen.fillRect(x, y, CELL, CELL, Color.BOARD);\n                screen.strokeRect(x, y, CELL, CELL, Color.BOARD_LINE);\n\n                int stone = board[row][col];\n                if (stone != EMPTY) {\n                    Color c = (stone == BLACK) ? Color.BLACK : Color.WHITE;\n                    screen.fillCircle(x + CELL / 2, y + CELL / 2, CELL / 2 - 4, c);\n                } else if (!gameOver && currentPlayer == HUMAN && isValidMove(row, col, HUMAN)) {\n                    screen.fillCircle(x + CELL / 2, y + CELL / 2, 6, Color.HINT);\n                }\n            }\n        }\n\n        if (currentPlayer == HUMAN) {\n            int cx = cursorCol * CELL;\n            int cy = cursorRow * CELL;\n            screen.strokeRect(cx,     cy,     CELL,     CELL,     Color.HIGHLIGHT);\n            screen.strokeRect(cx + 1, cy + 1, CELL - 2, CELL - 2, Color.HIGHLIGHT);\n            screen.strokeRect(cx + 2, cy + 2, CELL - 4, CELL - 4, Color.HIGHLIGHT);\n        }\n    }\n}\n";
  var SOLUTION_CODE = "import dev.yasuda.othello.*;\nimport java.util.ArrayList;\nimport java.util.List;\nimport java.util.Random;\n\n/**\n * Step 07 \u2014 \u30e9\u30f3\u30c0\u30e0 AI\u3002\n *\n * \u76ee\u6a19: \u767d\u756a\u306b\u306a\u3063\u305f\u3089 AI \u304c\u5c11\u3057\u9593\u3092\u7f6e\u3044\u3066\u81ea\u52d5\u3067\u624b\u3092\u6253\u3064\u3002\n *       \u5408\u6cd5\u624b\u306e\u4e00\u89a7\u304b\u3089 Random \u3067 1 \u3064\u9078\u3093\u3067\u7740\u624b\u3059\u308b\u3060\u3051\u3002\n *\n * \u5b66\u3076\u3053\u3068:\n *  - List&lt;int[]&gt; \u306e\u4f7f\u3044\u65b9\uff08ArrayList\uff09\n *  - Random \u3067\u4e71\u629e\n *  - update(dt) \u3067\u6642\u9593\u3092\u84c4\u7a4d\u3057\u3066\u300cAI \u306e\u601d\u8003\u6642\u9593\u300d\u3092\u6f14\u51fa\n */\npublic class MyOthello extends Game {\n\n    static final int COLS = 8;\n    static final int ROWS = 8;\n    static final int CELL = 50;\n\n    static final int EMPTY = 0;\n    static final int BLACK = 1;\n    static final int WHITE = 2;\n\n    static final int HUMAN = BLACK;\n    static final int AI    = WHITE;\n\n    static final double AI_DELAY = 0.5;  // \u79d2\n\n    static final int[][] DIRECTIONS = {\n        {-1, -1}, {-1, 0}, {-1, 1},\n        { 0, -1},          { 0, 1},\n        { 1, -1}, { 1, 0}, { 1, 1}\n    };\n\n    int[][] board = new int[ROWS][COLS];\n    int currentPlayer = BLACK;\n    boolean gameOver = false;\n\n    int cursorCol = 3;\n    int cursorRow = 3;\n\n    Random rng = new Random();\n    double aiCooldown = 0.0;\n\n    public static void main(String[] args) {\n        new MyOthello().run();\n    }\n\n    @Override\n    public void setup() {\n        board[3][3] = WHITE;\n        board[4][4] = WHITE;\n        board[3][4] = BLACK;\n        board[4][3] = BLACK;\n    }\n\n    @Override\n    public void update(double dt) {\n        if (gameOver || currentPlayer != AI) {\n            aiCooldown = 0.0;\n            return;\n        }\n        aiCooldown += dt;\n        if (aiCooldown < AI_DELAY) return;\n        aiCooldown = 0.0;\n        aiMove();\n    }\n\n    void aiMove() {\n        List<int[]> moves = legalMoves(AI);\n        if (moves.isEmpty()) return;\n        int[] pick = moves.get(rng.nextInt(moves.size()));\n        placeAt(pick[0], pick[1], AI);\n        endTurn();\n    }\n\n    List<int[]> legalMoves(int player) {\n        List<int[]> out = new ArrayList<>();\n        for (int r = 0; r < ROWS; r++) {\n            for (int c = 0; c < COLS; c++) {\n                if (isValidMove(r, c, player)) out.add(new int[]{r, c});\n            }\n        }\n        return out;\n    }\n\n    @Override\n    public void onKey(Key key) {\n        if (gameOver || currentPlayer != HUMAN) return;\n        if (key == Key.LEFT  && cursorCol > 0)        cursorCol--;\n        if (key == Key.RIGHT && cursorCol < COLS - 1) cursorCol++;\n        if (key == Key.UP    && cursorRow > 0)        cursorRow--;\n        if (key == Key.DOWN  && cursorRow < ROWS - 1) cursorRow++;\n        if (key == Key.ENTER) {\n            if (isValidMove(cursorRow, cursorCol, HUMAN)) {\n                placeAt(cursorRow, cursorCol, HUMAN);\n                endTurn();\n            }\n        }\n    }\n\n    void placeAt(int row, int col, int player) {\n        board[row][col] = player;\n        flip(row, col, player);\n    }\n\n    void endTurn() {\n        currentPlayer = (currentPlayer == BLACK) ? WHITE : BLACK;\n        if (!hasAnyLegalMove(currentPlayer)) {\n            currentPlayer = (currentPlayer == BLACK) ? WHITE : BLACK;\n            if (!hasAnyLegalMove(currentPlayer)) {\n                gameOver = true;\n            }\n        }\n    }\n\n    boolean hasAnyLegalMove(int player) {\n        for (int r = 0; r < ROWS; r++) {\n            for (int c = 0; c < COLS; c++) {\n                if (isValidMove(r, c, player)) return true;\n            }\n        }\n        return false;\n    }\n\n    void flip(int row, int col, int player) {\n        int opponent = (player == BLACK) ? WHITE : BLACK;\n        for (int[] d : DIRECTIONS) {\n            int dr = d[0], dc = d[1];\n            int r = row + dr, c = col + dc;\n            while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] == opponent) {\n                r += dr; c += dc;\n            }\n            if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;\n            if (board[r][c] != player) continue;\n            r -= dr; c -= dc;\n            while (!(r == row && c == col)) {\n                board[r][c] = player;\n                r -= dr; c -= dc;\n            }\n        }\n    }\n\n    boolean isValidMove(int row, int col, int player) {\n        if (board[row][col] != EMPTY) return false;\n        int opponent = (player == BLACK) ? WHITE : BLACK;\n        for (int[] d : DIRECTIONS) {\n            int dr = d[0], dc = d[1];\n            int r = row + dr, c = col + dc;\n            boolean sawOpponent = false;\n            while (r >= 0 && r < ROWS && c >= 0 && c < COLS) {\n                if (board[r][c] == opponent) {\n                    sawOpponent = true;\n                } else if (board[r][c] == player && sawOpponent) {\n                    return true;\n                } else {\n                    break;\n                }\n                r += dr; c += dc;\n            }\n        }\n        return false;\n    }\n\n    @Override\n    public void render(Screen screen) {\n        screen.clear(Color.DARK_GRAY);\n\n        for (int row = 0; row < ROWS; row++) {\n            for (int col = 0; col < COLS; col++) {\n                int x = col * CELL;\n                int y = row * CELL;\n                screen.fillRect(x, y, CELL, CELL, Color.BOARD);\n                screen.strokeRect(x, y, CELL, CELL, Color.BOARD_LINE);\n\n                int stone = board[row][col];\n                if (stone != EMPTY) {\n                    Color c = (stone == BLACK) ? Color.BLACK : Color.WHITE;\n                    screen.fillCircle(x + CELL / 2, y + CELL / 2, CELL / 2 - 4, c);\n                } else if (!gameOver && currentPlayer == HUMAN && isValidMove(row, col, HUMAN)) {\n                    screen.fillCircle(x + CELL / 2, y + CELL / 2, 6, Color.HINT);\n                }\n            }\n        }\n\n        if (currentPlayer == HUMAN) {\n            int cx = cursorCol * CELL;\n            int cy = cursorRow * CELL;\n            screen.strokeRect(cx,     cy,     CELL,     CELL,     Color.HIGHLIGHT);\n            screen.strokeRect(cx + 1, cy + 1, CELL - 2, CELL - 2, Color.HIGHLIGHT);\n            screen.strokeRect(cx + 2, cy + 2, CELL - 4, CELL - 4, Color.HIGHLIGHT);\n        }\n    }\n}\n";
  var HINTS         = ["legalMoves は List<int[]> result = new ArrayList<>(); → 2重forで走査 → add → return result; の 4 ステップ。", "aiMove は: List<int[]> ms = legalMoves(AI); if (ms.isEmpty()) return; int[] m = ms.get(rng.nextInt(ms.size())); placeAt(m[0], m[1], AI); endTurn();", "int[] は「長さ 2 の配列」として [row, col] を表現する慣用。AI ライブラリを使わずとも十分動く。"];
  var TESTS         = [{"name": "↑ + Enter で黒が (col=3, row=2) に着手する", "type": "press-sequence-then-cell-color", "keys": [38, 13], "intervalMs": 100, "waitMs": 300, "col": 3, "row": 2, "color": [0, 0, 0], "tolerance": 20}, {"name": "1.5 秒以内に白 AI が応手する (3 つの合法手のどれかに白石)", "type": "press-sequence-then-any-cell-color", "keys": [], "intervalMs": 100, "waitMs": 1500, "cells": [[2, 2], [2, 4], [4, 2]], "color": [255, 255, 255], "tolerance": 20}];
  var STEP_ID       = "step-07";

  function b64ToBytes(b64) {
    var bin = atob(b64);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  var canvas    = document.getElementById("stage-canvas");
  var ctx       = canvas.getContext("2d");
  var runBtn    = document.getElementById("run-btn");
  var testBtn   = document.getElementById("test-btn");
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
  var ERROR_LINE_RE = /^\/str\/MyOthello\.java:(\d+):\s*(error|warning):\s*(.*)$/;
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
      logLine("MyOthello.java 行 " + lineNum + " · " + label + ": " + msg,
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
  var LS_KEY = "othello-editor-" + STEP_ID;

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
      if (hintsEl && hintsEl.lastElementChild) {
        hintsEl.lastElementChild.scrollIntoView({ behavior: "smooth", block: "center" });
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
  function nFillCircle(_lib, cx, cy, radius, r, g, b) {
    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
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
        Java_dev_yasuda_othello_Screen_jsClear:      nClear,
        Java_dev_yasuda_othello_Screen_jsFillRect:   nFillRect,
        Java_dev_yasuda_othello_Screen_jsStrokeRect: nStrokeRect,
        Java_dev_yasuda_othello_Screen_jsFillCircle: nFillCircle,
        Java_dev_yasuda_othello_Screen_jsText:       nText,
        Java_dev_yasuda_othello_Screen_jsWidth:      nWidth,
        Java_dev_yasuda_othello_Screen_jsHeight:     nHeight,
        Java_dev_yasuda_othello_Game_jsStarted:      nStarted,
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
    await cheerpOSAddStringFile("/str/MyOthello.java", editor.value);

    // Wipe previous compiled artefacts so stale classes don't linger.
    try { await cheerpOSAddStringFile("/files/MyOthello.class", new Uint8Array(0)); } catch (_) {}

    clearCjConsole();
    clearCompileIssues();
    setStatus("compiling...", "loading");
    logLine("[compile] javac /str/MyOthello.java");
    var compileCp = "/app/learn/othello/javac/tools.jar:/str/sdk.jar:/files/";
    var compileExit = await cheerpjRunMain(
      "com.sun.tools.javac.Main",
      compileCp,
      "/str/MyOthello.java",
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

    // Every run: ask the SDK's Loader to reload MyOthello via a fresh
    // URLClassLoader. That way we pick up the newly-compiled bytecode
    // and dodge the "Only one library thread supported" error that
    // a second cheerpjRunLibrary would raise.
    var Loader = await lib.dev.yasuda.othello.Loader;
    try {
      await Loader.loadAndRun("/files/", "MyOthello");
    } catch (e) {
      setStatus("runtime error", "error");
      logLine("[run error] " + describeError(e));
      return;
    }
    logLine("[run] MyOthello.main() returned");

    var GameClass = await lib.dev.yasuda.othello.Game;
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

    if (testBtn) {
      testBtn.disabled = !(TESTS && TESTS.length);
      testBtn.textContent = (TESTS && TESTS.length) ? "テスト実行" : "テストなし";
    }
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
    // Cells are 50 px and the board starts at x=0, y=0. Sample the
    // centre of each cell (25, 25) so the reading lands on the stone
    // (or empty board) and not on a grid line.
    return getPixel(col * 50 + 25, row * 50 + 25);
  }
  function colorMatches(actual, expected, tolerance) {
    var tol = (tolerance == null) ? 12 : tolerance;
    return Math.abs(actual[0] - expected[0]) <= tol &&
           Math.abs(actual[1] - expected[1]) <= tol &&
           Math.abs(actual[2] - expected[2]) <= tol;
  }
  function findColorRow(col, color, tolerance) {
    for (var r = 0; r < 8; r++) {
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
  async function injectSequence(keys, intervalMs) {
    for (var i = 0; i < keys.length; i++) {
      injectKey(keys[i]);
      await sleep(intervalMs || 80);
    }
  }
  function anyCellColor(cells, color, tolerance) {
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      if (colorMatches(getCellPixel(cell[0], cell[1]), color, tolerance)) return true;
    }
    return false;
  }
  function colHasColor(col, color, tolerance, rowMin, rowMax) {
    var rmin = rowMin == null ? 0 : rowMin;
    var rmax = rowMax == null ? 7 : rowMax;
    for (var r = rmin; r <= rmax; r++)
      if (colorMatches(getCellPixel(col, r), color, tolerance)) return true;
    return false;
  }
  function areaHasColor(x1, y1, x2, y2, color, tolerance) {
    // Bulk read so we can scan every pixel -- thin text (13 px font)
    // is easy to miss when stepping by 3.
    var w = x2 - x1 + 1;
    var h = y2 - y1 + 1;
    if (w <= 0 || h <= 0) return false;
    var data = ctx.getImageData(x1, y1, w, h).data;
    var tol = (tolerance == null) ? 12 : tolerance;
    var tr = color[0], tg = color[1], tb = color[2];
    for (var i = 0; i < data.length; i += 4) {
      if (Math.abs(data[i]     - tr) <= tol &&
          Math.abs(data[i + 1] - tg) <= tol &&
          Math.abs(data[i + 2] - tb) <= tol) return true;
    }
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

      case "press-sequence-then-cell-color":
        await injectSequence(t.keys, t.intervalMs);
        await sleep(t.waitMs || 120);
        return colorMatches(getCellPixel(t.col, t.row), t.color, t.tolerance);
      case "press-sequence-then-area-has-color":
        await injectSequence(t.keys, t.intervalMs);
        await sleep(t.waitMs || 120);
        return areaHasColor(t.x1, t.y1, t.x2, t.y2, t.color, t.tolerance);
      case "press-sequence-then-any-cell-color":
        await injectSequence(t.keys, t.intervalMs);
        await sleep(t.waitMs || 120);
        return anyCellColor(t.cells, t.color, t.tolerance);
      case "any-cell-color":
        return anyCellColor(t.cells, t.color, t.tolerance);

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
      if (allPass) localStorage.setItem("othello-done-" + STEP_ID, "1");
      else         localStorage.removeItem("othello-done-" + STEP_ID);
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

  if (testBtn) {
    testBtn.disabled = true;
    testBtn.textContent = (TESTS && TESTS.length) ? "テスト実行" : "テストなし";
    testBtn.addEventListener("click", async function () {
      if (!running) return;
      testBtn.disabled = true;
      try {
        // 初期状態からテストを走らせるため、毎回コンパイル&再実行して
        // ゲームインスタンスを作り直す。そうしないと、プレイヤーが
        // カーソルを動かした後の状態のまま判定されて落ちてしまう。
        await compileAndRun();
        testBtn.disabled = true;  // compileAndRun の末尾で enable される
        testBtn.textContent = "テスト中…";
        await sleep(250);
        await runAutoTests();
      } finally {
        testBtn.textContent = (TESTS && TESTS.length) ? "テスト実行" : "テストなし";
        testBtn.disabled = !(TESTS && TESTS.length);
      }
    });
  }

  setStatus("ready to run", "idle");
})();
