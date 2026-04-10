# yasuda-dev.com — Design Plan v3

> 役割: 実装着手前の最終確定版。これを元にコーディングする。
> 凡例: 🟢 確定 / 🟡 候補 / 🔴 未決定
> 最終更新: 2026-04-10(v3: 全🔴解消、Works確定、章を18→11に圧縮)

---

## v3 変更サマリ

### 解消した🔴
- ✅ コアメッセージ確定: `I build apps and small tools.`
- ✅ カラー確定: **案A** (Warm Mono + Vermillion)、案D 廃止
- ✅ タイポ確定: **Fraunces + Inter + JetBrains Mono を永続**(後から差し替えない)
- ✅ Works 確定: **2件で公開**(Joshirushi + Mentor AI)

### 構造の圧縮(両AI 指摘 反映)
- 章数 18 → **11 + Appendix**(Gemini「メタボリックシンドローム」/ Claude「13-14章に圧縮」)
- §6 モーション + §7 A11y + §8 パフォーマンス + §9 SEO → **§6 Quality Standards** に統合
- §13 マイクロコピー + §14 アセット品質 → **§4 Visual Direction** に統合
- §0 マニフェスト → **§1 に格上げ + 中身を肉付け**(両AI「薄い・原則の焼き直し」指摘)
- Appendix B(両AI比較) → 削除

### コンテンツへの方針転換
- **Works 3-6件 → 2件で始める**
- 理由: 2件しかない = 制約こそが意思表示。3件埋めるために弱い作品を入れない
- セクション名: `Works` → **`Selected`**(2件にふさわしい編集的な響き)

---

## §1 Manifesto & Strategy

### Manifesto

**I build apps and small tools.**

**何を信じているか**

1. **Privacy is not a feature. It's the floor.**
   ユーザーのデータが手元のデバイスから出ない設計を、可能な限り選ぶ。

2. **Restraint is a statement.**
   2件しか並んでいないサイトには、その2件への絶対の自信がある。
   3件埋めるために4番目を作らない。

3. **Built to outlast trends.**
   5年後のブラウザでも、5年後の自分でも、開いて誇れること。
   それができないなら最初から作らない。

**何をしないか**

- 流行のフレームワークの宣伝にならない
- ストック写真とジェネリックなアイコンで埋めない
- 「技術スタック」を箇条書きで誇示しない
- 自分自身を `Passionate developer` と呼ばない
- 作品が増えないからといって作品を増やしたフリをしない

### サイトの目的

| # | 目的 | 重要度 | 配置 |
|---|---|---|---|
| 1 | ポートフォリオの提示 | ★★★ | トップ + `/works/` |
| 2 | アプリのサポートハブ | ★★ | **`/apps/` 独立** |
| 3 | 将来の SaaS 母艦 | ★ | 今は無視 |

**重要方針**: トップは完全にポートフォリオ専用。Apps は隣の建物。
ナビからのリンク1本だけで繋ぐ。

### ターゲット

| ペルソナ | 求めるもの | 必要な体験 |
|---|---|---|
| 採用担当・テックリード | 何を作れるか / 具体的な意思決定 / 連絡手段 | 30秒で要点が伝わる |
| 発注検討クライアント | 実績 / 信頼感 | 明確なCTA |
| アプリのサポート利用者 | 困っているアプリのページ | ナビから1クリックで `/apps/` |
| 同業エンジニア・デザイナー | センス / 技術的な細部 | 細部のクラフトマンシップ |

### コアメッセージ 🟢

**`I build apps and small tools.`**

理由: 短く、誇張がなく、Works を見たときに「言った通りだ」と思わせる。

---

## §2 Information Architecture

```
/                     ← トップ。完全にポートフォリオ専用
/works/               制作物一覧 (将来の拡張用)
/works/[slug]/        個別ケーススタディ
/apps/                アプリのサポートハブ ← 独立ランディング
/apps/[app-slug]/     アプリ別 サポート/規約/プライバシー
/about/               プロフィール詳細
/contact/             問い合わせ
```

