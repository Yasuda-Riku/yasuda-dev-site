# yasuda-dev-site

静的 HTML/CSS/JS で構築する個人サイト。GitHub にホストし、Cloudflare Pages から自動デプロイ。

## 構成

```
.
├── index.html   # エントリーポイント
├── style.css    # スタイル
├── main.js      # スクリプト
└── README.md
```

## ローカル確認

`index.html` をブラウザで直接開くだけで確認可能。
ライブリロードしたい場合は VS Code の Live Server 拡張などを利用。

## デプロイ

`main` ブランチへ push すると Cloudflare Pages が自動でビルド & デプロイする。
ビルドコマンドなし、出力ディレクトリはリポジトリルート。
