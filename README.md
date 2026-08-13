# シクミAIコンサル LP

非エンジニアのビジネス職向け AI・Claude Code 伴走型スクールのランディングページ。

## 技術スタック
- Next.js 14 (App Router) / TypeScript
- Supabase(無料相談フォームの保存先)
- Vercel(ホスティング)

## セットアップ

```bash
npm install
cp .env.local.example .env.local   # Supabase設定を記入(未設定でも動作します)
npm run dev
```

## Supabase設定
1. Supabaseプロジェクトで `supabase/schema.sql` を SQL Editor から実行
2. `.env.local` に以下を設定
   - `NEXT_PUBLIC_SUPABASE_URL`: プロジェクトURL
   - `SUPABASE_SERVICE_ROLE_KEY`: service_role キー(サーバー側のみで使用)

※ 未設定の場合、フォームは受理されサーバーログに内容が出力されます(本番前に必ず設定してください)。

## Vercelデプロイ
1. GitHubリポジトリにpush
2. Vercelでimportし、環境変数を設定(`.env.local.example` 参照)
3. デプロイ

## LINE連携

### 全体像
| 機能 | 実体 | 必要な設定 |
|---|---|---|
| LPからLINEへの導線(3か所) | `lib/line.ts` | なし(URL設定済み) |
| 申込送信後の自動遷移 | `components/ConsultForm.tsx` | なし |
| リッチメニュー | `line/` | チャネルアクセストークン |
| 友だち追加時の自動あいさつ・キーワード返信 | `app/api/line/webhook/` | チャネルシークレット + トークン |

### 1. Webhook(自動あいさつ・キーワード返信)

**Vercelに環境変数を設定してデプロイ**
```
LINE_CHANNEL_SECRET=...        # LINE Developers > チャネル基本設定
LINE_CHANNEL_ACCESS_TOKEN=...  # LINE Developers > Messaging API設定(長期トークン)
NEXT_PUBLIC_SITE_URL=https://本番URL
```

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

```bash
npm run dev                                    # 別ターミナルで起動
npm run line:image                             # 原画→ line/richmenu.png
SITE_URL=https://本番URL \
LINE_CHANNEL_ACCESS_TOKEN=... \
npm run line:setup                             # LINEに登録
```

- 文言・リンク先の定義: `line/richmenu.tiles.json`(ここが唯一の正)
- 原画: `app/line-richmenu/page.tsx`(LPと同じフォントで描くためのページ。noindex)
- `npm run line:setup -- --dry-run` で、APIを呼ばずに送信内容だけ確認できます
- `npm run line:image` にはPlaywrightが必要です
  (`npm i -D playwright && npx playwright install chromium`)

画像を作り直さず文言だけ変えた場合でも、`line:image` → `line:setup` の順で
実行してください(画像と当たり判定がずれます)。

## 今後のTODO
- [ ] 講師写真の差し込み(`.teacher-photo`)
- [ ] 特定商取引法に基づく表記/プライバシーポリシーページの作成
- [ ] TimeRex等の日程調整ツール連携(フォーム送信後の導線)
- [ ] GA4計測タグの設置
- [ ] OGP画像(`public/og.png` 1200x630)の作成と`layout.tsx`への追加
- [ ] 申込通知(メール or LINE Notify or Slack)
