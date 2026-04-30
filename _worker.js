/**
 * yasuda-dev.com のルート Worker.
 *
 * 役割:
 *  - /api/explain への POST だけは自分で処理 (Gemini に中継して未経験者向け
 *    の解説を返す)
 *  - それ以外の全パスは ASSETS バインディング経由で静的ファイルを配信
 *
 * GEMINI_API_KEY は Cloudflare Dashboard の yasuda-dev-site Worker 設定で
 * Secret として登録すること。コードに含めない。
 */

const ALLOWED_ORIGINS = new Set([
  "https://yasuda-dev.com",
  "https://www.yasuda-dev.com",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
]);

const MODEL_MAP = {
  lite:  "gemini-3.1-flash-lite-preview",
  flash: "gemini-3-flash-preview",
  pro:   "gemini-3.1-pro-preview",
};

const SYSTEM_PROMPT = `
あなたは Java を学び始めた未経験者向けの講師です。学習者が問題に間違えました。
以下の方針で解説してください:

  1. 250 字以内で簡潔に
  2. まず「生徒の回答」と「期待される回答」を意味的に比較し、何が違うかを具体的に指摘する。
     - 不等号や条件の向きには特に注意:
       「a < b」は「a が b より小さい」という意味で、左右を入れ替えると意味が変わる
       (例: 「20 < x」は「x が 20 より大きい」であり、「x < 20」とは別の条件)
     - && / || の組み合わせ、null チェックの順序、== と equals の使い分けなど、
       「動くけれど意図と違う」ケースを正しく見抜く。
       逆に、変数名や見た目が違うだけで意味が同じなら、そのことを認める
  3. 「動きます」「正しいです」のような曖昧な肯定はしない。
     意味が異なる場合は「期待された動作と結果が変わる」と明確に書く
  4. 専門用語は最小限。使うときは平易な言葉で言い換える
  5. 次に何を確認すればよいかを前向きに示す
  6. 正解そのものは書かない (ヒントに留める)

回答は日本語、Markdown は使わずプレーンテキスト。
`.trim();

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/explain") {
      return handleExplain(request, env);
    }
    // 静的アセットへフォールスルー
    return env.ASSETS.fetch(request);
  },
};

async function handleExplain(request, env) {
  const origin = request.headers.get("Origin") || "";
  const corsHeaders = buildCorsHeaders(origin);

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, corsHeaders);
  }

  if (!env.GEMINI_API_KEY) {
    return json({ error: "GEMINI_API_KEY is not configured" }, 500, corsHeaders);
  }

  let body;
  try {
    body = await request.json();
  } catch (_) {
    return json({ error: "Invalid JSON" }, 400, corsHeaders);
  }

  const modelKey = body.model === "flash" || body.model === "pro" ? body.model : "lite";
  const model = MODEL_MAP[modelKey];

  const userPart = buildUserPrompt(body);

  const upstream = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: userPart }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 600,
        },
      }),
    },
  );

  if (!upstream.ok) {
    const errText = await upstream.text();
    return json(
      { error: "Gemini upstream error", status: upstream.status, detail: errText.slice(0, 500) },
      502,
      corsHeaders,
    );
  }

  const data = await upstream.json();
  const explanation = extractText(data);

  return json({ explanation, model }, 200, corsHeaders);
}

const TYPE_LABELS = {
  blank:       "穴埋め",
  predict:     "コードの出力予測",
  choice:      "択一",
  multichoice: "複数選択",
};

function buildUserPrompt({ type, topic, level, prompt, expected, userAnswer, errors }) {
  const parts = [];
  if (topic) parts.push(`【トピック】${topic}`);
  const typeLabel = TYPE_LABELS[type];
  if (typeLabel) {
    parts.push(`【問題形式】${typeLabel}`);
  } else if (typeof level === "number") {
    parts.push(`【難易度】${level === 1 ? "穴埋め" : "数行記述"}`);
  }
  if (prompt) parts.push(`【問題】\n${prompt}`);
  if (expected) parts.push(`【期待される回答 (生徒には見せない)】\n${expected}`);
  if (userAnswer) parts.push(`【生徒の回答】\n${userAnswer}`);
  if (errors && errors.length) parts.push(`【コンパイラ/実行エラー】\n${errors.join("\n")}`);

  // 問題形式に応じた追加指示
  if (type === "predict") {
    parts.push(
      "出力予測の問題です。コードを 1 行ずつ実行した結果を脳内で追って、" +
        "生徒が見落としている動作 (ループ条件、初期値、副作用、改行の有無、出力フォーマット等) を 1 点だけ示してください。" +
        "正解の出力そのものは書かないこと。",
    );
  } else if (type === "choice") {
    parts.push(
      "択一の問題です。生徒が選んだ選択肢が間違いである理由を端的に説明し、" +
        "正解の選択肢に向かうための着眼点をヒントとして示してください。正解の選択肢の記号や本文をそのまま書かないこと。",
    );
  } else if (type === "multichoice") {
    parts.push(
      "複数選択 (正しいものを全て選ぶ) の問題です。生徒の選んだ集合と正解の集合を比較し、" +
        "「足りない正解」と「余分に選んでしまった誤答」のうち学習効果が高い 1〜2 点を中心に説明してください。" +
        "正解の選択肢の記号や本文をそのまま書かないこと。",
    );
  } else {
    parts.push(
      "上の情報を踏まえ、生徒の誤りを 200 字以内で解説してください。" +
        "正解そのものは書かず、次に確認すべき点をヒントとして示すこと。",
    );
  }
  return parts.join("\n\n");
}

function extractText(geminiResponse) {
  const candidate = geminiResponse?.candidates?.[0];
  const parts = candidate?.content?.parts || [];
  return parts.map((p) => p.text || "").join("").trim() || "(解説を生成できませんでした)";
}

function buildCorsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : "https://yasuda-dev.com";
  return {
    "access-control-allow-origin": allowed,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
    vary: "Origin",
  };
}

function json(payload, status, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  });
}
