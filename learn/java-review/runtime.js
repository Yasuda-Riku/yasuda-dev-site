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
          <p><a href="../">コースに戻る</a></p>
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

  card.innerHTML = `
    <div class="quiz__subtopic">${escapeHtml(q.subtopic || "")}</div>
    <h2 class="quiz__prompt">${escapeHtml(q.prompt)}</h2>
    <pre class="quiz__starter">${renderStarter(q)}</pre>
    <div class="quiz__answer-row">
      <input type="text" class="quiz__answer" data-answer
             placeholder="ここに答えを入力" autocomplete="off"
             autocorrect="off" autocapitalize="off" spellcheck="false">
      <button type="button" class="quiz__submit" data-submit>解答</button>
    </div>
    <div class="quiz__feedback" data-feedback hidden></div>
    <div class="quiz__hint" data-hint hidden>
      <span class="quiz__hint-label">ヒント</span><span data-hint-text></span>
    </div>
    <div class="quiz__ai" data-ai hidden>
      <span class="quiz__ai-label">AI による解説</span>
      <div data-ai-text></div>
    </div>
  `;

  const input  = card.querySelector("[data-answer]");
  const submit = card.querySelector("[data-submit]");
  const next   = ctx.rootEl.querySelector("[data-next]");
  const prev   = ctx.rootEl.querySelector("[data-prev]");

  input.focus();
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submit.click();
  });
  submit.addEventListener("click", () => grade(ctx, q, input.value, attempt));

  prev.disabled = ctx.index === 0;
  prev.onclick = () => { ctx.index = Math.max(0, ctx.index - 1); renderQuestion(ctx); };
  next.disabled = false;
  next.textContent = ctx.index === total - 1 ? "完了 →" : "スキップ →";
  next.onclick = () => goNext(ctx);
}

function grade(ctx, q, raw, attempt) {
  const card = ctx.rootEl.querySelector("[data-card]");
  const feedback = card.querySelector("[data-feedback]");
  const hintBox  = card.querySelector("[data-hint]");
  const aiBox    = card.querySelector("[data-ai]");
  feedback.hidden = false;
  aiBox.hidden = true;

  const ok = matches(q, raw);
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
      askAi(ctx, q, raw, e.target);
    };
    feedback.querySelector("[data-skip]").onclick = () => goNext(ctx);
  }
}

async function askAi(ctx, q, userAnswer, btn) {
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
        topic: q.subtopic || ctx.sectionId,
        level: q.level || 1,
        prompt: q.prompt,
        expected: q.answer,
        userAnswer,
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
      <a href="../">コースに戻る</a>
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
