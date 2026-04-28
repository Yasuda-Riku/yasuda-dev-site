/**
 * Java 復習アプリの localStorage ヘルパ.
 *
 * 全データを 1 つのキー (java-review-state) に JSON で固める。
 * スキーマは下の DEFAULT_STATE を参照。マイグレーションは未実装、
 * 互換性が壊れたらキーを変えて作り直す方針。
 */

const STATE_KEY = "java-review-state";

const DEFAULT_STATE = {
  // 各問題ごとの結果。{ correct, attempts, lastAt }
  questions: {},
  // 解いたセクション (warmup / chXX) ごとの完了状況。
  sections: {},
  // 連続学習日数
  streak: { count: 0, lastDate: null },
  // 間隔反復: 次にもう一度出すべき問題 ID と、出すべき日付
  reviewQueue: [],
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return { ...structuredClone(DEFAULT_STATE), ...parsed };
  } catch (_) {
    return structuredClone(DEFAULT_STATE);
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch (_) {
    /* localStorage 不可ならサイレント */
  }
}

/** 問題を解いたときに呼ぶ。correct = true / false。 */
export function recordAnswer(questionId, correct) {
  const state = loadState();
  const prev = state.questions[questionId] || { correct: false, attempts: 0, lastAt: 0 };
  state.questions[questionId] = {
    correct: prev.correct || correct,
    attempts: prev.attempts + 1,
    lastAt: Date.now(),
  };
  // 間隔反復: 間違えたものは復習キューに、正解したら抜く
  state.reviewQueue = state.reviewQueue.filter((q) => q.id !== questionId);
  if (!correct) {
    const nextDays = Math.min(7, (prev.attempts || 0) + 1);
    state.reviewQueue.push({
      id: questionId,
      dueAt: Date.now() + nextDays * 86400000,
    });
  }
  bumpStreak(state);
  saveState(state);
  return state;
}

/** セクションを完了したときに呼ぶ。 */
export function recordSectionComplete(sectionId, total) {
  const state = loadState();
  state.sections[sectionId] = {
    completedAt: Date.now(),
    total,
  };
  bumpStreak(state);
  saveState(state);
  return state;
}

function bumpStreak(state) {
  const today = todayString();
  const last = state.streak.lastDate;
  if (last === today) return;
  const yesterday = todayString(-1);
  state.streak.count = last === yesterday ? state.streak.count + 1 : 1;
  state.streak.lastDate = today;
}

function todayString(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 復習キューのうち、今日以前に期限が来ているものを返す。 */
export function dueReviewIds() {
  const state = loadState();
  const now = Date.now();
  return state.reviewQueue.filter((q) => q.dueAt <= now).map((q) => q.id);
}

/** ストリークを今日付けでチェック (継続が切れたら count を 0 に)。 */
export function streakStatus() {
  const state = loadState();
  const today = todayString();
  const yesterday = todayString(-1);
  const last = state.streak.lastDate;
  if (last === today || last === yesterday) {
    return { count: state.streak.count, lastDate: last, alive: true };
  }
  return { count: 0, lastDate: last, alive: false };
}
