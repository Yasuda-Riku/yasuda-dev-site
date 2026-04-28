/**
 * Java 復習アプリ用の Gemini 中継 Worker.
 *
 * 役割:
 *  - フロントから POST されたユーザコード + 期待値 + トピックを Gemini に投げ、
 *    未経験者向けの解説テキストを返す
 *  - API key (GEMINI_API_KEY) は Cloudflare の Secret に保存。コードに含めない
 *  - CORS は yasuda-dev.com 系列に限定
 *  - 同一 IP からのバースト呼び出しは Cloudflare 側のレート制限ルールで弾く想定
 *
 * Endpoint:
 *  POST /  body = JSON
 *    {
 *      "topic":      "control-flow",          // 任意。文脈に効く
 *      "level":      1,                       // 1 = 穴埋め, 2 = 数行記述
 *      "prompt":     "問題文",
 *      "expected":   "期待される回答",
 *      "userAnswer": "ユーザの回答",
 *      "errors":     ["javac のエラー (任意)"],
 *      "model":      "lite" | "flash"         // 任意。省略時 lite
 *    }
 *  → 200 { explanation: string, model: string }
 */

const ALLOWED_ORIGINS = new Set([
  "https://yasuda-dev.com",
  "https://www.yasuda-dev.com",
  // ローカル動作確認用
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

  1. 200 字以内で簡潔に
  2. 「なぜその回答だと正しくないか」を具体的に
  3. 専門用語は最小限。使うときは平易な言葉で言い換える
  4. 否定的な言い方を避け、次に何を試せばよいか前向きに示す
  5. 正解そのものは書かない (ヒントに留める)

回答は日本語、Markdown は使わずプレーンテキスト。
`.trim();

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const corsHeaders = buildCorsHeaders(origin);

    // CORS preflight
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
  },
};

function buildUserPrompt({ topic, level, prompt, expected, userAnswer, errors }) {
  const parts = [];
  if (topic) parts.push(`【トピック】${topic}`);
  if (typeof level === "number") parts.push(`【難易度】${level === 1 ? "穴埋め" : "数行記述"}`);
  if (prompt) parts.push(`【問題】\n${prompt}`);
  if (expected) parts.push(`【期待される回答 (生徒には見せない)】\n${expected}`);
  if (userAnswer) parts.push(`【生徒の回答】\n${userAnswer}`);
  if (errors && errors.length) parts.push(`【コンパイラ/実行エラー】\n${errors.join("\n")}`);
  parts.push(
    "上の情報を踏まえ、生徒の誤りを 200 字以内で解説してください。" +
      "正解そのものは書かず、次に確認すべき点をヒントとして示すこと。",
  );
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