**今回作るのは `/` のみ**。他のページは構造として確保しておくが、後日。

### Global Navigation 🟢

- 配置: 固定ヘッダー、背景透過、ボーダーなし、極小フォント
- 左: テキストロゴ `yasuda-dev`
- 右: `Selected` `Apps` `About` `Contact`
- ハンバーガーメニュー禁止 → モバイルでも横並び or 縦スタック

---

## §3 Page Specification

### Section 1 — Hero

**役割**: 0.5秒で「誰」「何をする人」を伝える。それ以上のことはやらない。

**構成 🟢**: タイポグラフィ主体・左寄せ・サブコピーなし

#### ASCII Wireframe (デスクトップ)

```
┌──────────────────────────────────────────────────────┐
│  yasuda-dev               Selected  Apps  About  Contact │  ← 透過固定ヘッダー
├──────────────────────────────────────────────────────┤
│                                                          │
│                                                          │
│                                                          │
│                                                          │
│                                                          │
│   I build apps                                           │
│   and small tools.                                       │
│                                                          │
│                                                          │
│   → Recent projects                                      │
│                                                          │
│                                                          │
│                                                          │
│                                                          │
└──────────────────────────────────────────────────────┘
                          ↓ scroll
```

#### モバイル版

```
┌──────────────────────┐
│ yasuda-dev      ☰    │  ← ※ハンバーガーは禁止。
├──────────────────────┤    実際は縦スタックで Selected/Apps/About を出す
│                          │
│                          │
│  I build apps            │
│  and small tools.        │
│                          │
│  → Recent projects       │
│                          │
└──────────────────────┘
```

### Section 2 — Selected (Works 2件)

**形式**: 縦スタックの大カード(2件専用レイアウト)
**1件あたり**: 画面の縦半分以上を占める贅沢な見せ方

#### ASCII Wireframe

```
┌──────────────────────────────────────────────────────┐
│                                                          │
│   Selected                                               │
│   ─────                                                  │
│                                                          │
│   ┌───────────────────────────────────────┐    │
│   │                                                │    │
│   │     [   Joshirushi screenshot   ]              │    │
│   │                                                │    │
│   └───────────────────────────────────────┘    │
│                                                          │
│   01 — Joshirushi                                2026    │
│   A travel companion for Japanese castle hunters.        │
│                                                          │
│   SwiftUI · App Clip · SwiftData · RevenueCat            │
│                                                          │
│   → On the App Store                                     │
│                                                          │
│                                                          │
│   ┌───────────────────────────────────────┐    │
│   │                                                │    │
│   │     [   Mentor AI screenshot    ]              │    │
│   │                                                │    │
│   └───────────────────────────────────────┘    │
│                                                          │
│   02 — Mentor AI                                 2026    │
│   An interview reflection coach that never                │
│   leaves your phone.                                     │
│                                                          │
│   SwiftUI · MLX · Gemma 4B · iOS Speech                  │
│                                                          │
│   → Coming to the App Store                              │
│                                                          │
└──────────────────────────────────────────────────────┘
```

→ Works コンテンツの詳細は **§8** に記載

### Section 3 — About

- 4〜6行のテキストのみ
- 技術スタックを箇条書きにしない、文章に織り込む
- 末尾に `Read more →` で `/about/` へ
- 日本語の短い1文をここに併記してよい

```
About

I'm a solo developer based in Japan, working
mostly on iOS. I shipped my first app on the
App Store in April 2026, and I'm building the
second one now — a privacy-first interview
coach that runs entirely on-device.

→ More about me
```

### Section 4 — Contact / Footer

- メール / GitHub / X
- フッターは控えめに
- `Crafted with ❤️` 系は禁止

