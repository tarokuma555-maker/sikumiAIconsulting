# シクミAIコンサル LP

非エンジニアのビジネス職向け AI・Claude Code 伴走型スクールのランディングページ。

## 技術スタック
- Next.js 14 (App Router) / TypeScript
- Vercel(ホスティング)

## セットアップ

```bash
npm install
npm run dev
```

## 申込導線
問い合わせフォームは廃止し、CTAはすべて日程調整ページ(Googleカレンダー)と
LINE公式アカウントに直結しています。URLは `site.config.json` で管理。

`supabase/` と `.env.local.example` のSupabase設定は、フォーム時代の名残です。
過去の申込データがテーブルに残っている場合に備えて残してあります。
不要であればディレクトリごと削除して構いません。

## Vercelデプロイ
1. GitHubリポジトリにpush
2. Vercelでimportし、環境変数を設定(`.env.local.example` 参照)
3. デプロイ

## LINE連携

### 全体像
| 機能 | 実体 | 必要な設定 |
|---|---|---|
| LPの全CTA(無料相談ボタンの隣のLINEボタン) | `app/page.tsx` / `lib/line.ts` | なし(設定済み) |
| リッチメニュー | `line/` | チャネルアクセストークン |
| 友だち追加時の自動あいさつ・キーワード返信 | `app/api/line/webhook/` | チャネルシークレット + トークン |

### URLの変更
サイトURLとLINEのURLは **`site.config.json`** にまとまっています。
移転やアカウント変更のときはこのファイルだけ直せば、LP・LINEのメッセージ・
リッチメニューのすべてに反映されます(リッチメニューは `line:setup` の再実行が必要)。

### 1. Webhook(自動あいさつ・キーワード返信)

**Vercelに環境変数を設定してデプロイ**
```
LINE_CHANNEL_SECRET=...        # LINE Developers > チャネル基本設定
LINE_CHANNEL_ACCESS_TOKEN=...  # LINE Developers > Messaging API設定(長期トークン)
```
(サイトURLは `site.config.json` から読むので設定不要です)

**LINE Developers 側の設定**
1. Messaging API設定 > Webhook URL に `https://本番URL/api/line/webhook` を登録
2. 「検証」を押して成功することを確認
3. 「Webhookの利用」をON
4. 「応答メッセージ」をOFF(ONのままだと定型文と二重に返信されます)
5. 「あいさつメッセージ」もOFF(Webhook側で送るため)

文面を変えたいときは `app/api/line/webhook/route.ts` の上部のみ編集してください。
キーワードに当たらないメッセージには**あえて返信しません**。管理画面から手動で
返信する際に、ボットが割り込まないようにするためです。

### 2. リッチメニュー

**画像は `line/richmenu.png` に生成済み**です。登録方法は2通りあります。

#### 方法A: 管理画面から登録(ターミナル不要)

LINE Official Account Manager > トークルーム管理 > リッチメニュー > 作成

| 項目 | 設定値 |
|---|---|
| タイトル | シクミAIコンサル メインメニュー(管理用。利用者には見えない) |
| メニューバーのテキスト | メニューを開く |
| メニューのデフォルト表示 | 表示する |
| テンプレート | 6分割(3列×2行)のもの |
| 背景画像 | `line/richmenu.png` をアップロード |

各エリアのアクション(左上から右へ、上段→下段の順):

| エリア | タイル | タイプ | 設定値 |
|---|---|---|---|
| A | 相談をはじめる | テキスト | `相談したいです` |
| B | 無料相談を申し込む | リンク | `{bookingUrl}`(日程調整ページ直リンク) |
| C | 料金プラン | リンク | `{siteUrl}/#plans` |
| D | サービス内容 | リンク | `{siteUrl}/#concept` |
| E | よくある質問 | リンク | `{siteUrl}/#faq` |
| F | 講師紹介 | リンク | `{siteUrl}/#teacher` |

`{siteUrl}` `{bookingUrl}` は `site.config.json` の値。
`npm run line:setup -- --dry-run` を実行すると、この表が実URL入りで出力されます。

#### 方法B: コマンドで登録

```bash
LINE_CHANNEL_ACCESS_TOKEN=... npm run line:setup
```

既存メニューの削除・作成・画像アップロード・全ユーザーへの適用まで一括で行います。
`-- --dry-run` を付けるとAPIを呼ばず、送信内容だけ表示します。

#### 文言やリンク先を変えるとき

リンク先の指定は2種類あります。
- `"path": "/#plans"` … サイト内リンク(`siteUrl` + path)
- `"config": "bookingUrl"` … `site.config.json` のキーを直接参照する外部リンク

1. `line/richmenu.tiles.json` を編集(ここが唯一の定義)
2. **ラベルを変えた場合のみ**画像を作り直す — タップ位置と絵がずれるため
   ```bash
   npm run dev            # 別ターミナルで起動しておく
   npm run line:image
   ```
   ※ Playwrightが必要: `npm i -D playwright && npx playwright install chromium`
3. 方法AまたはBで登録し直す

原画は `app/line-richmenu/page.tsx`(LPと同じフォントで描くためのページ。noindex)。

## 講師写真
`public/teacher.png`(または `.jpg` / `.jpeg` / `.webp`)を置くと、講師紹介セクションに
自動で表示されます。ファイルがない間は枠だけのプレースホルダーになるため、
置き忘れても画像リンク切れにはなりません。

- 表示サイズ: 240×240(正方形にトリミング)
- 推奨: 480×480以上の正方形。人物が中央に写っているもの

## 今後のTODO
- [ ] 特定商取引法に基づく表記/プライバシーポリシーページの作成
- [ ] GA4計測タグの設置
- [ ] OGP画像(`public/og.png` 1200x630)の作成と`layout.tsx`への追加
- [ ] 申込・予約数の計測(GA4のイベント設定)
