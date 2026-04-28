# Java 復習アプリ用 Gemini 中継 Worker

`/learn/java-review/` から呼ばれる API。ユーザの誤答に対して
未経験者向けの解説を Gemini で生成して返す。

## デプロイ手順

### 1. 依存セットアップ (初回のみ)

```bash
cd cloudflare/explain-worker
npm install -g wrangler   # 既に入っていればスキップ
wrangler login            # ブラウザで Cloudflare アカウント認証
```

### 2. API key を Secret として登録

Worker のコードや Git リポジトリに API key を**絶対に書かない**。
Wrangler の Secret として登録する:

```bash
wrangler secret put GEMINI_API_KEY
# プロンプトが出るので、Google AI Studio で発行したキーを貼り付ける
```

### 3. デプロイ

```bash
wrangler deploy
```

成功すると `https://yasuda-dev-explain.<your-subdomain>.workers.dev` のような
URL が表示される。これをフロントエンドから呼ぶ。

### 4. レート制限 (推奨)

Cloudflare Dashboard → 該当 Worker → Settings → Triggers / Routes、
または Security → WAF → Rate Limiting Rules で:

- パス: `/`
- 対象: `yasuda-dev-explain.*.workers.dev` (または独自ドメインに割り当てる場合はそちら)
- 制限: 同一 IP から `60 requests / 1 minute` を超えたらブロック

無料プランの簡易版でも、暴走防止には十分。

### 5. 動作確認

```bash
curl -X POST https://yasuda-dev-explain.<your-subdomain>.workers.dev \
  -H "content-type: application/json" \
  -d '{
    "topic": "control-flow",
    "level": 1,
    "prompt": "0 から 9 まで表示する for 文を完成させてください",
    "expected": "i < 10",
    "userAnswer": "i <= 10"
  }'
```

JSON で `explanation` フィールドが返れば OK。

## キー漏洩時の対応

1. Google AI Studio でキーを **Revoke**
2. 新しいキーを発行
3. `wrangler secret put GEMINI_API_KEY` で再登録
4. `wrangler deploy` で再デプロイ (Secret 変更だけなら不要だが念のため)
