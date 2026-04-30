/**
 * Java 復習アプリの問題ランタイム.
 *
 * セクションのページに以下のマークアップがあれば自動で起動する:
 *
 *   <div id="quiz" data-section="warmup" data-questions-url="./questions.json"></div>
 *
 * 流れ:
 *   1. questions.json を fetch
 *   2. 1 問ずつ出題 → 入力 → 判定
 *   3. 不正解なら local hint → "AI に解説してもらう" ボタン
 *   4. ボタンを押したら POST /api/explain に投げて Gemini の解説を表示
 *   5. 全問終わったら完了画面
 */

import {
  loadState,
  recordAnswer,
  markAssisted,
  recordSectionComplete,
  getSectionProgress,
  setSectionProgress,
  clearSectionProgress,
} from "./storage.js";

const API_ENDPOINT = "/api/explain";

// Prism.js を CDN から遅延ロード (predict/choice の code ハイライト用)。
// 失敗してもクイズ自体は動くので reject せずに resolve する。
const prismReady = new Promise((resolve) => {
  if (typeof window === "undefined") return resolve();
  if (window.Prism && window.Prism.languages?.java) return resolve();
  const s1 = document.createElement("script");
  s1.src = "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js";
  s1.onload = () => {
    const s2 = document.createElement("script");
    s2.src = "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-java.min.js";
    s2.onload = () => resolve();
    s2.onerror = () => resolve();
    document.head.appendChild(s2);
  };
  s1.onerror = () => resolve();
  document.head.appendChild(s1);
});

function highlightWithin(card) {
  prismReady.then(() => {
    if (!window.Prism) return;
    card.querySelectorAll('pre code[class*="language-"]').forEach((el) => {
      window.Prism.highlightElement(el);
    });
  });
}

// review-wrong モードで全章を集めるためのファイル一覧。
// ★ start(root) を呼ぶ前に初期化する必要がある (TDZ 対策)。
const ALL_QUESTION_FILES = [
  "/learn/java-review/warmup/questions.json",
  "/learn/java-review/ch01-class-instance/questions.json",
  "/learn/java-review/ch02-class-usage/questions.json",
  "/learn/java-review/ch03-inheritance/questions.json",
  "/learn/java-review/ch04-interface/questions.json",
  "/learn/java-review/ch05-collection/questions.json",
  "/learn/java-review/ch06-exception/questions.json",
  "/learn/java-review/ch07-package/questions.json",
];

const root = document.getElementById("quiz");
if (root) start(root).catch((err) => {
  console.error(err);
  root.innerHTML = `<p>問題の読み込みに失敗しました: ${escapeHtml(err.message)}</p>`;
});

async function start(rootEl) {
  const sectionId = rootEl.dataset.section || "unknown";
  const mode = rootEl.dataset.mode;

  let questions;
  if (mode === "review-wrong") {
    questions = await loadWrongAnsweredQuestions();
    if (questions.length === 0) {
      rootEl.innerHTML = `
        <div class="quiz__card quiz__done">
          <h2>まだ間違えた問題はありません</h2>
          <p>各章を解いて、間違えた問題があるとここに溜まります。<br>
             正解できた問題は自動的にこのリストから消えます。</p>
          <p><a href="/learn/java-review/">コースに戻る</a></p>
        </div>`;
      return;
    }
  } else {
    const url = rootEl.dataset.questionsUrl || "./questions.json";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
    questions = await res.json();
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("questions.json が空です");
    }
  }

  renderShell(rootEl, questions.length);
  const ctx = {
    rootEl,
    sectionId,
    questions,
    index: 0,
    state: loadState(),
  };

  // 前回の途中位置があれば、再開するか最初からかを尋ねる。
  // review-wrong は対象が動的に変わるので再開しない。
  const saved = mode === "review-wrong" ? null : getSectionProgress(sectionId);
  if (saved && saved.index > 0 && saved.index < questions.length) {
    showResumePrompt(ctx, saved.index);
  } else {
    renderQuestion(ctx);
  }
}