```
Contact

email     hello@yasuda-dev.com
github    @Yasuda-Riku
x         @yasudariku1214

────────────────────────────────────────
yasuda-dev · 2026
```

---

## §4 Visual Direction

### Tone 🟢

**Editorial Minimalism + Manifesto**

雑誌の表紙のように、タイポグラフィと余白で構成する。
ただし「綺麗で空虚」にならないよう、§1 マニフェストの思想を全体に滲ませる。

**模倣の罠への自覚**: rauno.me / paco.me を参考にしつつ、それらの劣化コピーにしないために
**「日本拠点」「朱色のアクセント」「2件しかない潔さ」** を差別化軸にする。

### Principles 🟢

1. **Type does the work** — 装飾より文字組みで魅せる
2. **Generous space** — 余白を惜しまない
3. **One accent only** — 差し色は1色 (vermillion) のみ
4. **Subtle motion** — モーションは「気付かれない程度」
5. **Crafted, not generic** — 1ピクセル単位で意図を込める

### NG List 🟢

#### Visual

- ❌ ストック写真
- ❌ 派手なグラデーション
- ❌ パララックス
- ❌ ヒーロー全画面動画
- ❌ Lottie アニメーションキャラクター
- ❌ 完全な `#000000` / `#FFFFFF`
- ❌ Tailwind デフォルトの indigo/cyan
- ❌ カルーセル / スライダー
- ❌ ハンバーガーメニュー
- ❌ 「年だけ」のタイムライン

#### Copy

- ❌ "Hi, I'm John 👋" 形式の絵文字主導
- ❌ "Crafted with ❤️" フッター
- ❌ "Passionate developer crafting beautiful experiences"
- ❌ 自分を `Solopreneur` `Indie hacker` `Visionary` などと呼ぶ
- ❌ 絵文字を本文・ヒーローで使う

### Microcopy 🟢

| 概念 | ✅ 採用 | ❌ 避ける |
|---|---|---|
| 制作物セクション | `Selected` | `Works` `Projects` `Portfolio` |
| 連絡 | `Contact` | `Say Hello` `Get in touch ✨` |
| 自己紹介 | `About` | `Who I am` |
| もっと見る | `→ Recent projects` `→ More about me` | `View all` `See more` |
| サポート | `Support` | `Help center` |

- 文末ピリオドあり(ステートメント感)
- 矢印は ` → `(半角+スペース)
- 絵文字 0個

### Asset Quality 🟢

#### 画像

- フォーマット: AVIF or WebP(JPEG/PNG はフォールバックのみ)
- アスペクト比: Worksサムネは **16:10 固定**
- ストック写真: **完全禁止**
- フィルター・色補正: 全件で同じ処理 or なし

#### アプリアイコン(Apps ページ用)

- 1024×1024 角丸正方形、影なし

#### OGP 画像

- 1200×630
- 背景: § 5 のカラー
- 中央に Display 書体で `yasuda-dev`
- (将来的にコードの幾何学的な要素を1つだけ追加検討)

#### Favicon / モノグラム

- 16×16 でも判別できるよう **`y` 一文字のモノグラム**
- ファビコンは `y.svg` + `apple-touch-icon.png` (180×180)

---

## §5 Design System

### 5.1 Color 🟢 — 案A: Warm Mono + Vermillion

```
背景:        #FAFAF7   warm off-white
前景:        #1A1A1A   rich black (純黒は使わない)
ミュート:     #767472   warm gray
ボーダー:     #E8E6E1
アクセント:   #FF5A1F   vermillion / 朱
```

**使い方の原則**:
- 背景 95% / 前景 4% / アクセント 1%
- アクセントはリンクホバーと CTA の矢印にのみ使う
- ミュート色は補助情報(年号、技術タグなど)
- ダークモードは作らない

### 5.2 Typography 🟢 — Fraunces + Inter + JetBrains Mono(永続)

