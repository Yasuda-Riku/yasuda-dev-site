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
  recordSectionComplete,
} from "./storage.js";

const API_ENDPOINT = "/api/explain";

const root = document.getElementById("quiz");
if (root) start(root).catch((err) => {
  console.error(err);
  root.innerHTML = `<p>問題の読み込みに失敗しました: ${escapeHtml(err.message)}</p>`;
});

async function start(rootEl) {
  const sectionId = rootEl.dataset.section || "unknown";
  const url = rootEl.dataset.questionsUrl || "./questions.json";
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  const questions = await res.json();
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("questions.json が空です");
  }
  renderShell(rootEl, questions.length);
  const ctx = {
    rootEl,
    sectionId,
    questions,
    index: 0,
    state: loadState(),
  };
  renderQuestion(ctx);
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
  submit.addEventListener("click", () => grade(ctx, q, input.value));

  prev.disabled = ctx.index === 0;
  prev.onclick = () => { ctx.index = Math.max(0, ctx.index - 1); renderQuestion(ctx); };
  next.disabled = false;
  next.textContent = ctx.index === total - 1 ? "完了 →" : "スキップ →";
  next.onclick = () => goNext(ctx);
}

function grade(ctx, q, raw) {
  const card = ctx.rootEl.querySelector("[data-card]");
  const feedback = card.querySelector("[data-feedback]");
  const hintBox  = card.querySelector("[data-hint]");
  const aiBox    = card.querySelector("[data-ai]");
  feedback.hidden = false;
  aiBox.hidden = true;

  const ok = matches(q, raw);
  recordAnswer(q.id, ok);

  if (ok) {
    feedback.className = "quiz__feedback quiz__feedback--correct";
    feedback.innerHTML = `
      <strong>正解です。</strong>
      ${q.explanation ? `<div style="margin-top:6px;">${escapeHtml(q.explanation)}</div>` : ""}
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
      hintBox.querySelector("[data-hint-text]").textContent =
        q.hint || "問題文をもう一度よく読んで、求められている形を確認してみよう。";
      hintBox.hidden = false;
    };
    feedback.querySelector("[data-ask-ai]").onclick = (e) => askAi(ctx, q, raw, e.target);
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
  recordSectionComplete(ctx.sectionId, ctx.questions.length);
  ctx.rootEl.querySelector(".quiz__progress-bar-fill").style.width = "100%";
  ctx.rootEl.querySelector(".quiz__progress-label").textContent =
    `${ctx.questions.length} / ${ctx.questions.length}`;
  const card = ctx.rootEl.querySelector("[data-card]");
  card.className = "quiz__card quiz__done";
  card.innerHTML = `
    <h2>このセクションは以上です。お疲れさま！</h2>
    <p>間違えた問題は明日以降の「復習対象」として戻ってきます。</p>
    <p>
      <a href="../">コースに戻る</a>
    </p>
  `;
  const nav = ctx.rootEl.querySelector(".quiz__nav");
  if (nav) nav.remove();
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