function showResumePrompt(ctx, savedIndex) {
  // 再開選択中は前後ナビを誤押下できないよう無効化
  const prev = ctx.rootEl.querySelector("[data-prev]");
  const next = ctx.rootEl.querySelector("[data-next]");
  if (prev) prev.disabled = true;
  if (next) next.disabled = true;
  const card = ctx.rootEl.querySelector("[data-card]");
  card.innerHTML = `
    <div class="quiz__subtopic">前回の続きから再開できます</div>
    <h2 class="quiz__prompt">前回は ${savedIndex + 1} 問目まで進めました。</h2>
    <div class="quiz__feedback-actions" style="display:flex;gap:10px;flex-wrap:wrap;">
      <button type="button" class="quiz__submit" data-resume>続きから (${savedIndex + 1} / ${ctx.questions.length})</button>
      <button type="button" class="quiz__nav-btn" data-restart>最初からやり直す</button>
    </div>
  `;
  card.querySelector("[data-resume]").onclick = () => {
    ctx.index = savedIndex;
    renderQuestion(ctx);
  };
  card.querySelector("[data-restart]").onclick = () => {
    ctx.index = 0;
    clearSectionProgress(ctx.sectionId);
    renderQuestion(ctx);
  };
}

function renderShell(rootEl, total) {
  rootEl.innerHTML = `
    <div class="quiz__progress">
      <span class="quiz__progress-label">0 / ${total}</span>
      <div class="quiz__progress-bar"><div class="quiz__progress-bar-fill"></div></div>
    </div>
    <div class="quiz__card" data-card></div>
    <div class="quiz__nav">
      <button type="button" class="quiz__nav-btn" data-prev disabled>← 前へ</button>
      <button type="button" class="quiz__nav-btn" data-next>スキップ →</button>
    </div>
  `;
}

function renderQuestion(ctx) {
  const q = ctx.questions[ctx.index];
  const card = ctx.rootEl.querySelector("[data-card]");
  const total = ctx.questions.length;

  // この問題で援助 (ヒント or AI) を見たかを問題ローカルで追跡。
  // 解答が合っていてもこのフラグが true なら「援助ありの正解」として復習対象に残る。
  const attempt = { assisted: false };

  // 現在位置を保存。途中で離脱しても次回はここから再開できる。
  // review-wrong は内容が動的なので再開対象から外す。
  if (ctx.sectionId !== "review-wrong") {
    setSectionProgress(ctx.sectionId, ctx.index, total);
  }

  // progress
  ctx.rootEl.querySelector(".quiz__progress-label").textContent = `${ctx.index + 1} / ${total}`;
  ctx.rootEl.querySelector(".quiz__progress-bar-fill").style.width =
    `${Math.round((ctx.index / total) * 100)}%`;

  const type = q.type || "blank";
  const handler = TYPES[type] || TYPES.blank;

  card.innerHTML = `
    <div class="quiz__subtopic">${escapeHtml(q.subtopic || "")}</div>
    <h2 class="quiz__prompt">${escapeHtml(q.prompt)}</h2>
    ${handler.renderBody(q)}
    <div class="quiz__feedback" data-feedback hidden></div>
    <div class="quiz__hint" data-hint hidden>
      <span class="quiz__hint-label">ヒント</span><span data-hint-text></span>
    </div>
    <div class="quiz__ai" data-ai hidden>
      <span class="quiz__ai-label">AI による解説</span>
      <div data-ai-text></div>
    </div>
  `;

  handler.afterRender(card);
  highlightWithin(card);

  const submit = card.querySelector("[data-submit]");
  const next   = ctx.rootEl.querySelector("[data-next]");
  const prev   = ctx.rootEl.querySelector("[data-prev]");

  submit.addEventListener("click", () => {
    const value = handler.readUserAnswer(card);
    if (handler.isEmpty(value)) return;
    grade(ctx, q, handler, value, attempt);
  });

  prev.disabled = ctx.index === 0;
  prev.onclick = () => { ctx.index = Math.max(0, ctx.index - 1); renderQuestion(ctx); };
  next.disabled = false;
  next.textContent = ctx.index === total - 1 ? "完了 →" : "スキップ →";
  next.onclick = () => goNext(ctx);
}