```css
:root {
  --font-display: "Fraunces", "Noto Serif JP", serif;
  --font-body:    "Inter", "Noto Sans JP", system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", "Cascadia Code", monospace;
}
```

**理由**: 後から有料書体に差し替えると x-height が変わって余白設計が崩壊する(Gemini 指摘)。
最初から無料書体に振り切り、永続する。

#### Type Scale(可変)

```
Display:  clamp(48px, 8vw, 96px)
H1:       clamp(36px, 5vw, 64px)
H2:       clamp(28px, 3.5vw, 40px)
H3:       1.75rem  (28px)
Body:     1.125rem (18px)
Small:    0.875rem (14px)
```

行間: 本文 1.7、見出し 1.1〜1.2

### 5.3 Spacing & Grid 🟢

- コンテナ最大幅: **1280px**
- グリッド: 12カラム / gutter 24px
- **セクション間: `clamp(80px, 10vw, 140px)`**
  - Gemini「200px攻めろ」と Claude「120px抑えろ」の論争を終結
  - 上限140px で「自信ある余白 / 虚勢にならない」のバランス
- スペーシングスケール: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128`

### 5.4 Breakpoints

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
```
モバイルファースト。

### 5.5 Icons

- Lucide(オープンソース、線が美しい)
- 絵文字は本文・ヒーローで使用しない

---

## §6 Quality Standards

> 旧 §6 (Motion) + §7 (A11y) + §8 (Performance) + §9 (SEO) を統合。
> 両AI 共通指摘: 「現代FE開発の前提を独立章にするのはメタ過剰」。

### Motion

- リンクホバー: 下線が 150-200ms ease-out で出る
- ボタンホバー: 背景色のフェードのみ。シャドウ・浮き上がり禁止
- スクロール出現: フェードのみ、Y軸移動 8px 以内
- ページ遷移: ブラウザ標準。View Transitions API 不使用
- `prefers-reduced-motion` 必須対応

### Accessibility

- WCAG **AA** 以上(本文コントラスト比 4.5:1 以上)
- キーボードナビ完全対応
- フォーカスリングは消さず、デザインに馴染ませる
- 全画像に意味ある `alt`
- セマンティック HTML(`<header>` `<main>` `<article>` `<footer>`)

### Performance

| 指標 | 目標 |
|---|---|
| Lighthouse | **すべて 100** |
| LCP | **< 1.0s** |
| CLS | **0** |
| TBT | **< 50ms** |
| 初回HTML+CSS | **< 30KB gzip** |

施策:
- フォント subset + preload
- 画像 AVIF/WebP、`loading="lazy"`、`width`/`height` 必須
- JavaScript は最小限。フレームワーク不使用
- インラインクリティカル CSS

### SEO / OGP

- `<title>` `<meta description>` `<link rel=canonical>`
- OGP: 1200×630、**手動制作**
- favicon, apple-touch-icon, mask-icon
- `robots.txt`, `sitemap.xml`
- JSON-LD: `Person` スキーマ

---

## §7 Tech Stack 🟢

- **素の HTML / CSS / JS**
- フレームワーク: **使わない**
- npm パッケージ: **入れない**
- ビルドツール: **入れない**

**5年生存戦略**:
> 「5年後にビルドが通る」ための最強の保険は、ビルドしないこと。

---

## §8 Selected — Works Content 🟢

### Work 01 — Joshirushi (城印)

| 項目 | 内容 |
|---|---|
| **Title** | Joshirushi |
| **Year** | 2026 |
| **Status** | Released on the App Store, April 2026 |
| **Role** | Solo — designed, coded, and shipped |
| **Tech** | SwiftUI · SwiftData · App Clip · RevenueCat · Core Location · Firebase Auth |
| **One-liner (EN)** | A travel companion for Japanese castle hunters. |
| **One-liner (JA)** | 御城印を集める城巡りアプリ。 |
| **Link** | https://apps.apple.com/app/id6761773123 |