function grade(ctx, q, handler, value, attempt) {
  const card = ctx.rootEl.querySelector("[data-card]");
  const feedback = card.querySelector("[data-feedback]");
  const hintBox  = card.querySelector("[data-hint]");
  const aiBox    = card.querySelector("[data-ai]");
  feedback.hidden = false;
  aiBox.hidden = true;

  const ok = handler.judge(q, value);
  recordAnswer(q.id, ok, { assisted: attempt.assisted });

  if (ok) {
    feedback.className = "quiz__feedback quiz__feedback--correct";
    const assistedNote = attempt.assisted
      ? `<div class="quiz__feedback-note">ヒント / AI を使ったので、この問題は「間違えた問題」セクションに残ります。</div>`
      : "";
    feedback.innerHTML = `
      <strong>正解です。</strong>
      ${q.explanation ? `<div style="margin-top:6px;">${escapeHtml(q.explanation)}</div>` : ""}
      ${assistedNote}
      <div class="quiz__feedback-actions">
        <button type="button" class="quiz__action" data-go-next>次の問題へ →</button>
      </div>
    `;
    feedback.querySelector("[data-go-next]").onclick = () => goNext(ctx);
    hintBox.hidden = true;
  } else {
    feedback.className = "quiz__feedback quiz__feedback--wrong";
    feedback.innerHTML = `
      <strong>もう少し！ もう一度試してみて。</strong>
      <div class="quiz__feedback-actions">
        <button type="button" class="quiz__action" data-show-hint>ヒントを見る</button>
        <button type="button" class="quiz__action" data-ask-ai>AI に解説してもらう</button>
        <button type="button" class="quiz__action" data-skip>スキップ</button>
      </div>
    `;
    feedback.querySelector("[data-show-hint]").onclick = () => {
      attempt.assisted = true;
      markAssisted(q.id);
      hintBox.querySelector("[data-hint-text]").textContent =
        q.hint || "問題文をもう一度よく読んで、求められている形を確認してみよう。";
      hintBox.hidden = false;
    };
    feedback.querySelector("[data-ask-ai]").onclick = (e) => {
      attempt.assisted = true;
      markAssisted(q.id);
      askAi(ctx, q, handler, value, e.target);
    };
    feedback.querySelector("[data-skip]").onclick = () => goNext(ctx);
  }
}

async function askAi(ctx, q, handler, userAnswer, btn) {
  const aiBox = ctx.rootEl.querySelector("[data-ai]");
  const aiText = aiBox.querySelector("[data-ai-text]");
  aiBox.hidden = false;
  aiText.innerHTML = `<span class="quiz__ai-loading">考え中…</span>`;
  btn.disabled = true;
  try {
    const res = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: q.type || "blank",
        topic: q.subtopic || ctx.sectionId,
        level: q.level || 1,
        prompt: handler.enrichPrompt(q),
        expected: handler.presentExpected(q),
        userAnswer: handler.presentUser(q, userAnswer),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      aiText.textContent = `(エラー) ${data.error || res.status}`;
      return;
    }
    aiText.textContent = data.explanation || "(解説を取得できませんでした)";
  } catch (err) {
    aiText.textContent = `(ネットワークエラー) ${err.message}`;
  } finally {
    btn.disabled = false;
  }
}

function goNext(ctx) {
  if (ctx.index >= ctx.questions.length - 1) {
    finish(ctx);
    return;
  }
  ctx.index++;
  renderQuestion(ctx);
}

function finish(ctx) {
  // 通常セクションは完了マークを保存。「間違えた問題」は動的に内容が変わるので、
  // 完了マークは付けず、進捗保存だけクリアする。
  if (ctx.sectionId !== "review-wrong") {
    recordSectionComplete(ctx.sectionId, ctx.questions.length);
  } else {
    clearSectionProgress(ctx.sectionId);
  }
  ctx.rootEl.querySelector(".quiz__progress-bar-fill").style.width = "100%";
  ctx.rootEl.querySelector(".quiz__progress-label").textContent =
    `${ctx.questions.length} / ${ctx.questions.length}`;
  const card = ctx.rootEl.querySelector("[data-card]");
  card.className = "quiz__card quiz__done";
  card.innerHTML = `
    <h2>このセクションは以上です。お疲れさま！</h2>
    <p>間違えた問題は「間違えた問題」セクションから後でまとめて復習できます。</p>
    <p>
      <a href="/learn/java-review/">コースに戻る</a>
    </p>
  `;
  const nav = ctx.rootEl.querySelector(".quiz__nav");
  if (nav) nav.remove();
}

/** localStorage の state を見て、まだ正解していない問題だけを全章から集める。 */
async function loadWrongAnsweredQuestions() {
  const all = [];
  for (const url of ALL_QUESTION_FILES) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      const items = await res.json();
      if (Array.isArray(items)) all.push(...items);
    } catch (_) { /* 1 章だけ取得失敗してもほかは続行 */ }
  }
  const state = loadState();
  return all.filter((q) => {
    const rec = state.questions?.[q.id];
    if (!rec) return false;
    // 不正解 OR 援助あり (ヒント/AI を見て正解した) は復習対象。
    return rec.correct === false || rec.assisted === true;
  });
}

function matches(q, raw) {
  const v = (raw || "").trim();
  if (!v) return false;
  if (q.regex) {
    try { return new RegExp(q.regex).test(v); } catch (_) { /* fallthrough */ }
  }
  if (normalize(v) === normalize(q.answer)) return true;
  if (Array.isArray(q.alternatives)) {
    return q.alternatives.some((a) => normalize(v) === normalize(a));
  }
  return false;
}

/**
 * 問題タイプごとのハンドラ。
 *   blank   : 既存の穴埋め (q.starter / q.answer)
 *   predict : コードの出力予測 (q.code / q.answer) — 文字列比較
 *   choice  : 択一 (q.code? / q.choices[] / q.answerIndex) — index 比較
 *
 * 各ハンドラは:
 *   renderBody(q)              -> innerHTML 文字列 (中央領域)
 *   afterRender(card)          -> イベント配線 + フォーカス
 *   readUserAnswer(card)       -> ユーザの解答 (string | number | null)
 *   isEmpty(value)             -> 空判定
 *   judge(q, value)            -> 正誤
 *   presentExpected(q)         -> AI に渡す「期待される回答」テキスト
 *   presentUser(q, value)      -> AI に渡す「生徒の回答」テキスト
 *   enrichPrompt(q)            -> AI に渡す問題本文 (選択肢やコードを含む)
 */
const LETTERS = ["A", "B", "C", "D", "E", "F"];