#### Outcome / Highlights

- Released on the App Store in **April 2026** — my first shipped app.
- **App Clip integration**: travelers can collect a stamp at a castle without installing the full app.
- **Geofence notifications** surface nearby castles automatically.
- Bundled with a curated dataset of Japan's **100 most famous castles** plus the full national list.
- Monetized with RevenueCat subscriptions.

#### Notable Engineering Decision

> Splitting the castle dataset between the full app and the App Clip — keeping the App Clip under Apple's 15MB limit while still letting first-time visitors check in at any of the 100 most famous castles immediately.

---

### Work 02 — Mentor AI

| 項目 | 内容 |
|---|---|
| **Title** | Mentor AI |
| **Year** | 2026 |
| **Status** | Coming to the App Store, 2026 |
| **Role** | Solo |
| **Tech** | SwiftUI · iOS Speech Framework · MLX · Gemma 4B (on-device) |
| **One-liner (EN)** | An interview reflection coach that never leaves your phone. |
| **One-liner (JA)** | 録音もAI分析も完全オンデバイスで動く面接振り返りアプリ。 |
| **Link** | (Coming soon) |

#### Outcome / Highlights

- Records practice interviews and turns them into structured feedback — **without sending audio or text anywhere**.
- Built on Apple's **MLX framework** with a quantized **Gemma 4B** model running locally.
- Speech-to-text via Apple's on-device Speech framework.
- Designed for Japanese-speaking job seekers preparing for real interviews.

#### Why on-device LLM

> Interview content is personal — what you said, what you couldn't say, what you wish you'd said. It shouldn't have to leave the device to be useful.

---

## §9 5-Year Stress Test 🟢

このサイトは下記すべての状態で破綻しないこと:

| 状態 | 検証 |
|---|---|
| Selected が **2件**(現状) | 縦スタック大カード、贅沢な見せ方 ✅ |
| Selected が **5件** | 同じ縦スタックを継続、3〜5件目を追加 |
| Selected が **10件超** | `→ Recent projects` のリンク先 `/works/` をグリッド一覧に |
| Apps が 0個 / 1個 / 5個 | `/apps/` レイアウトがどれでも美しい |
| 専門性の変化 | About を1段落書き換えるだけで対応 |
| 5年後のブラウザ | 外部依存ゼロのため確実に動く |
| 404 / JS オフ | 全機能が JS なしで動く設計を維持 |

---

## §10 Next Actions

1. ✅ ~~壁打ち~~
2. ✅ ~~Works 選定~~
3. ✅ ~~v3 計画書~~
4. **🔴 Joshirushi のスクリーンショット用意**(App Store スクショ流用OK、3-5枚)
5. **🔴 Mentor AI のスクリーンショット用意**(現在の進捗のものでOK、なければモックでも可)
6. **🔴 OGP 画像 1200×630 制作**(背景 #FAFAF7 + Display 書体で `yasuda-dev`)
7. **🔴 ファビコン制作**(`y` 一文字モノグラム、SVG)
8. **コーディング着手** → 静的 HTML/CSS/JS で実装
9. Lighthouse 100 達成
10. yasuda-dev.com に反映

→ **4〜7 は本人作業**(画像制作)。**8 は私が着手可能**(画像はプレースホルダーで先行実装可能)。

---

## Appendix A — References

### 海外・個人開発者(Editorial Minimalism)

- paco.me — Paco Coursey
- rauno.me — Rauno Freiberg
- leerob.io — Lee Robinson
- emilkowal.ski — Emil Kowalski
- nuno.computer — Nuno Pereira
- frankchimero.com — Frank Chimero(編集デザインの教科書)

### スタジオ系

- ueno.co
- linear.app
- vercel.com/design

### 国内

- 🔴 本人が好きな国内サイトを2-3個追加してほしい(反映したい場合)