const TYPES = {
  blank: {
    renderBody(q) {
      return `
        <pre class="quiz__starter">${renderStarter(q)}</pre>
        <div class="quiz__answer-row">
          <input type="text" class="quiz__answer" data-answer
                 placeholder="ここに答えを入力" autocomplete="off"
                 autocorrect="off" autocapitalize="off" spellcheck="false">
          <button type="button" class="quiz__submit" data-submit>解答</button>
        </div>
      `;
    },
    afterRender(card) {
      const input = card.querySelector("[data-answer]");
      input.focus();
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") card.querySelector("[data-submit]").click();
      });
    },
    readUserAnswer(card) {
      return card.querySelector("[data-answer]").value;
    },
    isEmpty(v) { return !String(v || "").trim(); },
    judge(q, v) { return matches(q, v); },
    presentExpected(q) { return q.answer; },
    presentUser(_q, v) { return v; },
    enrichPrompt(q) {
      return q.starter ? `${q.prompt}\n\n--- コード (___ が空欄) ---\n${q.starter}` : q.prompt;
    },
  },

  predict: {
    renderBody(q) {
      return `
        <pre class="quiz__starter"><code class="language-java">${escapeHtml(q.code || "")}</code></pre>
        <div class="quiz__predict-label">↓ このコードを実行したときの出力をそのまま入力</div>
        <div class="quiz__answer-row">
          <input type="text" class="quiz__answer" data-answer
                 placeholder="例: 012  /  Hello world" autocomplete="off"
                 autocorrect="off" autocapitalize="off" spellcheck="false">
          <button type="button" class="quiz__submit" data-submit>解答</button>
        </div>
      `;
    },
    afterRender(card) {
      const input = card.querySelector("[data-answer]");
      input.focus();
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") card.querySelector("[data-submit]").click();
      });
    },
    readUserAnswer(card) {
      return card.querySelector("[data-answer]").value;
    },
    isEmpty(v) { return !String(v || "").trim(); },
    judge(q, v) { return matches(q, v); },
    presentExpected(q) { return q.answer; },
    presentUser(_q, v) { return v; },
    enrichPrompt(q) {
      return `${q.prompt}\n\n--- コード ---\n${q.code || ""}`;
    },
  },

  choice: {
    renderBody(q) {
      const codeBlock = q.code
        ? `<pre class="quiz__starter"><code class="language-java">${escapeHtml(q.code)}</code></pre>`
        : "";
      const choices = (q.choices || []).map((c, i) => `
        <label class="quiz__choice">
          <input type="radio" name="quiz-choice-${q.id}" value="${i}" data-choice>
          <span class="quiz__choice-key">${LETTERS[i]}</span>
          <span class="quiz__choice-text">${escapeHtml(c)}</span>
        </label>
      `).join("");
      return `
        ${codeBlock}
        <div class="quiz__choices" role="radiogroup">${choices}</div>
        <div class="quiz__answer-row">
          <button type="button" class="quiz__submit" data-submit disabled>解答</button>
        </div>
      `;
    },
    afterRender(card) {
      const submit = card.querySelector("[data-submit]");
      card.querySelectorAll("[data-choice]").forEach((r) => {
        r.addEventListener("change", () => { submit.disabled = false; });
      });
    },
    readUserAnswer(card) {
      const checked = card.querySelector("[data-choice]:checked");
      return checked ? Number(checked.value) : null;
    },
    isEmpty(v) { return v === null || v === undefined; },
    judge(q, v) { return Number.isInteger(v) && v === q.answerIndex; },
    presentExpected(q) {
      const i = q.answerIndex;
      return `${LETTERS[i]}. ${q.choices?.[i] ?? ""}`;
    },
    presentUser(q, v) {
      if (v === null || v === undefined) return "(未選択)";
      return `${LETTERS[v]}. ${q.choices?.[v] ?? ""}`;
    },
    enrichPrompt(q) {
      const list = (q.choices || []).map((c, i) => `${LETTERS[i]}. ${c}`).join("\n");
      const codePart = q.code ? `\n\n--- コード ---\n${q.code}` : "";
      return `${q.prompt}\n\n--- 選択肢 ---\n${list}${codePart}`;
    },
  },

  multichoice: {
    renderBody(q) {
      const codeBlock = q.code
        ? `<pre class="quiz__starter"><code class="language-java">${escapeHtml(q.code)}</code></pre>`
        : "";
      const choices = (q.choices || []).map((c, i) => `
        <label class="quiz__choice quiz__choice--multi">
          <input type="checkbox" value="${i}" data-choice>
          <span class="quiz__choice-key">${LETTERS[i]}</span>
          <span class="quiz__choice-text">${escapeHtml(c)}</span>
        </label>
      `).join("");
      return `
        ${codeBlock}
        <p class="quiz__multi-hint">正しいものを<strong>すべて</strong>選んでください (複数あり)</p>
        <div class="quiz__choices" role="group">${choices}</div>
        <div class="quiz__answer-row">
          <button type="button" class="quiz__submit" data-submit disabled>解答</button>
        </div>
      `;
    },
    afterRender(card) {
      const submit = card.querySelector("[data-submit]");
      const update = () => {
        const any = !!card.querySelector("[data-choice]:checked");
        submit.disabled = !any;
      };
      card.querySelectorAll("[data-choice]").forEach((r) => {
        r.addEventListener("change", update);
      });
    },
    readUserAnswer(card) {
      return [...card.querySelectorAll("[data-choice]:checked")]
        .map((c) => Number(c.value))
        .sort((a, b) => a - b);
    },
    isEmpty(v) { return !Array.isArray(v) || v.length === 0; },
    judge(q, v) {
      if (!Array.isArray(v) || !Array.isArray(q.answerIndices)) return false;
      const exp = [...q.answerIndices].sort((a, b) => a - b);
      if (v.length !== exp.length) return false;
      return v.every((x, i) => x === exp[i]);
    },
    presentExpected(q) {
      return (q.answerIndices || [])
        .map((i) => `${LETTERS[i]}. ${q.choices?.[i] ?? ""}`)
        .join(" / ");
    },
    presentUser(q, v) {
      if (!Array.isArray(v) || v.length === 0) return "(未選択)";
      return v.map((i) => `${LETTERS[i]}. ${q.choices?.[i] ?? ""}`).join(" / ");
    },
    enrichPrompt(q) {
      const list = (q.choices || []).map((c, i) => `${LETTERS[i]}. ${c}`).join("\n");
      const codePart = q.code ? `\n\n--- コード ---\n${q.code}` : "";
      return `${q.prompt}\n\n--- 選択肢 (複数選択 / 正解は ${q.answerIndices?.length ?? "?"} 個) ---\n${list}${codePart}`;
    },
  },
};

function normalize(s) {
  return String(s).replace(/\s+/g, "").replace(/;$/, "").toLowerCase();
}

function renderStarter(q) {
  const code = String(q.starter || "");
  const blank = q.blank || "___";
  const escaped = escapeHtml(code).replaceAll(escapeHtml(blank),
    `<span class="blank">${escapeHtml(blank)}</span>`);
  return escaped;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
